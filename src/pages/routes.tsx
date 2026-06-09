import {Routes, Route } from "react-router-dom";
import Home from "./Home/Home";


function AppRoutes(params:any) {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
      </Routes>
    )    
}

export default AppRoutes