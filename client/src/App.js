import React, { Component, Fragment } from 'react';
import Navbar from './components/layouts/Navbar';
import Footer from './components/layouts/Footer';
import Landing from './components/layouts/Landing';

class App extends Component {
  render() {
    return (
        <Fragment>
          <Navbar/>
          <Landing/>
          <Footer/>
        </Fragment>
    );
  }
}

export default App;
