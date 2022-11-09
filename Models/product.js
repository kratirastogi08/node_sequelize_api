const { DataTypes } = require("sequelize");

module.exports = async (sequelize) => {
  const Product = sequelize.define(
    "Product",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      images: {
        type: DataTypes.TEXT,
        get: function () {
          return JSON.parse(this.getDataValue("images"));
        },
        set: function (val) {
          return this.setDataValue("images", JSON.stringify(val));
        },
      },
      categoryId:{
      type:DataTypes.INTEGER,
      allowNull:false
      },
      price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: Date.now(),
      },
    },
    {
      updatedAt: false,
    }
  );
  Product.associate=(models)=>{
    Product.hasMany(models.productRatings,{foreignKey:"productId"})
  }
  return Product;
};
