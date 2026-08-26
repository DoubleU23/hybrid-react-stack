import AdminLayout from './layouts/Admin/Admin'
import App from './layouts/App/App'
import Root from './layouts/Root'
import LoginPage from './pages/Auth/Login'
import Profile from './pages/Auth/Profile'
import RegisterPage from './pages/Auth/Register'
import AdminHome from './pages/admin/AdminHome'
import UserEdit from './pages/admin/users/UserEdit'
import UserList from './pages/admin/users/UserList'
import UserShow from './pages/admin/users/UserShow'
import Home from './pages/Home/Home'
import NotFound from './pages/NotFound/NotFound'
import ArticlesList from './pages/admin/articles/ArticlesList'
import ArticleShow from './pages/admin/articles/ArticleShow'
import ArticleCreate from './pages/admin/articles/ArticlesCreate'

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
          // USERS
          { path: '/admin/users', Component: UserList, showInNav: true},
          { path: '/admin/users/:userId', Component: UserShow, showInNav: true },
          { path: '/admin/users/:userId/edit', Component: UserEdit, showInNav: true},
          { path: '/admin/*', Component: AdminHome, showInNav: true },
          // ARTICLES
          { path: '/admin/articles', Component: ArticlesList, showInNav: true },
          { path: '/admin/articles/:articleId/show', Component: ArticleShow, showInNav: true },
          { path: '/admin/articles/create', Component: ArticleCreate, showInNav: true},
          // { path: '/admin/articles/:articleId/edit', Component: ArticleEdit },
          // { path: '/admin/*', Component: AdminHome },
        ],
      },
    ],
  },
]

export default AppRoutes

// { path: '*', Component: NotFound },
