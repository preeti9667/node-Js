const joi = require("joi");
const { validate } = require("../utils/validation.util");
const { MEETING_STATUS, MEETING_TYPE} = require("../constants/meeting.constant");


const addMeetingValidator = async (req, res, next) => {
  const schema = joi.object({
    title: joi.string().required(),
    description: joi.string().required(),
    startDate: joi.string().required(),
    endDate: joi.string().required(),
    startTime: joi.string().required(),
    endTime: joi.string().required(),
    type: joi.string().valid(...Object.values(MEETING_TYPE)).required(),
    // status: joi.string().valid(...Object.values(MEETING_STATUS)).required()

  });

  if (await validate(schema, req.body, res)) next();

};

const upDateMeetingValidator = async (req, res, next) => {
  const schema = joi.object({
    status: joi.string().valid(...Object.values(MEETING_STATUS)).required()

  });

  if (await validate(schema, req.body, res)) next();

};
module.exports = {
   addMeetingValidator,
 upDateMeetingValidator
}
