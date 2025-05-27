var express = require("express");

var router = express.Router();

const participateController = require("../controllers/participate.controllers");
const { AdminAuthMiddleware } = require("../middleware/admin-auth.middleware");

router.post("/", participateController.addParticipate);
router.get('/:id',AdminAuthMiddleware, participateController.participantList);
router.get('/:id/search-users',AdminAuthMiddleware, participateController.searchUserForParticipant);



module.exports = router;