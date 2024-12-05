const { HTTP_STATUS } = require("../constants/status.constant");

const validate = async (schema, body, res) => {

  try {
    const response = await schema.validate(body);
    if (response.error) {
      const errors = response.error.details.map((e) => (e = e.message));
      res.status(HTTP_STATUS.badRequest).json({
        status: HTTP_STATUS.badRequest,
        message: "Validation failed",
        errors,
      });
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

module.exports = {
  validate
};
