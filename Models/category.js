const {DataTypes}=require('sequelize')

module.exports=async (sequelize)=>{
    const Category=sequelize.define("Category",{
       type:{
        type:DataTypes.STRING,
        allowNull:false,
       } ,
        createdAt:{
        type:DataTypes.DATE,
        defaultValue:Date.now()
       }
    },{
      updatedAt:false,
    })
    return Category;
}