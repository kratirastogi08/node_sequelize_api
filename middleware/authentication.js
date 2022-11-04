const jwt= require('jsonwebtoken');
const response=require('../CommonResponse/response')
const db = require("../db/db.config.js");
const Users = db.users;
const authentcation=(req,res,next)=>{
   try{
    console.log(req.headers)
    let token=req.headers.authorization;
    if(!token){
      response.error(res,400,"MISSING TOKEN")
    }  
    token=token.replace(/^Bearer\s+/,'')
    console.log(token)
    jwt.verify(token,process.env.SECRET_KEY,async(error,decoded)=>{
     if(error)
     {
        return response.error(res,400,'INVALID TOKEN')
     }
     else if(decoded.userId == 0 || undefined || '')
     {
        return response.error(res,400,"USER NOT FOUND")
     }
     else
     {
      const user= await Users.findOne({ where: { token } })
      console.log("user",user)
      
      if(user)
      {
        req.user={
            userId:user.dataValues.id,
            role:user.dataValues.role
        }
        console.log(req.user)
        return next()
      }
      else{
        return response.error(res,400,'TOKEN EXPIRED')
      }
     }
    })

   }
   catch(err)
   {
      next(err)
   }
}

const authorizedRoles=(roles)=>{
    return (req, res, next) =>{
     if(!roles.includes(req.user.role))
     {
         return response.error(res,403,"User doesn't have enough permission to access this")
     }
     next()
    }
}

module.exports={
    authentcation,
    authorizedRoles
}