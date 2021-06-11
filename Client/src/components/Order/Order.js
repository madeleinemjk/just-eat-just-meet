import React, { Component } from "react";
import "./Order.scss";
import axios from "axios";
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

    render() {
        if (!this.state.order)
            return <p>Order</p>;
        else
            return <div>
                <div>
                    <p>Order ID: {this.state.order.id}</p>
                </div>
                <div>
                    <p>Restaurant Name: {this.state.order.restaurant.name}</p>
                    <p>Restaurant Address: {this.state.order.restaurant.address}</p>
                    <p>Restaurant Rating: {this.state.order.restaurant.rating}</p>
                    <p>Restaurant Opening Time: {this.state.order.restaurant.openingTime}</p>
                    <p>Restaurant Closing Time: {this.state.order.restaurant.closingTime}</p>
                    <p>Restaurant Delivery Fee: {this.state.order.restaurant.deliveryFee}</p>
                    <p>Restaurant Minimum Spend: {this.state.order.restaurant.minimumSpend}</p>

                    <div>
                        <input type="text" onChange={this.handleNameChange}></input>
                        <p><strong>Menu Items</strong></p>
                        {this.state.order.restaurant.menuItems.map(menuItem => {
                            return <div key={menuItem.id} className="menu-item">
                                <div>{menuItem.name}</div>
                                <div>{menuItem.price}</div>
                                <div><input type="number" onChange={this.handleQuantityChange}></input></div>
                                <div><button onClick={(event) => this.addOrderItem(event, menuItem)}>Add</button></div>
                            </div>
                        })}
                    </div>

                    <div>
                        <p><strong>Order Items</strong></p>
                        {this.state.order.orderItems.map(orderItem => {
                            return <div className="order-item" key={orderItem.id}>
                                <div>Name: {orderItem.customerName}</div>
                                <div>Quantity: {orderItem.quantity}</div>
                                <div>Menu Item: {orderItem.menuItem.name}</div>
                                <div>Actions: <button onClick={(event) => this.deleteOrderItem(event, orderItem)}>Delete</button></div>
                            </div>
                        })}
                    </div>

                    <div>
                        <p><strong>Total: </strong>{this.state.total || "N/A"} (Minimum: {this.state.order.restaurant.minimumSpend})</p>
                        { (this.state.total > this.state.order.restaurant.minimumSpend) ? <button>Submit</button> : 'You have not met the minimum spend' }
                    </div>
                </div>
            </div>;
    }
}

export default Order;