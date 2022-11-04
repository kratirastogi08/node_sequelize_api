const express=require('express');
const router=express.Router();
const orderController=require('../controller/orderController')
const {authentcation,authorizedRoles}=require('../middleware/authentication')

router.post("/placeOrder",authentcation,orderController.placeOrder)
router.put("/updateOrderStatus/:orderId",authentcation,authorizedRoles(['admin']),orderController.updateOrderStatus)
router.delete("/cancelOrder/:orderId",orderController.cancelOrder)

module.exports=router

