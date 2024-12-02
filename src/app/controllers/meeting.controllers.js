const meetingModel = require("../models/meeting.model");
const { HTTP_STATUS } = require("../constants/status.constant");
const moment = require("moment");

async function createMeeting(req, res, next) {
  const { title, description, date, startTime, endTime, status } = req.body;

  const start24Hour = moment(startTime, "HH:mm").format("hh:mm A");
  const end24Hour = moment(endTime, "HH:mm").format("hh:mm A");

  try {
    const isExists = await meetingModel.exists({ title });

    if (isExists) {
      return res.status(HTTP_STATUS.conflict).json({
        status: HTTP_STATUS.conflict,
        message: "title exists already",
      });
    }

    if (!title || !description || !date || !startTime || !endTime || !status) {
      return res
        .status(400)
        .json({ message: "All fields are required except status." });
    }

    if (!["created", "ongoing", "completed", "canceled"].includes(status)) {
      return res
        .status(400)
        .json({
          message:
            'Invalid status value. Use " created","ongoing", completed, or canceled.',
        });
    }

    const meeting = await meetingModel.create({
      title,
      description,
      date,
      startTime: start24Hour,
      endTime: end24Hour,
      status,
    });

    return res.status(200).json({
      meeting,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server Error" });
  }
}

async function getMeetingList(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const count = await meetingModel.countDocuments();
    const list = await meetingModel.find({}).skip(skip).limit(limit);

    return res.status(HTTP_STATUS.success).json({
      status: HTTP_STATUS.success,
      message: "Meetings list",
      data: {
        count,
        page,
        limit,
        list,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server Error" });
  }
}

async function getMeeting(req, res, next) {
  try {
    const meetingId = req.params.id;
    const meeting = await meetingModel.findById(meetingId);

    return res.status(200).json({ meeting });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server Error" });
  }
}

async function aditMeeting(req, res, next) {
  const { title, description, date, startTime, endTime, status } = req.body;

  const start24Hour = moment(startTime, "HH:mm").format("hh:mm A");
  const end24Hour = moment(endTime, "HH:mm").format("hh:mm A");

  try {
    const meetingId = req.params.id;
    const meeting = await meetingModel.findById(meetingId);

    if (!meeting) {
      res.status(400).json({ message: "meeting not found" });
    }

    if (!["created", "ongoing", "completed", "canceled"].includes(status)) {
      return res.status(400).json({
        message:
          'Invalid status value. Use " created","ongoing", completed, or canceled.',
      });
    }

    const upDateData = await meetingModel.findByIdAndUpdate(
      meetingId,
      {
        title,
        description,
        date,
        startTime: start24Hour,
        endTime: end24Hour,
        status,
      },
      { new: true }
    );

    return res.status(200).json({ upDateData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server Error" });
  }
}

async function updateMeetingStatus(req, res, next) {
  try {
    const { status } = req.body;
    const meetingId = req.params.id;
    const meetingIdM = await meetingModel.findById(meetingId);
    //  console.log(meetingIdM)

    if (
      !status ||
      !["created", "ongoing", "completed", "canceled"].includes(status)
    ) {
      return res.status(400).json({
        message:
          'Invalid status. It should be one of:" created","ongoing", completed, or canceled.',
      });
    }

    const meeting = await meetingModel.findByIdAndUpdate(
      meetingIdM,
      { status },
      { new: true }
    );

    if (!meeting) {
      res.status(400).json({ message: "meeting not found" });
    }

    return res.status(200).json({ meeting });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server Error" });
  }
}

async function deleteMeeting(req, res, next) {
  try {
    const meetingId = req.params.id;
    const meeting = await meetingModel.findOneAndDelete(meetingId);

    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found." });
    }

    return res.status(200).json({ message: "meeting deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server Error" });
  }
}

module.exports = {
  getMeetingList,
  createMeeting,
  getMeeting,
  aditMeeting,
  updateMeetingStatus,
  deleteMeeting,
};
