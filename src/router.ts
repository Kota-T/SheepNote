import { createRouter, createWebHistory } from 'vue-router'
import SheepIconList from './components/SheepIconList.vue'
import RegisterSheep from './components/RegisterSheep.vue'
import SheepEditor from './components/SheepEditor.vue'
import GroupList from './components/GroupList.vue'
import GroupSheepIconList from './components/GroupSheepIconList.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'index',
      component: SheepIconList
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterSheep
    },
    {
      path: '/sheep/:sheep_id',
      name: 'sheep',
      component: SheepEditor,
      props: true
    },
    {
      path: '/groups',
      name: 'groups',
      component: GroupList
    },
    {
      path: '/group/:group_id',
      name: 'group',
      component: GroupSheepIconList,
      props: true
    },
  ]
})
