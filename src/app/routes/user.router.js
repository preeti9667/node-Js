var express = require("express");
const { getUser, addUser, upDateUser, deleteUser} = require("../controllers/user.controller");
var router = express.Router();

/* GET users listing. */
router.get("/", getUser);
router.post('/', addUser);
router.put("/:id", upDateUser)
router.delete("/:id", deleteUser)

module.exports = router;
