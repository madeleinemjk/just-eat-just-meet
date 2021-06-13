import React, { Component } from "react";
import "./Order.scss";
import axios from "axios";
import { Link } from 'react-router-dom';
const API_URL = process.env.REACT_APP_BACKEND_URL;

class Order extends Component {
    constructor(props) {
        super(props);

        this.state = {
            order: null,
            name: null,
            quantity: null,
            total: null
        };
    }

    componentDidMount() {
        this.fetchData();
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

    handleQuantityChange = (event) => {
        event.preventDefault();
        this.setState({quantity: event.target.value});
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

        axios.post(`${API_URL}/orders/${this.state.order.id}/orderItem`, {
            quantity: this.state.quantity,
            customerName: this.state.name,
            menuItemId: menuItem.id
        }).then(res => {
            console.log(res);
            this.fetchData();
        }).catch(console.error);
    };

    deleteOrderItem = (event, orderItem) => {
        event.preventDefault();

        axios.delete(`${API_URL}/orders/${this.state.order.id}/orderItem/${orderItem.id}`)
            .then(res => {
                console.log(res);
                this.fetchData();
            }).catch(console.error);
    };

    formatNumber = (number) => {
        const float = parseFloat(number);
        return float.toFixed(2);
    };

    render() {
        if (!this.state.order)
            return <p>Order</p>;
        else
            return <div>
                <div className="order-id">
                    <p>Order ID: {this.state.order.id}</p>
                </div>
                <div className="order-summary">
                    <div className="restaurant">
                        <div class="left">
                            <p>Name: {this.state.order.restaurant.name}</p>
                            <p>Address: {this.state.order.restaurant.address}</p>
                            <p>Rating: {this.formatNumber(this.state.order.restaurant.rating)}</p>
                        </div>
                        <div class="right">
                            <p>Times: {this.state.order.restaurant.openingTime} - {this.state.order.restaurant.closingTime}</p>
                            <p>Delivery Fee: £{this.formatNumber(this.state.order.restaurant.deliveryFee)}</p>
                            <p>Minimum Spend: £{this.formatNumber(this.state.order.restaurant.minimumSpend)}</p>
                        </div>
                    </div>

                    <input type="text" placeholder="Enter name" onChange={this.handleNameChange}></input>

                    <div className="menu">
                        <h2>Menu Items</h2>
                        {this.state.order.restaurant.menuItems.map(menuItem => {
                            return <div key={menuItem.id} className="menu-item">
                                <div class="left">
                                    <h3>{menuItem.name}</h3>
                                    <p>£{this.formatNumber(menuItem.price)}</p>
                                </div>
                                <div class="right">
                                    <input type="number" placeholder="Quantity" onChange={this.handleQuantityChange} />
                                    <button onClick={(event) => this.addOrderItem(event, menuItem)}>Add</button>
                                </div>
                            </div>
                        })}
                    </div>

                    <div className="order">
                        <h2>Order Items</h2>
                        {this.state.order.orderItems.map(orderItem => {
                            return <div className="order-item" key={orderItem.id}>
                                <div class="left">
                                    <div>Name: {orderItem.customerName}</div>
                                    <div>Menu Item: {orderItem.menuItem.name}</div>
                                </div>
                                <div class="right">
                                    <div>Quantity: {orderItem.quantity}</div>
                                    <div><button onClick={(event) => this.deleteOrderItem(event, orderItem)}>Delete</button></div>
                                </div>
                            </div>
                        })}
                    </div>

                    <div className="totals">
                        <p><strong>Total: </strong>£{this.formatNumber(this.state.total) || "N/A"} (Minimum: £{this.formatNumber(this.state.order.restaurant.minimumSpend)})</p>
                        {(this.state.total > this.state.order.restaurant.minimumSpend) ? <Link to={`/orders/${this.state.order.id}/submit`} className="item"><button>Submit</button></Link> : 'You have not met the minimum spend'}
                    </div>
                </div>
            </div>;
    }
}

export default Order;