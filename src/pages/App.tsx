import React from "react";
import { BrowserRouter } from "react-router-dom";
import { NavLink} from "react-router";
import AppRoutes from "./routes";
import './App.css'

import {routesArray} from './routes'

function App() {
  return (
    <div id="app-wrapper">
      <BrowserRouter>
      <header className="app-header">
        <p>Header</p>
        <nav>
            {routesArray.map(({name, path, element})=>(
              <NavLink key={'NavLinkTo'+name} to={path} className={({ isActive }) => isActive ? " active" : "" } >{name}</NavLink>
              ))}
              <NavLink key={'NavLinkToABC'} to={'abc'} className={({ isActive }) => isActive ? " active" : "" } >{'ABC'}</NavLink>
        </nav>
        </header>
        <AppRoutes />
      </BrowserRouter>
    </div>
  );
}

export default App