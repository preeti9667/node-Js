var express = require("express");

const {
  login,
  signUp,
} = require("../controllers/auth.controllers");
const {loginValidator, signupValidator} = require("../validators/auth.validator");
var router = express.Router();

// router.get("/", getLoginUser);
router.post("/signup",signupValidator, signUp);
router.post("/login",loginValidator, login);

module.exports = router;
