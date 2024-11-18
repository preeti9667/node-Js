
var express = require("express");

const adminController = require("../controllers/admin.controllers")
const adminValidator = require('../validators/admin.validators')

var router = express.Router();


router.post("/login", adminValidator.adminLoginValidator, adminController.login)
router.get("/login", adminController.getAdminUser)


module.exports = router