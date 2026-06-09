import React from 'react';
import logo from '../../logo.svg';
import './Home.css';

import JsTestComponent from '../../components/JsTestComponent/index'
import TsTestComponent from '../../components/TsTestComponent/TsTestComponent'

function Home() {
  return (
    <div className="Home">
      <header className="Home-header">
        <img src={logo} className="Home-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <JsTestComponent />
        <TsTestComponent content='TsTestComponentOverwite' />
      </header>
    </div>
  );
}

export default Home;
