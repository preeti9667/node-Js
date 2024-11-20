
var express = require("express");

const adminController = require("../controllers/admin.controllers")
const adminValidator = require('../validators/admin.validators');
const userController= require("../controllers/user.controller");

var router = express.Router();


router.post("/login", adminValidator.adminLoginValidator, adminController.login)
router.get("/profile", adminController.getAdminUser)


router.get('/user-profile/:id',userController.getUser);


module.exports = router