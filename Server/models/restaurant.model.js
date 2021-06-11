module.exports = (sequelize, Sequelize) => {
    const Restaurant = sequelize.define("restaurant", {
        name: {
            type: Sequelize.STRING
        },
        address: {
            type: Sequelize.STRING
        }
    });

    return Restaurant;
};