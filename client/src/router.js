import React, { Component, Fragment } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
// routes
import Login from './pages/Login';
import SignUp from './pages/SignUp';
// components
import Navbar from './components/layouts/Navbar';
import Footer from './components/layouts/Footer';
import Landing from './components/layouts/Landing';

class Router extends Component {
  render () {
    return(
      <BrowserRouter>
        <Fragment>
          <Navbar/>
            <Route exact path="/" component={ Landing } />
            <div className="container">
              <Route exact path="/login" component={ Login } />
              <Route exact path="/register" component={ SignUp } />
            </div>
          <Footer/>
        </Fragment>
      </BrowserRouter>
    );
  }
}

export default Router;