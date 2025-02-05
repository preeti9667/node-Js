var express = require("express");
const { getUser,getUsers, createUsers} = require("../controllers/user.controller");
var router = express.Router();
const {userValidator} = require("../validators/user.validators");
const { AdminAuthMiddleware } = require("../middleware/admin-auth.middleware");

/* GET users listing. */
router.get("/:id", getUser);
router.get("/", AdminAuthMiddleware,getUsers);
router.post("/", userValidator, createUsers )


module.exports = router;
