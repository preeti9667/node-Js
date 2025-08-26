var express = require("express");

var router = express.Router();

const attendanceController = require("../controllers/attendance.controllers");
const { AdminAuthMiddleware } = require("../middleware/admin-auth.middleware");

router.post("/", attendanceController.addAttendance);
router.get('/', AdminAuthMiddleware, attendanceController.allAttendanceList);
router.delete('/:id', attendanceController.deleteAttendanceDate);

router.get('/users', attendanceController.getAllUsers);

router.put('/:id', attendanceController.updateUsersAttendanceByDate);





module.exports = router;