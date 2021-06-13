import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { Component } from "react";
import "./Order.scss";
import axios from "axios";
import { Link } from 'react-router-dom';
import socketIOClient from "socket.io-client";

const API_URL = process.env.REACT_APP_BACKEND_URL;
class Order extends Component {
    constructor(props) {
        super(props);

        this.state = {
            order: null,
            name: null,
            quantity: {},
            total: null,
            socket: null
        };
    }

    componentDidMount() {
        this.fetchData();
        const socket = socketIOClient(API_URL);
        socket.on("Update", (update) => {
            if (parseInt(update.orderId) === parseInt(this.state.order.id)) {
                toast.success('Your order has been updated', {
                    toastId: 'new-items'
                });
                this.fetchData();
            }
        });
        this.setState({
            socket: socket
        });
    }

    componentWillUnmount() {
        this.socket && this.socket.disconnect();
    }

    fetchData() {
        const orderId = this.props?.match?.params?.id;

        axios.get(`${API_URL}/orders/${orderId}`)
            .then(res => {
                const order = res.data;
                this.setState({
                    order: order
                });

                this.updateTotal();
            }).catch(console.error);
    }

    handleNameChange = (event) => {
        event.preventDefault();
        this.setState({name: event.target.value});
    }

    handleQuantityChange = (event, menuItem) => {
        event.preventDefault();
        const menuItems = this.state.order.restaurant.menuItems;
        const updatedMenuItem = menuItems.find(x => x.id === menuItem.id);
        updatedMenuItem.quantity = event.target.value;
        this.setState({order: this.state.order});
    };

    handleQuantityChangeForOrderItem = (event, orderItem) => {
        event.preventDefault();
        const orderItems = this.state.order.orderItems;
        const updatedOrderItem = orderItems.find(x => x.id === orderItem.id);
        updatedOrderItem.quantity = event.target.value;
        this.setState({
            order: this.state.order
        });
    };

    updateTotal = () => {
        const orderItems = this.state.order.orderItems;
        const total = orderItems.map(item => item.quantity * item.menuItem.price)
            .reduce((total, num) => {
                return total += num;
            }, 0);

        this.setState({
            total: total
        });
    };

    addOrderItem = (event, menuItem) => {
        event.preventDefault();

        if (!this.state.name || this.state.name.length === 0 || !menuItem.quantity || menuItem.quantity <= 0) {
            toast.error('You must provide a name and a valid quantity');
            return;
        }

        axios.post(`${API_URL}/orders/${this.state.order.id}/orderItem`, {
            quantity: menuItem.quantity,
            customerName: this.state.name,
            menuItemId: menuItem.id
        }).then(res => {
            // No need to re-fetch here, sockets will handle it
        }).catch(console.error);
    };

    deleteOrderItem = (event, orderItem) => {
        event.preventDefault();

        axios.delete(`${API_URL}/orders/${this.state.order.id}/orderItem/${orderItem.id}`)
            .then(_ => {
                console.log('Deleted order item, waiting for socket message');
            }).catch(console.error);
    };

    updateOrderItem = (event, orderItem) => {
        event.preventDefault();
        
        axios.put(`${API_URL}/orders/${this.state.order.id}/orderItem/${orderItem.id}`, {quantity: orderItem.quantity})
            .then(_ => {
                console.log('Deleted order item, waiting for socket message');
            }).catch(console.error);
    };

    formatNumber = (number, places = 2) => {
        const float = parseFloat(number);
        return float.toFixed(places);
    };

    groupOrderItemsByCustomerName = () => {
        const grouped = {};
        const allOrderItems = this.state.order.orderItems;
        allOrderItems.forEach(orderItem => {
            if (!grouped[orderItem.customerName]) grouped[orderItem.customerName] = {items: [], total: 0};
            grouped[orderItem.customerName].items.push(orderItem);
            grouped[orderItem.customerName].total += orderItem.quantity * orderItem.menuItem.price;
        });

        return Object.keys(grouped).map(name => ({name: name, items: grouped[name].items, total: grouped[name].total}));
    };

    shareLink = (event) => {
        event.preventDefault();
        const currentUrl = window.location.href;
        navigator.clipboard.writeText(currentUrl);
        toast.success('Copied link to clipboard!');
    };

    render() {
        if (!this.state.order)
            return <p>Order</p>;
        else
            return <div>
                <div className="order-summary">
                    <div className="top-box">
                        <div className="left">
                            <h2>Order from {this.state.order.restaurant.name}</h2>
                            <p>Nice to JustMeet you! First off, let's get acquainted</p>
                            <input type="text" placeholder="Enter name" onChange={this.handleNameChange}></input>
                        </div>
                        <div className="right">
                            <button onClick={this.shareLink}><span className="fa fa-share"></span> Share link with friends!</button>
                        </div>
                    </div>

                    <div className="restaurant">
                        <div className="inner">
                            <div className="left">
                                <p>Order ID: {this.state.order.id}</p>
                                <p>Address: {this.state.order.restaurant.address}</p>
                                <p>Rating: {this.formatNumber(this.state.order.restaurant.rating, 1)}</p>
                            </div>
                            <div className="right">
                                <p>Times: {this.state.order.restaurant.openingTime} - {this.state.order.restaurant.closingTime}</p>
                                <p>Delivery Fee: £{this.formatNumber(this.state.order.restaurant.deliveryFee)}</p>
                                <p>Minimum Spend: £{this.formatNumber(this.state.order.restaurant.minimumSpend)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="menu">
                        <h2>Menu Items</h2>
                        {this.state.order.restaurant.menuItems.map(menuItem => {
                            return <div key={menuItem.id} className="menu-item">
                                <div className="left">
                                    <h3>{menuItem.name}</h3>
                                    <p>£{this.formatNumber(menuItem.price)}</p>
                                </div>
                                <div className="right">
                                    <input type="number" min="1" placeholder="Quantity" onChange={(event) => this.handleQuantityChange(event, menuItem)} />
                                    <button onClick={(event) => this.addOrderItem(event, menuItem)}>Add</button>
                                </div>
                            </div>
                        })}
                    </div>

                    <div className="order">
                        <h2>Order Items</h2>
                        {this.groupOrderItemsByCustomerName().map(group => {
                            return <div className="customer" key={group.name}>
                                <div className="customer-top">
                                    <h3>{group.name}</h3>
                                    <span>Total: £{this.formatNumber(group.total)}</span>
                                </div>
                                {group.items.map(orderItem => {
                                    return <div className="order-item" key={orderItem.id}>
                                        <div className="left">
                                            <h3>{orderItem.menuItem.name}</h3>
                                            <p>Quantity: <input type="number" min="1" value={orderItem.quantity} placeholder="Quantity" onChange={(event) => this.handleQuantityChangeForOrderItem(event, orderItem)} /></p>
                                            <p>Price: £{this.formatNumber(orderItem.quantity * orderItem.menuItem.price)}</p>
                                        </div>
                                        <div className="right">
                                            <button onClick={(event) => this.updateOrderItem(event, orderItem)}><span className="fa fa-save"></span> Update</button>
                                            <button onClick={(event) => this.deleteOrderItem(event, orderItem)}><span className="fa fa-trash"></span> Delete</button>
                                        </div>
                                    </div>
                                })}
                            </div>;
                        })}
                    </div>

                    <div className="totals">
                        <p><strong>Total: </strong>£{this.formatNumber(this.state.total) || "N/A"} (Minimum: £{this.formatNumber(this.state.order.restaurant.minimumSpend)})</p>
                        {(this.state.total >= this.state.order.restaurant.minimumSpend) ? <Link to={`/orders/${this.state.order.id}/submit`} className="item"><button>Submit</button></Link> : 'You have not met the minimum spend'}
                    </div>
                </div>
            </div>;
    }
}

export default Order;