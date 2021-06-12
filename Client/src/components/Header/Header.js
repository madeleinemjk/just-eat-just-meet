import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Header.scss";
import logo from '../../assets/logos/JustEatTakeaway_Logo.svg';

class Header extends Component {
    render() {
        return <header className="header">
            <Link to="/restaurants" className="logo">
                <img src={logo} alt="Just Eat" />
            </Link>
            <div className="links">
                <Link to="/restaurants">Restaurants</Link>
            </div>
        </header>;
    }
}

export default Header;