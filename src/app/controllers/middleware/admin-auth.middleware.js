const { HTTP_STATUS } = require("../../constants/status.constant");
const adminModel = require("../../models/admin.model");
const { verifyJwt } = require("../../utils/jwt.util");

const AdminAuthMiddleware = async (req, res, next) => {
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
    const adminId = decodedToken.id;
    const admin = await adminModel.findById(adminId);

    if (!admin) {
      return res.status(HTTP_STATUS.unAuthorize).json({
        status: HTTP_STATUS.unAuthorize,
        message: "Unauthorize",
      });
    }
    req.adminId = admin._id;
    next();
  } catch (error) {j
    console.error(error);
    res.status(500).json({ error: "Internal server Error" });
  }
};

module.exports = { AdminAuthMiddleware };
