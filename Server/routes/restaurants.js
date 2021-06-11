const express = require('express');
const router = express.Router();
const db = require('../models');
const Restaurant = db.restaurants;
const Order = db.orders;

// Get all restaurants
router.get('/', async (_, res) => {
    try {
        const allRestaurants = await Restaurant.findAll();
        res.send(allRestaurants);
    } catch (error) {
        res.status(500).send(error.message || 'Unable to fetch all restaurants');  
    }
});

// Get single restaurant, with menu items
router.get('/:id', async (req, res) => {
    const restaurantId = req.params.id;

    try {
        const restaurant = await Restaurant.findByPk(restaurantId, {
            include: [{
                association: Restaurant.MenuItems,
                as: 'menuItems'
            }]
        });

        console.log(restaurant);

        if (restaurant)
            res.send(restaurant);
        else
            res.status(400).send(`Unable to find restaurant with id ${restaurantId}`);
    } catch (error) {
        res.status(500).send(error.message || `Unable to find restaurant with id ${restaurantId}`); 
    }
});

// Create a new restaurant
router.post('/', async (req, res) => {
    const restaurant = req.body;

    if (restaurant && restaurant.name && restaurant.address) {
        try {
            const data = await Restaurant.create(restaurant, {
                include: [{
                    association: Restaurant.MenuItems,
                    as: 'menuItems'
                }]
            });
            res.send(data);
        } catch (error) {
            res.status(500).send(error.message || 'Unable to create restaurant');
        }
    } else {
        res.status(400).send("Restaurant must have a name and an address");
    }
});

// Create a new order for restaurant with id :id
router.post('/:id/orders', async (req, res) => {
    const order = req.body;
    const restaurantId = req.params.id;

    if (order && order.orderTime && restaurantId) {
        try {
            order.restaurantId = restaurantId;
            const data = await Order.create(order);
            res.send(data);
        }
        catch (error) {
            res.status(500).send(error.message || `Unable to create order for restaurant with id ${restaurantId}`);
        }
    } else {
        res.status(400).send("Order must have an order time and a restaurant id");
    }
});

module.exports = router;