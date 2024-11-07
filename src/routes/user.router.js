var express = require("express");
const { getUser } = require("../controllers/user.controller");
var router = express.Router();

/* GET users listing. */
router.get("/", getUser);

module.exports = router;
