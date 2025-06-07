const joi = require("joi");
const { validate } = require("../utils/validation.util");

const dietValidator = async (req, res, next) => {
  const schema = joi.object({
    time: joi.string().required(),
    text: joi.string().required(),
  });

  try {
    const isValidate = await validate(schema, req.body, res);
    if (isValidate) next();
  } catch (err) {
    console.log(err);
  }
};
module.exports = {
  dietValidator
}