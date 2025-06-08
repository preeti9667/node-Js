const { HTTP_STATUS } = require("../constants/status.constant");
const userModel = require("../models/user.model");
const { verifyJwt } = require("../utils/jwt.util");

const AuthMiddleware = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(HTTP_STATUS.unAuthorize).json({
        status: HTTP_STATUS.unAuthorize,
        message: "Unauthorized",
      });
    }
    const [method, token] = authorization.split(" ");

    if (method !== "Bearer" || !token) {
      return res.status(HTTP_STATUS.unAuthorize).json({
        status: HTTP_STATUS.unAuthorize,
        message: "Unauthorized",
      });
    }

    const decodedToken = await verifyJwt(token);
    const userId = decodedToken.id;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(HTTP_STATUS.unAuthorize).json({
        status: HTTP_STATUS.unAuthorize,
        message: "Unauthorize",
      });
    }
    req.userId = user._id;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server Error" });
  }
};

module.exports = { AuthMiddleware };
