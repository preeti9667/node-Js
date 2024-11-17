 const joi = require("joi");

 const { validate } = require("../utils/validation.util");

 const adminUserValidators = async(req,res, next)=>{
    const schema = joi.object({
        email: joi.string().email().required(),
    password: joi.string().min(6).required(),
    name: joi.string().required(),
    phone: joi.string().min(10).max(10).required(),
    })


    try {
        const isValidate = await validate(schema, req.body, res);
        if (isValidate) next();
      } catch (err) {
        console.log(err);
      }

 }


 const adminLoginValidator = async (req, res, next) => {
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
  });
  if (await validate(schema, req.body, res)) next();
};

 module.exports ={
  adminUserValidators,
    adminLoginValidator 
 }