const { Sequelize, DataTypes } = require('sequelize');
const sequelize=new Sequelize({
   host:'localhost',
   port:5432,
   database:'demo',
   dialect:'postgresql',
   username:'postgres',
   password:'root',
   logging:false
})
const db={}
   
   db.connectToDatabase=()=>{
      sequelize.authenticate().then(()=>{
         console.log('database connection established')
        }).catch((err)=>{
           console.log("error",err)
        })
   }


db.Sequelize = Sequelize;
db.sequelize=sequelize;
db.sequelize.sync().then(()=>{
   console.log("table created successfully")
})

require('../Models/user')(sequelize)
require('../Models/product')(sequelize)
require('../Models/category')(sequelize)
require('../Models/address')(sequelize)
require('../Models/order')(sequelize)
require('../Models/orderItem')(sequelize)

db.users=sequelize.models.User
db.products=sequelize.models.Product
db.category=sequelize.models.Category
db.address=sequelize.models.Address
db.orders=sequelize.models.Order
db.orderItems = sequelize.models.order_items

db.category.hasMany(db.products,{foreignKey:'categoryId'});
db.products.belongsTo(db.category,{forignKey:'categoryId'});

db.users.associate(db);
db.address.associate(db);
db.orders.associate(db);
db.orderItems.associate(db)




module.exports = db;