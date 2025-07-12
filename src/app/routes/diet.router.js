var express = require("express");

const dietController = require("../controllers/diet.controllers")
var router = express.Router();
const {dietValidator} = require("../validators/diet.validators");
// const { AdminAuthMiddleware } = require("../middleware/admin-auth.middleware");


router.post('/:userId/:date',dietValidator, dietController.addDiet);
router.get('/:userId', dietController.getDiet);

router.put('/:userId/:date/:id',dietValidator, dietController.updateDiet);

router.delete('/:userId/:date/:id', dietController.removeDiet);
router.post('/:userId/:fromDate/:toDate', dietController.copyDietToAnotherDay);

module.exports = router