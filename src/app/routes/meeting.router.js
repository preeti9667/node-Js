var express = require("express");

const meetingList = require("../controllers/meeting.controllers")

const {addMeetingValidator, upDateMeetingValidator} = require("../validators/meeting.validators");
const { AdminAuthMiddleware } = require("../middleware/admin-auth.middleware");

var router = express.Router();

router.get("/", AdminAuthMiddleware, meetingList.getMeetingList );

router.get("/:id", meetingList.getMeeting )

router.post("/",addMeetingValidator, meetingList.createMeeting )

router.put("/:id",addMeetingValidator, meetingList.editMeeting)

router.put("/:id/status",upDateMeetingValidator, meetingList.updateMeetingStatus)

router.delete("/:id", meetingList.deleteMeeting )

module.exports = router