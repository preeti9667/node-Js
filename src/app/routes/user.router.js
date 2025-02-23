var express = require("express");
const userController = require("../controllers/user.controller");
var router = express.Router();
const {userValidator} = require("../validators/user.validators");
const { AdminAuthMiddleware } = require("../middleware/admin-auth.middleware");

/* GET users listing. */
router.get("/:id", userController.getUser);
router.get("/", AdminAuthMiddleware, userController.getUsers);
router.post("/", userValidator, userController.createUsers);
router.put("/:id/status", userController.userStatus); 

module.exports = router;
