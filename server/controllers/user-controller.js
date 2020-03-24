const { validationResult } = require("express-validator");

const mongoose = require("mongoose");
const HttpError = require("../modals/http-error");
const User = require("../modals/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
const crypto = require("crypto");

const login = async (req, res, next) => {
  const { password, email } = req.body;
  let user;
  try {
    user = await User.findOne({ email });
  } catch (err) {
    return next(
      new HttpError("Loggin in failed, please try again later.", 501)
    );
  }

  if (!user) {
    return next(
      new HttpError("Invalid credentials, could not log you in.", 404)
    );
  }
  let validPassword;
  try {
    validPassword = await bcrypt.compare(password, user.password);
  } catch (err) {
    return next(
      new HttpError("Invalid credentials, could not log you in.", 404)
    );
  }
  if (!validPassword) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      401
    );
    return next(error);
  }
  let token;
  try {
    token = jwt.sign(
      {
        _id: user.id,
        email: user.email,
        name: user.name
      },
      "foresst-gump",
      { expiresIn: "1m" }
    );
  } catch (err) {
    return next(
      new HttpError("Loggin in failed, please try again later..", 500)
    );
  }

  res.json({
    _id: user._id,
    email: user.email,
    name: user.name,
    token
  });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { email, password, name } = req.body;
  let user;
  try {
    user = await User.findOne({ email });
  } catch (err) {
    return next(
      new HttpError("Signing up failed, please try again later.", 500)
    );
  }
  if (user) {
    return next(
      new HttpError("User exists already, please login instead.", 422)
    );
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError("Could not signup, please try again.", 500);
    return next(err);
  }
  const createdUser = new User({
    password: hashedPassword,
    email,
    name,
  });
  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }
  let token;
  try {
    token = jwt.sign(
      {
        _id: createdUser.id,
        email: createdUser.email,
        name
      },
      "foresst-gump",
      { expiresIn: "1m" }
    );
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }
  res.status(201).json({
    _id: createdUser.id,
    name: createdUser.username,
    email: createdUser.email,
    token: token
  });
};
const resetPassword = async (req, res, next) => {
  const { email } = req.body;

  let token;
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      const error = new HttpError(
        "Something went wrong, please try again later.",
        500
      );
      return next(error);
    }
    token = buffer.toString("hex");
  });
  let user;
  try {
    user = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, please try again later.",
      500
    );
    return next(error);
  }
  if (!user) {
    return next(
      new HttpError("This email is not logged in, please signup instead.", 422)
    );
  }
  try {
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 1800000;
    await user.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, please try again later.",
      500
    );
    return next(error);
  }
  sgMail.setApiKey(process.env.SG_KEY);
  sgMail.send({
    to: email,
    from: "test1@gmail.com",
    subject: "Password reset",
    html: `
            <p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
          `
  });

  res.status(200).json({ message: "an email has been send" });
};

const resetByToken = async (req, res, next) => {
  const resetToken = req.params.token;
  let user;
  try {
    user = await User.findOne({ resetToken }, "-password");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, please try again later.",
      500
    );
    return next(error);
  }
  if (!user) {
    const error = new HttpError(
      "invalid token , there is no user with this info.",
      422
    );
    return next(error);
  }

  res.status(200).json({
    resetTokenExpiration: user.resetTokenExpiration,
    userId: user._id
  });
};
const resetPasswordPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { userId, password } = req.body;
  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, please try again later.",
      500
    );
    return next(error);
  }
  if (!user) {
    const error = new HttpError(
      "Something went wrong, please try again later.",
      500
    );
    return next(error);
  }
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError("Could not signup, please try again.", 500);
    return next(err);
  }
  try {
    user.password = hashedPassword;
    user.resetTokenExpiration = Date.now() - 1800000 * 60;
    await user.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, please try again later.",
      500
    );
    return next(error);
  }
  res.status(201).json({
    message: "changed succfully!"
  });
};
module.exports = {
  login,
  logout,
  signup,
  resetPassword,
  resetByToken,
  getCurrentUser,
  resetPasswordPost
};
