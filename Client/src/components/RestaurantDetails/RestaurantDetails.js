import React, { Component } from "react";
import "./RestaurantDetails.scss";
import axios from "axios";
const API_URL = process.env.REACT_APP_BACKEND_URL;

class RestaurantDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            restaurant: null
        };
    }

    componentDidMount() {
        const restaurantId = this.props?.match?.params?.id;

        axios.get(`${API_URL}/restaurants/${restaurantId}`)
            .then(res => {
                const restaurant = res.data;
                this.setState({
                    restaurant: restaurant
                });
            }).catch(error => {
                console.error(error);
            });
    }

    handleOrderCreate = (event) => {
        event.preventDefault();
        console.log(`Creating order for restaurant id ${this.state.restaurant.id}`);

        const restaurantId = this.state.restaurant.id;

        axios.post(`${API_URL}/restaurants/${restaurantId}/orders`, {
            orderTime: new Date()
        }).then(res => {
            const createdOrder = res.data;
            this.props.history.push(`/orders/${createdOrder.id}`);
        }).catch(console.error);
    }

    formatNumber = (number) => {
        const float = parseFloat(number);
        return float.toFixed(2);
    };

    formatDistance = (input) => {
        const number = parseFloat(input);
        return number.toFixed(1);
    };

    render() {
        if (this.state.restaurant)
            return <div className="restaurant-details">
                <div className="summary">
                    <div className="left">
                        <h3>{this.state.restaurant.name}</h3>
                        <p>Address: {this.state.restaurant.address}</p>
                        <p>Rating: {this.state.restaurant.rating}</p>
                        <p>Distance: {this.formatDistance(this.state.restaurant.distance)} miles</p>
                    </div>
                    <div className="right">
                        <p>Hours: {this.state.restaurant.openingTime} - {this.state.restaurant.closingTime}</p>
                        <p>Delivery Fee: £{this.formatNumber(this.state.restaurant.deliveryFee)}</p>
                        <p>Minimum Spend: £{this.formatNumber(this.state.restaurant.minimumSpend)}</p>
                    </div>
                </div>
                
                <div className="menu-items">
                    {this.state.restaurant.menuItems?.length &&
                        this.state.restaurant.menuItems.map(menuItem => <div key={menuItem.id} className="menu-item">
                            <div class="left">
                                <h3>{menuItem.name}</h3>
                                <p>{menuItem.description}</p>
                            </div>
                            <div class="right">
                                £{this.formatNumber(menuItem.price)}
                            </div>
                        </div>
                        )
                    }
                </div>

                <div className="actions">
                    <button onClick={this.handleOrderCreate}>Create Order</button>
                </div>
            </div>;
        else
            return <p>No restaurant found for this ID</p>;
    }
}

export default RestaurantDetails;