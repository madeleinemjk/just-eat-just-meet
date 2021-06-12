import React, { Component } from "react";
import "./Restaurants.scss";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = process.env.REACT_APP_BACKEND_URL;

class Restaurants extends Component {
    constructor(props) {
        super(props);

        this.state = {
            restaurants: []
        };
    }

    componentDidMount() {
        axios.get(`${API_URL}/restaurants`)
            .then(res => {
                const restaurants = res?.data;

                if (restaurants?.length) {
                    this.setState({
                        restaurants: restaurants
                    });
                } else {
                    console.error('No restaurants were returned from the API');
                }
            })
            .catch(console.error);
    }

    formatNumber = (input) => {
        const number = parseFloat(input);
        return number.toFixed(2);
    };

    render() {
        return <div className="restaurant-list">
            <h2>Restaurants</h2>
            {this.state.restaurants.map(restaurant => 
                <Link to={`/restaurants/${restaurant.id}`} className="item" key={restaurant.id}>
                    <div className="left">
                        <h3>{restaurant.name}</h3>
                        <p>{restaurant.address}</p>
                        <p>{this.formatNumber(restaurant.rating)}/5</p>
                    </div>
                    <div className="right">
                        <p>Hours: {restaurant.openingTime} - {restaurant.closingTime}</p>
                        <p>Delivery Fee: £{this.formatNumber(restaurant.deliveryFee)}</p>
                        <p>Minimum Spend: £{this.formatNumber(restaurant.minimumSpend)}</p>
                    </div>
                </Link>
            )}
        </div>;
    }
}

export default Restaurants;