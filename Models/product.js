const {DataTypes}=require('sequelize')

module.exports=async (sequelize)=>{
    const Product=sequelize.define("Product",{
       title:{
        type:DataTypes.STRING,
        allowNull:false,
       } ,
       description:{
        type:DataTypes.STRING,
        allowNull:false
       },
       quantity:{
        type:DataTypes.INTEGER,
        allowNull:false,
        defaultValue:0
       },
       price:{
        type:DataTypes.DOUBLE,
        allowNull:false,
        defaultValue:0
       },
       createdAt:{
        type:DataTypes.DATE,
        defaultValue:Date.now()
       }
    },{
      updatedAt:false,

    })
    return Product;
}