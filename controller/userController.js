const db = require("../db/db.config.js");
const bcrypt=require('bcrypt');
const Users = db.users;
const Address=db.address;
const response=require('../CommonResponse/response')
const jwt=require('jsonwebtoken');

const registration = async (req,res,next) => {
    try{
        const { firstName, lastName, password, email, phone,role } = req.body;
        const userRole=role||"user"
        const hashedPassword=await bcrypt.hash(password,10)
        const newUser= await db.sequelize.query(`INSERT INTO "Users" ("firstName", "lastName","email","password","phone","token","role") VALUES ('${firstName}', '${lastName}', '${email}', '${hashedPassword}', '${phone}',null,'${userRole}')
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

const updateAddress=async(req,res,next)=>{
  try{
    const {userId}=req.user;
    const {id}=req.params
     if(id===undefined)
     {
     const newAddress= await Address.create({
        ...req.body,
        userId
      })
      return response.success(res,200,"Address created successfully")
     }

       const addrs= await Address.findAll({where:{id,userId}})
       if(!addrs)
       {
        response.error(res,400,"No such entity found");
       }
       await Address.update({...req.body},{where:{id}})
       response.success(res,200,"Address updated successfully")       
  }
  catch(err){
    console.log(err)
       response.error(res, 400,err.name)
  }
}

module.exports = {
  registration,
  login,
  updateAddress
};
