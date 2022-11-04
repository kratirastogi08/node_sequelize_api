const {DataTypes}=require('sequelize')

module.exports = function (sequelize) {
    const Address = sequelize.define(
        'Address', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            city: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },

            address: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },

            country: {
                type: DataTypes.STRING(200),
                allowNull: false,
            },

            zipCode: {
                type: DataTypes.STRING(6),
                allowNull: false,
                field: 'zip_code',
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
            tableName: 'addresses'
        }
    );

    Address.associate = function (models) {
        Address.belongsTo(models.users, {onDelete: 'cascade', foreignKey: 'userId'});
    };
    return Address;
};