module.exports = (sequelize, Sequelize) => {
    const Restaurant = sequelize.define("restaurant", {
        name: {
            type: Sequelize.STRING
        },
        address: {
            type: Sequelize.STRING
        },
        rating: {
            type: Sequelize.FLOAT
        },
        openingTime: {
            type: Sequelize.TIME
        },
        closingTime: {
            type: Sequelize.TIME
        },
        deliveryFee: {
            type: Sequelize.FLOAT
        },
        minimumSpend: {
            type: Sequelize.FLOAT
        },
        distance: {
            type: Sequelize.FLOAT
        }
    });

    return Restaurant;
};