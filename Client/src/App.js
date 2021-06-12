import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Order from './components/Order/Order';
import RestaurantDetails from './components/RestaurantDetails/RestaurantDetails';
import Restaurants from './components/Restaurants/Restaurants';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

class App extends React.Component {
  render() {
    return (<>
    <div className="container">
      <BrowserRouter>
        <Header />
        <Switch>
          <Route path='/restaurants' exact component={Restaurants} />
          <Route path='/restaurants/:id' render={routeProps => (<RestaurantDetails {...routeProps} />)} />
          <Route path='/orders/:id' render={routeProps => (<Order {...routeProps} />)} />
        </Switch>
      </BrowserRouter>
      </div>
      <Footer />
      </>
    )
  };
};

export default App;
