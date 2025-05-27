var express = require("express");

const dietController = require("../controllers/diet.controllers")
var router = express.Router();
// const {userValidator} = require("../validators/user.validators");
// const { AdminAuthMiddleware } = require("../middleware/admin-auth.middleware");

// router.get('/', dietController.getNotes);
router.post('/', dietController.addNote);
// router.delete('/', dietController.deleteNote);


module.exports = router;