module.exports = (sequelize, Sequelize) => {
    const Order = sequelize.define("order", {
        orderTime: {
            type: Sequelize.DATE
        }
    });

    return Order;
};