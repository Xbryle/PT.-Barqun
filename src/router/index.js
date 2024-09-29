import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '../views/LoginView.vue'
import Notes from '../views/NotesView.vue'
import Tasks from '../views/TasksView.vue'
import Users from '../views/UsersView.vue'
import SetProfile from '../views/SetProfileView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'homeView',
    component: HomeView,
    meta:{
      title: 'Barqun TMT',
    },
  },
  {
    path: '/tasks',
    name: 'Tasks',
    component: Tasks,
    meta:{
      title: 'Barqun TMT',
    },
  },
  {
    path: '/notes',
    name: 'Notes',
    component: Notes,
    meta:{
      title: 'Barqun TMT',
    },
  },
  {
    path: '/users',
    name: 'Users',
    component: Users,
    meta:{
      title: 'Barqun TMT',
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta:{
      title: 'Barqun TMT',
    }
  },
  {
    path: '/set-profile',
    name: 'SetProfile',
    component: SetProfile,
    meta:{
      title: 'Barqun TMT',
    }
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  // base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = JSON.parse(localStorage.getItem('authenticated'))
  if(to.name !== 'Login' && !isAuthenticated) next({name: 'Login'});
  if(to.name === 'Login' && isAuthenticated) next({name: 'homeView'});
  else next();

});

export default router
