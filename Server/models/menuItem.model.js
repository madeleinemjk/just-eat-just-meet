module.exports = (sequelize, Sequelize) => {
    const MenuItem = sequelize.define("menuitem", {
        name: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        },
        price: {
            type: Sequelize.FLOAT
        }
    });

    return MenuItem;
};