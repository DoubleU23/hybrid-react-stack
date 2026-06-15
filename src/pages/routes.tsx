import {Routes, Route } from "react-router-dom";
import { ReactNode } from "react";
import App from "./App";
import NotFound from "./NotFound/NotFound";
import Home from "./Home/Home";


interface routeObject {
    name?: string,
    path?: string
    Component: ReactNode,
    children?: Array<routeObject>
}

const AppRoutes/* :routeObject[] */ = [
  {
    Component: App,
    children: [
      { path: '/', name: 'home', index: true, Component: Home },
      { path: '*', Component: NotFound}
    ]

  },
]

/* <Route path="/" element={<Home />} /> */

/* function AppRoutes(params:any) {
    return (
        <Routes> 
            {routesArray.map(({name, path, element}):ReactNode=>(<Route path={path} element={element} />))}
            <Route path="*" element={<NotFound />} /> 
      </Routes>
    )    
} */

export default AppRoutes