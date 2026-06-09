import React from 'react';
import logo from './logo.svg';
import './App.css';

import JsTestComponent from './components/JsTestComponent/index'
import TsTestComponent from './components/TsTestComponent/TsTestComponent'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <JsTestComponent />
        <TsTestComponent content='TsTestComponentOverwite' />
      </header>
    </div>
  );
}

export default App;
