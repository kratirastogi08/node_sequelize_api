const {DataTypes}=require('sequelize')

module.exports=async (sequelize)=>{
    const Order=sequelize.define("Order",{
      id:{
       type:DataTypes.INTEGER,
       autoIncrement: true,
       primaryKey: true
      },
     trackingNumber: {
        type: DataTypes.STRING,
        unique: true,
        field: 'tracking_number'
    },
    addressId: {
        type: DataTypes.INTEGER,
        allowNull:false,
        field: 'addressId',
        references: {
            model: 'addresses',
            key: 'id'
        }
    },
    userId:{
        type: DataTypes.INTEGER,
        allowNull:false,
        field: 'userId',
    },
    orderStatus: {
        type: DataTypes.STRING,
        field: 'order_status',
        defaultValue:"Progress",
        values: ["Progress", "Shipped", "Delivered"]
    },
    totalPrice:{
        type:DataTypes.INTEGER,
        defaultValue:0
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(),
        field: 'created_at'
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(),
        field: 'updated_at'
    },

    },{
      updatedAt:false,

    })
    Order.associate = (models) => {
        Order.hasMany(models.orderItems,{foreignKey:'orderId'});
        Order.belongsTo(models.users, {foreignKey: 'userId'});
        Order.belongsTo(models.address, {foreignKey: 'addressId'});
    };
    return Order;
}