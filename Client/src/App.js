import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Order from './components/Order/Order';
import RestaurantDetails from './components/RestaurantDetails/RestaurantDetails';
import Restaurants from './components/Restaurants/Restaurants';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path='/restaurants' exact component={Restaurants} />
          <Route path='/restaurants/:id' render={routeProps => (<RestaurantDetails {...routeProps} />)} />
          <Route path='/orders/:id' render={routeProps => (<Order {...routeProps} />)} />
        </Switch>
      </BrowserRouter>
    )
  };
};

export default App;
