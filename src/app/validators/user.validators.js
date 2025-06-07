const joi = require("joi");
const { validate } = require("../utils/validation.util");

const userValidator = async (req, res, next) => {
  const schema = joi.object({
    email: joi.string().email().required(),
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    fullName: joi.string().required(),
    contact: joi.string().required(),
  });

  try {
    const isValidate = await validate(schema, req.body, res);
    if (isValidate) next();
  } catch (err) {
    console.log(err);
  }
};
module.exports = {
    userValidator
}