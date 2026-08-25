import AdminLayout from './layouts/Admin/Admin'
import App from './layouts/App/App'
import Root from './layouts/Root'
import LoginPage from './pages/Auth/Login'
import Profile from './pages/Auth/Profile'
import RegisterPage from './pages/Auth/Register'
import AdminHome from './pages/admin/AdminHome'
import UserEdit from './pages/admin/UserEdit'
import UserList from './pages/admin/UserList'
import UserShow from './pages/admin/UserShow'
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
        Component: AdminLayout,
        children: [
          { name: 'AdminHome', path: '/admin', index: true, Component: AdminHome },
          {
            path: '/admin/users',
            Component: UserList,
          },
          {
            path: '/admin/user/:userId',
            Component: UserShow,
          },
          {
            path: '/admin/users/:userId/edit',
            Component: UserEdit,
          },
          // Fallback route for the example routes in dashboard sidebar items
          {
            path: '/admin/*',
            Component: UserList,
          },
        ],
      },
    ],
  },
]

export default AppRoutes

// { path: '*', Component: NotFound },
