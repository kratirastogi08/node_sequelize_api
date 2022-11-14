const db = require("../db/db.config.js");
const Orders = db.orders;
const OrderItems = db.orderItems;
const Products = db.products;
const Address=db.address;
var randomstring = require("randomstring");

const response = require("../CommonResponse/response");

const placeOrder = async (req, res, next) => {
  const t = await db.sequelize.transaction();
  try {
    const { userId } = req.user;
    console.log("userId",userId)
    const address= await Address.findOne({where:{userId}})    
    console.log(address) 
    const { orderItems, ...rest } = req.body;
    const trackingNumber = randomstring.generate();
    let totalPrice = 0;
    orderItems.forEach((i) => {
      totalPrice = totalPrice + i.price;
    });
    const order = await Orders.create(
      { ...rest, userId, trackingNumber, totalPrice,addressId:address.id, orderItems },
      { transaction: t }
    );
    for (let item of orderItems) {
      await OrderItems.create(
        { ...item, userId: 1, orderId: order.dataValues.id },
        { transaction: t }
      );
      const pod = await Products.findOne({ id: item.productId });
      if (pod.dataValues.quantity < item.quantity) {
        return response.error(res, 400, "Not enough items available");
      }
      await Products.increment(
        { quantity: -item.quantity },
        { where: { id: item.productId } },
        { transaction: t }
      );
    }
    await t.commit();
    response.success(res, 200, "order placed successfully");
  } catch (err) {
    console.log(err);
    await t.rollback();
    next(err)
  }
};

const updateOrderStatus = async (req, res, next) => {
  const { orderStatus } = req.body;
  const { orderId } = req.params;
  const order = await Orders.findOne({ where: { id: orderId } });
  if (!order) {
    return response.error(res, 400, "No such order exists");
  }
  if (order?.dataValues.orderStatus === "Delivered") {
    return response.error(res, 400, "Order already delivered");
  }
  await Orders.update({ orderStatus }, { where: { id: orderId } });
  response.success(res, 200, "Order updated successfully");
};
const cancelOrder = async (req, res, next) => {
  const { orderId } = req.params;
  const order = await Orders.findOne({ where: { id: orderId } });
  if (!order) {
    return response.error(res, 400, "No such order exists");
  }
  if (
    order.dataValues.orderStatus === "Delivered" ||
    order.dataValues.orderStatus === "Shipped"
  ) {
    return response.error(
      res,
      400,
      "Since the order is already shipped or delivered and hence order cannot be cancelled"
    );
  }
  await Orders.destroy({ where: { id: orderId } });
  response.success(res, 200, "Order cancelled");
};

const getOrderById=async(req,res,next)=>{
  try{
    const order= await Orders.findOne({where: { id: req.params.orderId}})
    if(!order)
    {
     return response.error(res,400,"No such order found")
    }
    return response.success(res,200,"Order Details",order)
  }
  catch(err)
  {   
    next(err)
  }
 
}
const getAllOrders=async(req,res,next)=>{
   const orders= await Orders.findAll({});
   response.success(res,400,"orders",orders)
}
module.exports = {
  placeOrder,
  updateOrderStatus,
  cancelOrder,
  getOrderById,
  getAllOrders
};
