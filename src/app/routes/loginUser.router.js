var  express = require('express');

const {addLoginUser,getLoginUser} = require('../controllers/loginUser.controllers')
var router = express.Router();

router.get("/", getLoginUser);
router.post("/", addLoginUser);

module.exports = router;