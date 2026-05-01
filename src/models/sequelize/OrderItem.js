export default (sequelize, DataTypes) => {
    const OrderItem = sequelize.define("OrderItem", {
        orderId: { type: DataTypes.INTEGER, allowNull: false },
        sku: { type: DataTypes.STRING, allowNull: false },
        qty: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
        price: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
    });

    OrderItem.associate = (models) => {
        OrderItem.belongsTo(models.Order, { foreignKey: "orderId", as: "order" });
    };

    return OrderItem;
};