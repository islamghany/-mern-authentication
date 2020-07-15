const validator = require("validator");
const jwt = require("jsonwebtoken");

const User = require("../modals/user-modal");
const Category = require("../modals/category-model");
const Product = require("../modals/product-model");

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const fetch = require('node-fetch');

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
  signin: async ({ userInput }) => {
    const errors = [];
    if (!validator.isEmail(userInput.email)) {
      errors.push({ message: "E-Mail is invalid." });
    }
    if (
      validator.isEmpty(userInput.password) ||
      !validator.isLength(userInput.password, { min: 5 })
    ) {
      errors.push({ message: "Password too short!" });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid input.");
      error.data = errors;
      error.code = 422;
      throw error;
    }
    const existingUser = await User.findOne({ email: userInput.email });
    if (!existingUser || !existingUser.authenticate(userInput.password)) {
      const error = new Error("Invalid credentials, could not log you in");
      error.data = errors;
      error.code = 402;
      throw error;
    }
    let token;
    try {
      token = jwt.sign({ _id: existingUser._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
    } catch (err) {
      const error = new Error("Someting went wrong!");
      error.code = 500;
      throw error;
    }
    return { token: token, _id: existingUser._id.toString(),name:existingUser.name,email:existingUser.email };
  },
  signup: async ({ userInput }) => {
    const errors = [];
    if (!validator.isEmail(userInput.email)) {
      errors.push({ message: "E-Mail is invalid." });
    }
    if (
      validator.isEmpty(userInput.password) ||
      !validator.isLength(userInput.password, { min: 5 })
    ) {
      errors.push({ message: "Password too short!" });
    }
    if (
      validator.isEmpty(userInput.name) ||
      !validator.isLength(userInput.name, { min: 5 })
    ) {
      errors.push({ message: "Name too short!" });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid input.");
      error.data = errors;
      error.code = 422;
      throw error;
    }
    // check if user is already exist or not
    let existingUser;
    const {email,password,name}=userInput;
    try {
      existingUser = await User.findOne({ email });
    } catch (err) {
      return next(error);
      const error = new Error("Signing up failed, please try again later.");
      error.code = 500;
      throw error;
    }
    if (existingUser) {
      const error = new Error("User exists already, please login instead.");
      error.code = 422;
      throw error;
    }

    // user dos't exist
    // generate a token and send an email to activate this email
    try {
      const token = jwt.sign(
        { name, email,password },
        process.env.JWT_ACCOUNT_ACTIVATION,
        { expiresIn: "10m" }
      );
      const emailDate = {
        from: process.env.EMAIL_FORM,
        to: email,
        subject: "Account activation link",
        html: `<h1>Please use the following link to activate your account</h1>
          <p>${process.env.CLIENT_URL}/auth/activate-account/${token}</p>
          <hr />
          <p>this email may conatan sensitive information</p>
   	      <p>${process.env.CLIENT_URL}</p>
   	   `,
      };
      const sent = await sgMail.send(emailDate);
    } catch (err) {
      const error = new Error("Signing up failed, please try again later.");
      error.code = 500;
      throw error;
    }

    //email has beem sent
    return true;
  },
  accountActivation: async ({ token }) => {
    if (!token) {
      const error = new Error("Expired Link. Signup again");
      error.code = 401;
      throw error;
    }

    //if the token exist
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION);
    } catch (err) {
      const error = new Error("Expired Link. Signup again");
      error.code = 401;
      throw error;
    }
    if (!decodedToken) {
      const error = new Error("Expired Link. Signup again");
      error.code = 401;
      throw error;
    }

    //extract the data from token to make new account

    const { name, email, password } = decodedToken;
    let newUser = new User({ name, email, password });
    try {
      await newUser.save();
    } catch (err) {
      const error = new Error("Unknowen error please try again later.");
      error.code = 500;
      throw error;
    }
    return true;
  },
  forgetPassword: async ({ email }) => {
    let user;
    try {
      user = await User.findOne({ email });
    } catch (err) {
      const error = new Error("Unknowen error please try again later.");
      error.code = 500;
      throw error;
    }
    if (!user) {
      const error = new Error("Invalid email, This email dose not exist");
      error.code = 403;
      throw error;
    }

    try {
      const token = jwt.sign(
        { _id: user._id,email,name:user.name },
        process.env.JWT_RESET_PASSWORD,
        {
          expiresIn: "10m",
        }
      );
      const emailDate = {
        from: process.env.EMAIL_FORM,
        to: email,
        subject: "Password reset link",
        html: `<h1>Please use the following link to activate your account</h1>
          <p>${process.env.CLIENT_URL}/auth/reset-password/${token}</p>
          <hr />
          <p>this email may conatan sensitive information</p>
   	      <p>${process.env.CLIENT_URL}</p>
   	   `,
      };
      const sent = await sgMail.send(emailDate);
      user.resetPasswordLink = token;
      await user.save();
    } catch (err) {
      const error = new Error("Unknowen error please try again later.");
      error.code = 500;
      throw error;
    }
    return true;
  },
  resetPassword: async ({ resetPasswordLink, newPassword }) => {
    if (!resetPasswordLink) {
      const error = new Error("Expired Link. Signup again");
      error.code = 401;
      throw error;
    }
    let user;
    try {
      user = await User.findOne({ resetPasswordLink });
    } catch (err) {
      const error = new Error("Something went wrong. Try later");
      error.code = 500;
      throw error;
    }
    if (!user) {
      const error = new Error("Something went wrong. Try later");
      error.code = 400;
      throw error;
    }

    try {
      user.password = newPassword;
      user.resetPasswordLink = "";
      user.save();
    } catch (err) {
      const error = new Error("omething went wrong. Try later");
      error.code = 500;
      throw error;
    }
    return true;
  },
  addCategory: async ({ categoryInput }) => {
    const newCategory = new Category({
      name: categoryInput.name,
    });
    try {
      await newCategory.save();
    } catch (err) {
      const error = new Error("Someting went wrong!");
      error.code = 500;
      throw error;
    }
    return { ...newCategory._doc, _id: newCategory._id.toString() };
  },
  deleteCategory: async ({ _id }) => {
    console.log(_id);
    try {
      await Category.findByIdAndDelete(_id);
    } catch (err) {
      const error = new Error("Someting went wrong!");
      error.code = 500;
      throw error;
    }
    return true;
  },
  getCategories: async () => {
    let cates;
    try {
      cates = await Category.find({});
    } catch (err) {
      const error = new Error("Someting went wrong!");
      error.code = 500;
      throw error;
    }
    return {
      categories: cates.map((cate) => {
        return {
          ...cate._doc,
          _id: cate._id.toString(),
        };
      }),
    };
  },

  addProduct: async ({ productInput }) => {
    const { name, description, quantity, price, category } = productInput;
    if (!name || !description || !price || !category) {
      const error = new Error("Invalid inputs");
      error.code = 401;
      throw error;
    }
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      quantity,
    });
    try {
      await newProduct.save();
    } catch (err) {
      const error = new Error("Someting went wrong!");
      error.code = 401;
      throw error;
    }
    return { ...newProduct._doc, _id: newProduct._id };
  },
  getProduct: async ({ _id }) => {
    let existingProduct;

    try {
      existingProduct = await Product.findById(_id).populate("category");
    } catch (err) {
      const error = new Error("Someting went wrong!");
      error.code = 401;
      throw error;
    }
    if (!existingProduct) {
      const error = new Error("this product has been deleted");
      error.code = 401;
      throw error;
    }
    return {
      ...existingProduct._doc,
      _id: existingProduct._id,
    };
  },
  getProducts: async () => {
    let products;
    try {
      products = await Product.find({});
    } catch (err) {
      const error = new Error("Someting went wrong, Please try again later");
      error.code = 500;
      throw error;
    }
    return products.map(product=>{
    	return {
          ...product._doc,
          _id: product._id,
        };
    })
  },
  deleteProduct: async ({ _id }) => {
    let x;
    console.log(_id);
    try {
      x = await Product.findByIdAndDelete(_id);
    } catch (err) {
      const error = new Error("This product is not is already deleted");
      error.code = 401;
      throw error;
    }
    if (!x) {
      const error = new Error("This product is not is already deleted");
      error.code = 401;
      throw error;
    }
    return true;
  },
  googleLogin:async ({idToken})=>{
    let res;
     try{
       res = await client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });     
     }catch(err){
      const error = new Error("Google login failed. Try again");
      error.code = 400;
      throw error;
     }
     if(!res){
      const error = new Error("Google login failed. Try again");
      error.code = 400;
      throw error;
     }
      const { email_verified, name, email } = res.payload;
      if(email_verified){
      let existingUser;
      try{
        existingUser = await User.findOne({email});  
      }catch(err){
         const error = new Error("Google login failed. Try again");
         error.code = 400;
         throw error;
      }
      if(existingUser){
        const token = jwt.sign({ _id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        return { token: token, _id: existingUser._id.toString(),name:existingUser.name,email:existingUser.email };
      }
      let password = email + process.env.JWT_SECRET;
      let user= new User({ name, email, password });
      try{
       await user.save();
      }catch(err){
        const error = new Error("Google login failed. Try again");
         error.code = 400;
         throw error;
      }
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      return { token: token, _id: user._id.toString(),name:user.name,email:user.email };

    }else{
      const error = new Error("Google login failed. Try again");
      error.code = 400;
      throw error;
    }
  },
  facebookLogin:async ({_id,accessToken})=>{
    const url = `https://graph.facebook.com/v2.11/${_id}/?fields=id,name,email&access_token=${accessToken}`;
    let res;
    try{
     const resJson = await fetch(url,{method:'GET'});
     res = await resJson.json();
    }catch(err){
      const error = new Error("Facebook login failed. Try again");
      error.code = 400;
      throw error;
    }
    if(!res){
       const error = new Error("Facebook login failed. Try again");
      error.code = 400;
      throw error;
    }
     const { email, name } = res;
     let existingUser;
     try{
      existingUser = await User.findOne({email});
     }catch(err){
      const error = new Error("Facebook login failed. Try again");
      error.code = 400;
      throw error;
     }
     if(existingUser){
      const token = jwt.sign({ _id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        return { token: token, _id: existingUser._id.toString(),name:existingUser.name,email:existingUser.email };
     }
     let password = email + process.env.JWT_SECRET;
      let user= new User({ name, email, password });
      try{
       await user.save();
      }catch(err){
        const error = new Error("Google login failed. Try again");
         error.code = 400;
         throw error;
      }
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      return { token: token, _id: user._id.toString(),name:user.name,email:user.email };
  }
};
