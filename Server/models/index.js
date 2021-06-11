const dbConfig = require('../config/db.config');

// Initialise sequelize context
const Sequelize = require('sequelize');
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
  
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Add models
db.restaurants = require('./restaurant.model')(sequelize, Sequelize);
db.menuItems = require('./menuItem.model')(sequelize, Sequelize);
db.orders = require('./order.model')(sequelize, Sequelize);
db.orderItems = require('./orderItem.model')(sequelize, Sequelize);

// Add relationships
db.restaurants.MenuItems = db.restaurants.hasMany(db.menuItems, { as: 'menuItems' });
db.orders.OrderItems = db.orders.hasMany(db.orderItems, { as: 'orderItems' });
db.restaurants.Orders = db.restaurants.hasMany(db.orders, { as: 'orders' });
db.orders.Restaurant = db.orders.belongsTo(db.restaurants, { as: 'restaurant' });
db.orderItems.MenuItem = db.orderItems.belongsTo(db.menuItems, { as: 'menuItem' });

module.exports = db;