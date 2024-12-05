var express = require("express");
const { getUser,getUsers} = require("../controllers/user.controller");
var router = express.Router();

/* GET users listing. */
router.get("/:id", getUser);
router.get("/", getUsers);

module.exports = router;
