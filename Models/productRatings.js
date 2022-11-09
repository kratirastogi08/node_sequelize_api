
const {DataTypes}=require('sequelize')
module.exports = function (sequelize) {

    const ProductRating = sequelize.define('product_rating', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'userId',
        },

        productId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'productId',
        },
        rating:{
            type: DataTypes.INTEGER,
            allowNull: false,  
        }
        ,
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
    }, {
        timestamps: false,
       
            indexes: [
                {fields: ['userId', 'productId'],unique:true},
            ],
        
    });

    ProductRating.associate=(models)=>{
         ProductRating.belongsTo(models.users,{foreignKey:"userId"} )
         ProductRating.belongsTo(models.products,{foreignKey:"productId"} )
    }

    return ProductRating;
};