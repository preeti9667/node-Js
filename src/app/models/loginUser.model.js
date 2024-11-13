const mongoose = require("mongoose");
const { Schema } = mongoose;
// const bcrypt = require("bcrypt")

const loginUserSchema = new Schema({
    email:{
        
    type: String,

    },
    password:{
    
    type: Number
    }
})

// loginUserSchema.pre('save', async function (next) {
//     const person = this;

//     if(!person.isModified("password"))return next()

//     try{

//         const salt = await bcrypt.genSalt(10);
//         const hashPassword = await bcrypt.hashPassword(person.password, salt);
//         person.password = hashPassword;
       
//         next();

//     }catch(err){
//         return next(err)
//     }
// })

// loginUserSchema.methods.comparePassword = async function (candidatePassword){
//     try{

//         const isMatch = await bcrypt.compare(candidatePassword, this.password);
//         return isMatch;

//     }catch(err){
// throw err
//     }
// }

const loginUserModel = mongoose.model("loginUser", loginUserSchema);
module.exports = loginUserModel;
