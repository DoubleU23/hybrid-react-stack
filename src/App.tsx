import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AppRoutes from "./pages/routes";

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App