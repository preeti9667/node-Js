var express = require("express");

const meetingList = require("../controllers/meeting.controllers")
var router = express.Router();

router.get("/", meetingList.getMeetingList );

router.get("/:id", meetingList.getMeeting )

router.post("/", meetingList.createMeeting )

router.put("/:id", meetingList.aditMeeting)

router.put("/:id/status", meetingList.updateMeetingStatus)

router.delete("/:id", meetingList.deleteMeeting )

module.exports = router