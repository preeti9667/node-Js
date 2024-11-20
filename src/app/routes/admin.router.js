var express = require("express");

const adminController = require("../controllers/admin.controllers");
const adminValidator = require("../validators/admin.validators");
const userController = require("../controllers/user.controller");
const { AdminAuthMiddleware } = require("../middleware/admin-auth.middleware");

var router = express.Router();

router.post(
  "/login",
  adminValidator.adminLoginValidator,
  adminController.login
);
router.get("/profile", AdminAuthMiddleware, adminController.getAdminUser);

router.get("/user-profile/:id", AdminAuthMiddleware, userController.getUser);

module.exports = router;
