import {Routes, Route } from "react-router-dom";
import { ReactNode } from "react";
import NotFound from "./NotFound/NotFound";
import Home from "./Home/Home";


interface routeObject {
    name: string,
    path: string
    element: ReactNode
}
export const routesArray:routeObject[] = [
    {name: 'Home', path: '/', element: <Home />}
]

/* <Route path="/" element={<Home />} /> */

function AppRoutes(params:any) {
    return (
        <Routes> 
            {routesArray.map(({name, path, element}):ReactNode=>(<Route path={path} element={element} />))}
            <Route path="*" element={<NotFound />} /> 
      </Routes>
    )    
}

export default AppRoutes