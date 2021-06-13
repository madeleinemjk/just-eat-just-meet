import React, { Component } from 'react';
import './Submit.scss';
import sauce from '../../assets/images/notpla-seaweed-sauce-sachet.png';
import box from '../../assets/images/notpla-just-eat-seaweed-takeaway-box.png';
import axios from 'axios';

const MINIMUM_PRICE = 40;
const API_URL = process.env.REACT_APP_BACKEND_URL;
export default class Submit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            order: null,
            hempChecked: false,
            seaweedSachetChecked: false,
            seaweedContainerChecked: false,
            bambooChecked: false
        };
    }

    componentDidMount() {
        const orderId = this.props?.match?.params?.id;

        axios.get(`${API_URL}/orders/${orderId}`)
            .then(res => {
                const order = res.data;
                this.setState({
                    order: order
                });

                const orderItems = order.orderItems;
                const total = orderItems.map(item => item.quantity * item.menuItem.price)
                    .reduce((total, num) => {
                        return total += num;
                    }, 0);

                this.setState({
                    total: total
                });
            }).catch(console.error);
    }

    isPriceAboveMinimum = () => {
        return this.state.total >= MINIMUM_PRICE;
    };

    toggleHemp = () => {
        this.setState({
            hempChecked: !this.state.hempChecked
        });
    }

    toggleSeaweedSachet = () => {
        this.setState({
            seaweedSachetChecked: !this.state.seaweedSachetChecked
        })
    };

    toggleSeaweedContainer = () => {
        this.setState({
            seaweedContainerChecked: !this.state.seaweedContainerChecked
        });
    };

    toggleBambooChecked = () => {
        this.setState({
            bambooChecked: !this.state.bambooChecked
        });
    };

    submit = (event) => {
        event.preventDefault();
        console.log(this.state);
    };

    calculateExtras = () => {
        if (this.isPriceAboveMinimum())
            return 0;
        
        return (this.state.bambooChecked ? 1.99 : 0) + (this.state.hempChecked ? 1.99 : 0) + (this.state.seaweedContainerChecked ? 1.99 : 0) + (this.state.seaweedSachetChecked ? 1.99 : 0);
    };

    render() {
        return (
            <div className="submit-options">
                <h2>JustBeat Climate Change Today</h2>
                <div className="submit-options__img">
                    <img src={box} alt="Notpla seaweed sauce sachets" />
                    <img src={sauce} alt="Just Eat x Notpla seaweed takeaway box" />
                </div>
                <div className="submit-options__packaging">
                    {this.isPriceAboveMinimum() ? 
                        <p className="submit-options__advisory">
                            Congrats! Orders above £{MINIMUM_PRICE} are entitled to the below options for free.
                        </p> : 
                        <p className="submit-options__advisory">
                            Please spend over £{MINIMUM_PRICE} to qualify for free sustainability options.
                        </p> 
                    }
                    <div className="submit-options__packaging-div">
                        <input type="checkbox" id="optionHemp" name="submit-options__packaging-div--hemp" value={this.state.hempChecked} onChange={this.toggleHemp} />
                            <label htmlFor="optionHemp">Would you like your packaging to be biodegradable? Check this for compostable and recyclable plastic containers made from hemp! ({this.isPriceAboveMinimum() ? 'Free' : '£1.99'})</label><br></br>
                    </div>
                    <div className="submit-options__packaging-div">
                        <input type="checkbox" id="optionSeaweedSachet" name="submit-options__packaging-div--seaweed-sachet" value={this.state.seaweedSachetChecked} onChange={this.toggleSeaweedSachet} />
                            <label htmlFor="optionSeaweedSachet">Kelp the planet by opting for biodegradable -tasteless and edible- sauce sachets made out of seaweed. They are easier to open too! ({this.isPriceAboveMinimum() ? 'Free' : '£1.99'})</label><br></br>
                    </div>
                    <div className="submit-options__packaging-div">
                        <input type="checkbox" id="optionSeaweedContainer" name="submit-options__packaging-div--seaweed-container" value={this.state.seaweedContainerChecked} onChange={this.toggleSeaweedContainer} />
                            <label htmlFor="optionSeaweedContainer">Check out our boxes lined with seaweed instead of plastic - they are fully recyclable and compostable! ({this.isPriceAboveMinimum() ? 'Free' : '£1.99'})</label><br></br>
                    </div>
                    <div className="submit-options__packaging-div">
                        <input type="checkbox" id="optionBamboo" name="submit-options__packaging-div--bamboo" value={this.state.bambooChecked} onChange={this.toggleBambooChecked} />
                            <label htmlFor="optionBamboo">If you need single-use cutlery, check this box. We have switched from plastic to bamboo - biodegradable and stronger too! ({this.isPriceAboveMinimum() ? 'Free' : '£1.99'})</label>
                    </div>
                </div>
                <div className="submit-options__checkout-div">
                    <span>Extras: £{this.calculateExtras()}</span>
                    <button onClick={this.submit} className="submit-options__checkout-div--button">Checkout</button>
                </div>
            </div>
        )
    }
}
