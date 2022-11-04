
const {DataTypes}=require('sequelize')
module.exports = function (sequelize) {

    const OrderItem = sequelize.define('order_items', {
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

        orderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'orderId',
        },

        productId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'productId',
        },

        price: {
            // type: DECIMAL(20, 2),
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        quantity: {
            type: DataTypes.INTEGER(10),
            allowNull: true,
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
    }, {
        timestamps: false,
        tableName: 'order_items',
    }, {
        indexes: [
            {fields: ['userId', 'orderId']},
        ],
    }, {});

    OrderItem.associate = function (models) {
        OrderItem.belongsTo(models.orders,{foreignKey: 'orderId',onDelete: 'cascade'});
        OrderItem.belongsTo(models.products,{foreignKey:'productId'});
    };
    return OrderItem;
};