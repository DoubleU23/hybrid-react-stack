import React from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';
import AppRoutes from './pages/routes';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router-dom";

const router = createBrowserRouter(AppRoutes);

createRoot(
  document.getElementById('root') as HTMLElement
).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode> 
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
