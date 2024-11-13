const jwt = require("jsonwebtoken");

const createJwt = async (payload, expiresIn) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn,
  });
  return token;
};

module.exports = {
  createJwt,
};
