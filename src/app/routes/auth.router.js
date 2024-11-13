var  express = require('express');

const {addLoginUser,upDateLoginUser,getLoginUsers,deleteLoginUser, login} = require('../controllers/auth.controllers')
var router = express.Router();

// router.get("/", getLoginUser);
router.post("/", addLoginUser);
router.post("/login", login);

router.get("/", getLoginUsers);
router.delete("/:id", deleteLoginUser);
router.put("/:id", upDateLoginUser)

module.exports = router;