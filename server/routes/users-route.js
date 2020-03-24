const express = require("express");
const { check } = require("express-validator");
const userController = require("../controllers/user-controller");

const router = express.Router();

router.post(
  "/login",
  [check("email").isEmail(), check("password").isLength({ min: 6, max: 32 })],
  userController.login
);
router.post(
  "/signup",
  [
    check("email")
      .normalizeEmail()
      .isEmail(),
    check("name").isLength({ min: 6 }),
    check("password").isLength({ min: 6 })
  ],
  userController.signup
);
router.post(
  "/reset",
  [
    check("email")
      .normalizeEmail()
      .isEmail()
  ],
  userController.resetPassword
);

router.get("/reset/:token", userController.resetByToken);
router.post(
  "/reset/resetPassword",
  [check("password").isLength({ min: 6 })],
  userController.resetPasswordPost
);



module.exports = router;
