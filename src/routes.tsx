import { Component } from 'react'
import Root from './layouts/Root'
import App from './layouts/App/App'
import Home from './pages/Home/Home'
import NotFound from './pages/NotFound/NotFound'
import LoginPage from './pages/Auth/Login'
import RegisterPage from './pages/Auth/Register'
import Profile from './pages/Auth/Profile'

const AppRoutes = [
  {
    Component: Root,
    children: [
     {path: '/', Component: App,
      children: [
        {name: 'Home', path: '/', index: true, Component: Home },
        {name: 'Login', path: '/login', Component: LoginPage },
        {name: 'Register', path: '/register', Component: RegisterPage },
        {name: 'profile', path: '/profile', Component: Profile },
        {name: 'NotFound', path: '/*', Component: NotFound}
      ]
     }
    ],
  },
]

export default AppRoutes

      // { path: '*', Component: NotFound },