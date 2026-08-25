import { Component } from 'react'
import AdminLayout from './layouts/Admin/Admin'
import AdminHome from './pages/Admin/AdminHome'
import EmployeeCreate from './pages/Admin/UserCreate'
import UserEdit from './pages/Admin/UserEdit'
import UserList from './pages/Admin/UserList'
import UserShow from './pages/Admin/UserShow'
import App from './layouts/App/App'
import Root from './layouts/Root'
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
        Component: AdminLayout,
        children: [
          { name: 'AdminHome', path: '/admin', index: true, Component: AdminHome},
          {
            path: '/admin/users',
            Component: UserList,
          },
          {
            path: '/admin/user/:userId',
            Component: UserShow,
          },
          {
            path: '/admin/employees/new',
            Component: EmployeeCreate,
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
