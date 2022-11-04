const {DataTypes}=require('sequelize')

module.exports=async (sequelize)=>{
    const User=sequelize.define("User",{
      id:{
       type:DataTypes.INTEGER,
       autoIncrement: true,
       primaryKey: true
      },
       firstName:{
        type:DataTypes.STRING,
        allowNull:false,
       } ,
       lastName:{
        type:DataTypes.STRING,
        allowNull:false
       },
       email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
       },
       phone:{
        type:DataTypes.STRING,
        allowNull:false
       },
       password:{
        type:DataTypes.STRING,
        allowNull:false,
       },
       role:{
       type:DataTypes.STRING,
       defaultValue:"user"
       },
       token:DataTypes.STRING(255)
       ,
       createdAt:{
        type:DataTypes.DATE,
        defaultValue:Date.now()
       }
    },{
      updatedAt:false,

    })

    User.associate = function (models) {
      console.log(models)

      User.hasMany(models.orders,{foreignKey:"userId"});
      User.hasMany(models.address,{foreignKey:"userId"}); 
  };
  console.log("user",User)
    return User;
}