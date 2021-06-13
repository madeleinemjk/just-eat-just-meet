import React, { Component } from "react";
import "./Restaurants.scss";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = process.env.REACT_APP_BACKEND_URL;

class Restaurants extends Component {
    constructor(props) {
        super(props);

        this.state = {
            restaurants: [],
            filteredRestaurants: []
        };
    }

    componentDidMount() {
        axios.get(`${API_URL}/restaurants`)
            .then(res => {
                const restaurants = res?.data;

                if (restaurants?.length) {
                    this.setState({
                        restaurants: restaurants,
                        filteredRestaurants: restaurants
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

    formatDistance = (input) => {
        const dist = parseFloat(input);
        return dist.toFixed(1);
    };

    handleSearchChange = (event) => {
        event.preventDefault();
        const searchText = event.target.value;

        if (searchText && searchText.length > 0) {
            const filtered = this.state.restaurants.filter(x => x.name.toLowerCase().includes(searchText.toLowerCase()));
            this.setState({
                filteredRestaurants: filtered
            });
        } else {
            this.setState({
                filteredRestaurants: this.state.restaurants
            });
        }
    };

    render() {
        return <div className="restaurant-list">
            <h2>Restaurants</h2>
            <input type="text" placeholder="Search here" onChange={this.handleSearchChange}></input>
            {this.state.filteredRestaurants.map(restaurant => 
                <Link to={`/restaurants/${restaurant.id}`} className="item" key={restaurant.id}>
                    <div className="left">
                        <h3>{restaurant.name}</h3>
                        <p>{restaurant.address}</p>
                        <p>{this.formatNumber(restaurant.rating)}/6 <span className="fa fa-star checked"></span></p>
                    </div>
                    <div className="right">
                        <p>Hours: {restaurant.openingTime} - {restaurant.closingTime}</p>
                        <p>Delivery Fee: £{this.formatNumber(restaurant.deliveryFee)}</p>
                        <p>Minimum Spend: £{this.formatNumber(restaurant.minimumSpend)}</p>
                        <p>Distance: {this.formatDistance(restaurant.distance)} miles</p>
                    </div>
                </Link>
            )}
        </div>;
    }
}

export default Restaurants;