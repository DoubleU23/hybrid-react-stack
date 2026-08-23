import { Component } from 'react'
import Admin from './layouts/Admin/Admin'
import App from './layouts/App/App'
import Root from './layouts/Root'
import AdminHome from './pages/Admin/AdminHome'
import LoginPage from './pages/Auth/Login'
import Profile from './pages/Auth/Profile'
import RegisterPage from './pages/Auth/Register'
import Home from './pages/Home/Home'
import NotFound from './pages/NotFound/NotFound'

const AppRoutes = [
  {
    Component: Root,
    children: [
      {
        path: '/',
        Component: App,
        children: [
          { name: 'Home', path: '/', index: true, Component: Home, showInNav: true },
          { name: 'Login', path: '/login', Component: LoginPage, showInNav: false },
          { name: 'Register', path: '/register', Component: RegisterPage, showInNav: false },
          { name: 'profile', path: '/profile', Component: Profile, showInNav: false },
          { name: 'NotFound', path: '/*', Component: NotFound, showInNav: true },
        ],
      },
      {
        path: '/admin',
        Component: Admin,
        children: [{ name: 'Home', path: '/admin', index: true, Component: AdminHome }],
      },
    ],
  },
]

export default AppRoutes

// { path: '*', Component: NotFound },
