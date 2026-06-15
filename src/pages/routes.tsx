import App from "./App";
import NotFound from "./NotFound/NotFound";
import Home from "./Home/Home";

const AppRoutes = [
  {
    Component: App,
    children: [
      { path: '/', name: 'home', index: true, Component: Home },
      { path: '*', Component: NotFound}
    ]

  },
]

export default AppRoutes