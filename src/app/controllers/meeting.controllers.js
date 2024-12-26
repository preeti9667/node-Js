const meetingModel = require("../models/meeting.model");
const { HTTP_STATUS } = require("../constants/status.constant");
const moment = require("moment");
const { MEETING_STATUS } = require("../constants/meeting.constant");

// createMeeting

async function createMeeting(req, res, next) {
  const { title, description, date, startTime, endTime, status } = req.body;

  const EndTime = moment(endTime, "hh:mm A").format("hh:mm A");
  const StartTime = moment(startTime, "hh:mm A").format("hh:mm A");
  const meetingDate = moment(date).toDate();

  const todayDate = new Date();

  if (todayDate > meetingDate) {
    return res.status(HTTP_STATUS.badRequest).json({
      status: HTTP_STATUS.badRequest,
      message: "Invalid meeting date",
    });
  }

  try {
    const isExists = await meetingModel.exists({ title });

    if (isExists) {
      return res.status(HTTP_STATUS.conflict).json({
        status: HTTP_STATUS.conflict,
        message: "title exists already",
      });
    }

    const meeting = await meetingModel.create({
      title,
      description,
      date: meetingDate,
      startTime: StartTime,
      endTime: EndTime,
      status,
    });

    return res.status(200).json({
      meeting,
      status: HTTP_STATUS.success,
      message: "Meeting create",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server Error" });
  }
}

async function getMeetingList(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;
    const skip = (page - 1) * limit;

    const status = req.query.status;
    const match = {};
    const meetingDate = req.query.date;
    const fromDate = req.query.fromDate;
    const toDate = req.query.toDate;

    const search = req.query.search;

    if (status) {
      match.status = status;
    }

    if (meetingDate) {
      match.date = meetingDate;
    }

    if (fromDate && toDate) {
      match.date = {
        $gte: moment(fromDate).toDate(),
        $lte: moment(toDate).toDate(),
      };
    } else {
      if (fromDate) {
        match.date = {
          $gte: moment(fromDate).toDate(),
        };
      }

      if (toDate) {
        match.date = {
          $lte: moment(toDate).toDate(),
        };
      }
    }

    if (search) {
      match.title = { $regex: search, $options: "i" };
    }

    const count = await meetingModel.countDocuments(match);
    const list = await meetingModel.find(match).skip(skip).limit(limit);

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
    const meeting = await meetingModel.findById({ _id: meetingId });

    return res.status(200).json({ meeting });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server Error" });
  }
}

// editMeeting

async function editMeeting(req, res, next) {
  const { title, description, date, startTime, endTime, status } = req.body;

  const EndTime = moment(endTime, "hh:mm A").format("hh:mm A");
  const StartTime = moment(startTime, "hh:mm A").format("hh:mm A");
  const Date = moment(date, "L").format("L");

  try {
    const meetingId = req.params.id;
    const meeting = await meetingModel.findById({ _id: meetingId });

    if (!meeting) {
      res.status(400).json({ message: "meeting not found" });
    }

    const upDateData = await meetingModel.findByIdAndUpdate(
      meetingId,
      {
        title,
        description,
        date: Date,
        startTime: StartTime,
        endTime: EndTime,
        status,
      },
      { new: true }
    );

    return res.status(200).json({
      upDateData,
      status: HTTP_STATUS.success,
      message: "change value successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server Error" });
  }
}

// updateMeetingStatus

async function updateMeetingStatus(req, res, next) {
  try {
    const { status } = req.body;
    const meetingId = req.params.id;
    const meetingIdM = await meetingModel.findById({ _id: meetingId });

    const meeting = await meetingModel.findByIdAndUpdate(
      meetingIdM,
      { status },
      { new: true }
    );

    if (!meeting) {
      res.status(400).json({ message: "meeting not found" });
    }

    return res.status(200).json({
      meeting,
      status: HTTP_STATUS.success,
      message: "",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server Error" });
  }
}

// delete meeting

async function deleteMeeting(req, res, next) {
  try {
    const meetingId = req.params.id;
    const meeting = await meetingModel.findOneAndDelete({ _id: meetingId });

    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found." });
    }

    return res.status(200).json({
      status: HTTP_STATUS.success,
      message: "meeting deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server Error" });
  }
}

module.exports = {
  getMeetingList,
  createMeeting,
  getMeeting,
  editMeeting,
  updateMeetingStatus,
  deleteMeeting,
};
