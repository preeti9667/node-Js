const  passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const loginUserModel = require("./src/app/models/loginUser.model");



passport.use(new LocalStrategy( async(email,password,done)=>{
    try{
      const user = await loginUserModel.findOne({email});
      if(!user){
        return  done(null, false,{message:"incorrect email"});
      }
    
      const passwordMatch = await user.comparePassword(password);
    
      if(!passwordMatch)
        return done(null, user);
    
      else{
        return  done(null, false,{message:"incorrect password"});
      }
    
    }catch(error){
     return done(error)
    }
}))    
module.exports = passport;