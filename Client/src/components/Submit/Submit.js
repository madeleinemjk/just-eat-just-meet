import React, { Component } from 'react';
import './Submit.scss';
import sauce from '../../assets/images/notpla-seaweed-sauce-sachet.png';
import box from '../../assets/images/notpla-just-eat-seaweed-takeaway-box.png';

export default class Submit extends Component {
    render() {
        return (
            <div className="submit-options">
                <h2>JustBeat Climate Change Today</h2>
                <div className="submit-options__img">
                    <img src={box} alt="Notpla seaweed sauce sachets" />
                    <img src={sauce} alt="Just Eat x Notpla seaweed takeaway box" />
                </div>
                <div className="submit-options__packaging">
                    <div className="submit-options__packaging-div">
                        <input type="checkbox" id="optionHemp" name="submit-options__packaging-div--hemp" value="hempChecked" />
                            <label for="optionHemp">Would you like your packaging to be biodegradable? Check this for compostable and recyclable plastic containers made from hemp!</label><br></br>
                    </div>
                    <div className="submit-options__packaging-div">
                        <input type="checkbox" id="optionSeaweedSachet" name="submit-options__packaging-div--seaweed-sachet" value="seaweedSachetChecked" />
                            <label for="optionSeaweedSachet">Kelp the planet by opting for biodegradable -tasteless and edible- sauce sachets made out of seaweed. They are easier to open too!</label><br></br>
                    </div>
                    <div className="submit-options__packaging-div">
                        <input type="checkbox" id="optionSeaweedContainer" name="submit-options__packaging-div--seaweed-container" value="seaweedContainerChecked" />
                            <label for="optionSeaweedContainer">Check out our boxes lined with seaweed instead of plastic - they are fully recyclable and compostable!</label><br></br>
                    </div>
                    <div className="submit-options__packaging-div">
                        <input type="checkbox" id="optionBamboo" name="submit-options__packaging-div--bamboo" value="bambooChecked" />
                            <label for="optionBamboo">If you need single-use cutlery, check this box. We have switched from plastic to bamboo - biodegradable and stronger too!</label>
                    </div>
                </div>
                <div className="submit-options__checkout-div">
                    <button className="submit-options__checkout-div--button">Checkout</button>
                </div>
            </div>
        )
    }
}
