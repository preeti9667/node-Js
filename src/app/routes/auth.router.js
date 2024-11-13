var express = require("express");

const {
  upDateLoginUser,
  getLoginUsers,
  deleteLoginUser,
  login,
  signUp,
} = require("../controllers/auth.controllers");
var router = express.Router();

// router.get("/", getLoginUser);
router.post("/signup", signUp);
router.post("/login", login);

router.get("/", getLoginUsers);
router.delete("/:id", deleteLoginUser);
router.put("/:id", upDateLoginUser);

module.exports = router;
