const express=require('express');
const router=express.Router();
const orderController=require('../controller/orderController')
const {authentcation,authorizedRoles}=require('../middleware/authentication')
const paymentController=require('../controller/paymentController')

router.post("/placeOrder",authentcation,orderController.placeOrder)
router.put("/updateOrderStatus/:orderId",authentcation,authorizedRoles(['admin']),orderController.updateOrderStatus)
router.delete("/cancelOrder/:orderId",orderController.cancelOrder)
router.post("/payment",authentcation,paymentController.stripePayment)
router.post("/payment/subscription",authentcation,paymentController.stripeSubscription)
router.get("/getOrder/:orderId",orderController.getOrderById)
router.post("/pay",paymentController.pay)
router.post("/subs",paymentController.subs)
router.get("/allOrders",orderController.getAllOrders)

module.exports=router

