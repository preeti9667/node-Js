
var express = require("express");

const adminController = require("../controllers/admin.controllers")
const adminValidator = require('../validators/admin.validators')

var router = express.Router();


// router.post("/singUp",adminSignUpValidators, signUp)
router.post("/login", adminValidator.adminLoginValidator, adminController.login)


module.exports = router