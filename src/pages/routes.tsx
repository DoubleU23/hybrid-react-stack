import App from './App'
import Home from './Home/Home'
import NotFound from './NotFound/NotFound'

const AppRoutes = [
  {
    Component: App,
    children: [
      { path: '/', name: 'home', index: true, Component: Home },
      { path: '*', Component: NotFound },
    ],
  },
]

export default AppRoutes
