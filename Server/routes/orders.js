const express = require('express');
const router = express.Router();
const db = require('../models');
const Order = db.orders;
const OrderItem = db.orderItems;

// Get order with id, including order items
router.get('/:id', async (req, res) => {
    const orderId = req.params.id;

    try {
        const order = await Order.findByPk(orderId, {
            include: [{
                association: Order.OrderItems,
                as: 'orderItems',
                include: [
                    {
                        association: OrderItem.MenuItem,
                        as: 'menuItem'
                    }
                ]
            }, {
                association: Order.Restaurant,
                as: 'restaurant'
            }]
        });

        if (order) {
            res.send(order);
        } else {
            res.status(400).send(`Unable to find order with id ${orderId}`);
        }
    } catch(error) {
        res.status(500).send(error.message || `Unable to get order with id ${orderId}`);
    }
});

// Create order item for order with id 
router.post('/:id/orderItem', async (req, res) => {
    const orderItem = req.body;
    const orderId = req.params.id;

    if (orderItem && orderItem.quantity && orderItem.customerName && orderItem.menuItemId) {
        try {
            orderItem.orderId = orderId;
            const data = await OrderItem.create(orderItem);
            res.send(data);
        } catch (error) {
            res.status(500).send(`Unable to create order item for order id ${orderId}`);
        }
    } else {
        res.status(400).send(`Unable to add order item for order ${orderId}. Order item must have quantity, customername, and a menuitemid`);
    }
});

module.exports = router;