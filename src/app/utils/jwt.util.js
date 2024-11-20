const jwt = require("jsonwebtoken");

const createJwt = async (payload, expiresIn) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn,
  });
  return token;
};

const verifyJwt = async (token) => {
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);
  return decoded;
};

module.exports = {
  createJwt,
  verifyJwt
};

