import { Component } from 'react'
import Root from './layouts/Root'
import App from './layouts/App/App'
import Home from './pages/Home/Home'
import NotFound from './pages/NotFound/NotFound'

const AppRoutes = [
  {
    Component: Root,
    children: [
     {path: '/', Component: App,
      children: [
        {name: 'Home', path: '/', index: true, Component: Home },
        {name: 'NotFound', path: '/*', Component: NotFound}
      ]
     }
    ],
  },
]

export default AppRoutes

      // { path: '*', Component: NotFound },