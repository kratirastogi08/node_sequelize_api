const express=require('express')
const router=express.Router();
const userController=require('../controller/userController')
const notificationController=require('../controller/notificationController')
const {validate}= require('../middleware/validation')
const {signupSchema,signInSchema}=require('../helper/validationSchema')
const {authentcation}=require('../middleware/authentication');


/**
 * @swagger
 * definitions:
 *   User:
 *     properties:
 *       firstName:
 *         type: string
 *       lastName:
 *         type: string
 *       phone:
 *         type: string
 *       email:
 *         type: string
 *       password:
 *         type: string
 */

/**
 * @swagger
 * definitions:
 *   Login:
 *     properties:
 *       email:
 *         type: string
 *       password:
 *         type: string
 */

/**
 * @swagger
 * /user/signup:
 *   post:
 *     description: Creates a new user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: User object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/User'
 *     responses:
 *       200:
 *         description: Successfully created
 */

/**
 * @swagger
 * /user/login:
 *   post:
 *     description: login  user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: User object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Login'
 *     responses:
 *       200:
 *         description: Successfully logged in user
 */
router.post('/signup',validate(signupSchema),userController.registration)
router.post('/login',validate(signInSchema),userController.login)
router.post("/createAddress",authentcation,userController.updateAddress)
router.put("/updateAddress/:id",authentcation,userController.updateAddress)
router.post("/forgotPassword",userController.forgotPassword)
router.put("/reset/:token",userController.resetPassword)
router.post("/notification",notificationController.androidPushNotification)
module.exports=router;