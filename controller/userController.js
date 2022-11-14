const db = require("../db/db.config.js");
const bcrypt = require("bcrypt");
const Users = db.users;
const Address = db.address;
const response = require("../CommonResponse/response");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { Op } = require("sequelize");

const registration = async (req, res, next) => {
  try {
    const { firstName, lastName, password, email, phone, role } = req.body;

    //const hashedPassword=await bcrypt.hash(password,10)
    // const newUser= await db.sequelize.query(`INSERT INTO "Users" ("firstName", "lastName","email","password","phone","token","role") VALUES ('${firstName}', '${lastName}', '${email}', '${hashedPassword}', '${phone}',null,'${userRole}')
    //  ON CONFLICT ON CONSTRAINT "Users_pkey" DO NOTHING RETURNING *`)

    const user = await Users.findAll({
      where: {
        [Op.or]: [{ email }, { phone }],
      },
    });
    if (user.length > 0) {
      return response.error(res, 400, "Entity already exists");
    }
    const newUser = await Users.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      role,
    });
    const token = Users.generateJWT();
    await Users.update({ token }, { where: { id: newUser.id } });
    const data = { newUser, token };
    response.success(res, 200, "user registered successfully", data);
  } catch (err) {
    console.log(err);
    //response.error(res,400,err.errors[0].message)
    return response.error(res, 400, "User Registration Failed");
  }
};

const login = async (req, res, next) => {
  try{
    const { email, password } = req.body;
    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return response.error(res, 400, "User does not exist");
    }
    const decryptedPassword = user.isValidPassword(password);
  
    if (!decryptedPassword) {
      return response.error(res, 400, "Email or Password does not match");
    }
    const token = Users.generateJWT();
  
    await Users.update({ token }, { where: { id: user.dataValues.id } });
    response.success(res, 200, "user successfully logged in",data={token});
  }
  catch(err)
  {
      next(err) 
  }
  
};

const updateAddress = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;
    if (id === undefined) {
      const newAddress = await Address.create({
        ...req.body,
        userId,
      });
      return response.success(res, 200, "Address created successfully");
    }

    const addrs = await Address.findAll({ where: { id, userId } });
    if (!addrs) {
      response.error(res, 400, "No such entity found");
    }
    await Address.update({ ...req.body }, { where: { id } });
    response.success(res, 200, "Address updated successfully");
  } catch (err) {
    console.log(err);
    next(err)
  }
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  const currentUser = await Users.findOne({ email });
  if (!currentUser) {
    response.error(res, 400, "User not found");
  }
  currentUser.generatePasswordReset();
  currentUser.save().then((user) => {
    let link =
      "http://" +
      req.headers.host +
      "/api/v1/user/reset/" +
      user.resetPasswordToken;
    const mailOptions = {
      to: user.email,
      from: "kratirastogi99196@gmail.com",
      subject: "Password change request",
      text: `Hi ${user.firstName} \n Please click on the following link ${link} to reset your password. \n\n 
    If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };
    console.log(link);
    var transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "krastogi227@gmail.com",
        pass: "zyqrcxtvzsswppif",
      },
    });
    transport.sendMail(mailOptions, (err, result) => {
      if (err) {
        console.log("Error sending email " + err);
      } else {
        console.log("Sent email successfully");
        response.success(res,200,"Email sent successfully",link);
      }
    });
  });
};

const resetPassword = async (req, res, next) => {
  try {
    const user = await Users.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return response.error(res, 400, "Reset Password link expired");
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    return response.success(res, 200, "Password reset successfully");
  } catch (err) {
    console.log("err", err);
    response.error(res, 400, "Reset Password failed");
  }
};

module.exports = {
  registration,
  login,
  updateAddress,
  forgotPassword,
  resetPassword,
};
