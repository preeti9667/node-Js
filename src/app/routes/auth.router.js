var express = require("express");

const {
  login,
  signUp,
} = require("../controllers/auth.controllers");
var router = express.Router();

// router.get("/", getLoginUser);
router.post("/signup", signUp);
router.post("/login", login);

module.exports = router;
