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

    render() {
        if (this.state.restaurant)
            return <div>
                <p>Name: {this.state.restaurant.name}</p>
                <p>Address: {this.state.restaurant.address}</p>
                <p>Rating: {this.state.restaurant.rating}</p>
                <p>Opening Time: {this.state.restaurant.openingTime}</p>
                <p>Closing Time: {this.state.restaurant.closingTime}</p>
                <p>Delivery Fee: {this.state.restaurant.deliveryFee}</p>
                <p>Minimum Spend: {this.state.restaurant.minimumSpend}</p>

                {this.state.restaurant.menuItems?.length &&
                    this.state.restaurant.menuItems.map(menuItem => <div key={menuItem.id}>
                        <p>Name: {menuItem.name}, description: {menuItem.description}, price: {menuItem.price}</p>
                    </div>
                    )
                }

                <button onClick={this.handleOrderCreate}>Create Order</button>
            </div>;
        else
            return <p>No restaurant found for this ID</p>;
    }
}

export default RestaurantDetails;