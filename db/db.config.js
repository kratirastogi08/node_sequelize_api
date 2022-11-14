const { Sequelize, DataTypes } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();
const sequelize = new Sequelize({
  host: process.env.HOST,
  port: process.env.PORT,
  database: process.env.DATABASE,
  dialect: "postgresql",
  username: process.env.DB_USERNAME,
  password: process.env.PASSWORD,
  logging: false,
});

const db = {};

db.connectToDatabase = () => {
  sequelize
    .authenticate()
    .then(() => {
      console.log("database connection established");
    })
    .catch((err) => {
      //console.log("error",err)
    });
};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.sequelize.sync().then(() => {
  console.log("table created successfully");
});

require("../Models/user")(sequelize);
require("../Models/product")(sequelize);
require("../Models/category")(sequelize);
require("../Models/address")(sequelize);
require("../Models/order")(sequelize);
require("../Models/orderItem")(sequelize);
require("../Models/productRatings")(sequelize);

db.users = sequelize.models.User;
db.products = sequelize.models.Product;
db.category = sequelize.models.Category;
db.address = sequelize.models.Address;
db.orders = sequelize.models.Order;
db.orderItems = sequelize.models.order_items;
db.productRatings = sequelize.models.product_rating;

db.category.hasMany(db.products, { foreignKey: "categoryId" });
db.products.belongsTo(db.category, { forignKey: "categoryId" });

db.users.associate(db);
db.address.associate(db);
db.orders.associate(db);
db.orderItems.associate(db);
db.productRatings.associate(db);

module.exports = db;
