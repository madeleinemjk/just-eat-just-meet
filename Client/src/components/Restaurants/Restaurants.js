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

    render() {
        return <div>{this.state.restaurants.map(restaurant => <p key={restaurant.id}><Link to={`/restaurants/${restaurant.id}`}>{restaurant.name}</Link></p>)}</div>;
    }
}

export default Restaurants;