module.exports = (sequelize, Sequelize) => {
    const OrderItem = sequelize.define("orderItem", {
        quantity: {
            type: Sequelize.INTEGER
        },
        customerName: {
            type: Sequelize.STRING
        }
    });

    return OrderItem;
};