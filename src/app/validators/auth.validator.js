const joi = require("joi");
const { validate } = require("../utils/validation.util");

const signupValidator = async (req, res, next) => {
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    fullName: joi.string().required(),
  });

  try {
    const isValidate = await validate(schema, req.body, res);
    if (isValidate) next();
  } catch (err) {
    console.log(err);
  }
};

const loginValidator = async (req, res, next) => {
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
  });
  if (await validate(schema, req.body, res)) next();
};


module.exports = {
    loginValidator,
    signupValidator
}
