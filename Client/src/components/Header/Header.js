import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Header.scss";
import logo from '../../assets/logos/placeholder_logo.jpeg';

class Header extends Component {
    render() {
        return <header className="header">
            <Link to="/restaurants" className="logo">
                <img src={logo} alt="Just Eat" />
            </Link>
            <Link to="/restaurants">
                <button className="links"><span className="fa fa-list"></span> Restaurants</button>
            </Link>
        </header>;
    }
}

export default Header;