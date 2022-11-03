const db = require("../db/db.config");
const bcrypt=require('bcrypt');
const Users = db.users;
const response=require('../CommonResponse/response')
const jwt=require('jsonwebtoken');

const registration = async (req,res,next) => {
    try{
        const { firstName, lastName, password, email, phone,role } = req.body;
        const hashedPassword=await bcrypt.hash(password,10)
        
         const newUser= await db.sequelize.query(`INSERT INTO "Users" ("firstName", "lastName","email","password","phone","token","role") VALUES ('${firstName}', '${lastName}', '${email}', '${hashedPassword}', '${phone}',null,'${role}')
         ON CONFLICT ON CONSTRAINT "Users_pkey" DO NOTHING RETURNING *`)
         const token=jwt.sign({userId:newUser[0][0].id},process.env.SECRET_KEY,{expiresIn:"1d"})
         await Users.update({token},{where:{id:newUser[0][0].id}})
         const data={newUser:newUser[0][0],token}
         response.success(res,200,"user registered successfully",data)     
    }
    catch(err){
    return response.error(res,400,err.errors[0].message)
    }
  
};

const login=async(req,res,next)=>{
      const {email,password} = req.body;
    const user=await Users.findOne({where:{email}})
    if(!user)
    {
      return response.error(res,400,"Email or Password does not match")
    }
    console.log(user)
   const decryptedPassword=await bcrypt.compare(password,user.dataValues.password)
   if(!decryptedPassword)
   {
    return response.error(res,400,"Email or Password does not match")
   }
   const token=jwt.sign({userId:user.dataValues.id},process.env.SECRET_KEY,{expiresIn:"1h"})
   
    await Users.update({token},{where:{id:user.dataValues.id}})
    response.success(res,200,"user successfully logged in") 

}

module.exports = {
  registration,
  login
};
