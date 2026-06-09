import React from 'react';
import logo from '../../logo.svg';
import './Home.css';

import JsTestComponent from '../../components/JsTestComponent/index'
import TsTestComponent from '../../components/TsTestComponent/TsTestComponent'

function Home() {
  return (
    <div id="home-wrapper">
        <img src={logo} className="home-logo" alt="logo" />
        <JsTestComponent />
        <TsTestComponent content='TsTestComponentContentOverwite' />
    </div>
  );
}

export default Home;
