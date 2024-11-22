var express = require("express");

const meetingList = require("../controllers/meeting.controllers")
var router = express.Router();

router.get("/", meetingList.getMeetingList )
router.get("/:id", meetingList.getMeeting )

router.post("/", meetingList.createMeeting )


module.exports = router