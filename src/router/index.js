import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import AddView from '../views/AddView.vue';
import EditView from '../views/EditView.vue';
import ConfigView from '../views/ConfigView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/add',
      name: 'add',
      component: AddView
    },
    {
      path: '/edit/:id',
      name: 'edit',
      component: EditView
    },
    {
      path: '/config',
      name: 'config',
      component: ConfigView
    }
  ]
});

export default router;
