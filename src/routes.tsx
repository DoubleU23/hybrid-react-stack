import { Component } from 'react'
import Root from './Root'
import App from './layouts/App/App'
import Home from './pages/Home/Home'
import NotFound from './pages/NotFound/NotFound'

const AppRoutes = [
  {
    Component: Root,
    children: [
     {path: '/', Component: App, children:
      [
        { index: true, Component: Home },
        {path: '/*', Component: NotFound}
      ]
     }
    ],
  },
]

export default AppRoutes

      // { path: '*', Component: NotFound },