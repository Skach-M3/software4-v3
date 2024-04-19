import Vue from 'vue'
import store from '../store/index'
import VueRouter from 'vue-router'
import SideBar from '@/components/sideBar/index.vue'
import dash from '@/views/dash/index.vue'
import TaskManage from "@/components/tab/TaskManage.vue";
import dataManage from "@/components/tab/dataManage.vue";
import modelManage from "@/components/tab/modelManage.vue";
import DisFactor from "@/components/tab/DisFactor.vue"
import F_Factor from "@/components/tab/F_Factor.vue";
import FactorDis from "@/components/tab/FactorDis.vue";
import tableManage from "@/components/tab/tableManage.vue";
import userManage from "@/components/tab/userManage.vue";
import Login from "@/components/login/Login.vue";
import Register from "@/components/login/register.vue";
import TaskResult from "@/components/tab/subcomponents/TaskResult.vue";
import AdminDataManage from "@/components/tab/AdminDataManage.vue";
import DisSetting from "@/components/tab/DisSetting.vue";
import LogManage from "@/components/tab/LogManage.vue";
// import LogIn from "@/views/LogIn.vue"
import SoftwareIntro from "@/components/tab/SoftwareIntro.vue";
Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "LogIn",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
     path: "/sideBar",
    //path: "/SoftwareIntro",
    name: "SideBar",
    //redirect: "/SoftwareIntro",
    component: SideBar,
    children: [
      {
        path: "dash",
        name: "dash",
        component: dash,
      },
      {
        path: "tableManage",
        name: "tableManage",
        component: tableManage,
      },
      {
        path: "dataManage",
        name: "dataManage",
        component: dataManage,
      },
      {
        path: "AdminDataManage",
        name: "AdminDataManage",
        component: AdminDataManage,
      },
      {
        path: "userManage",
        name: "userManage",
        component: userManage,
      },
      {
        path: "modelManage",
        name: "modelManage",
        component: modelManage,
      },
      {
        path: "SoftwareIntro",
        name: "SoftwareIntro",
        component: SoftwareIntro,
      },
      {
        path: "TaskManage",
        name: "TaskManage",
        component: TaskManage,
      },
      {
        path: "TaskResult",
        name: "TaskResult",
        component: TaskResult
      },
      {
        path: "DisFactor",
        name: "DisFactor",
        component: DisFactor,
      },
      {
        path: "F_Factor",
        name: "F_Factor",
        component: F_Factor,
      },
      {
        path: "FactorDis",
        name: "FactorDis",
        component: FactorDis,
      },
      {
        path: "DisSetting",
        name: "DisSetting",
        component: DisSetting,
      },
      {
        path: "LogManage",
        name: "LogManage",
        component: LogManage,
      },

    ],
  },
];

const router = new VueRouter({
  routes
})
router.beforeEach(function(to, from, next) {
  //to将要访问的路径
  //from代表从哪个路径跳转而来
  //next是一个函数，表示放行
  //next() 放行 next('/login')强制跳转

  if (to.path === '/') return next();
  if(to.path==='/register') return next();
  //获取token
  const uid = window.sessionStorage.getItem('userid');
  if (!uid) return next('/');
  // 查看任务结果页面需要高亮历史任务侧栏
  console.log(to.path);
  if(to.path === "/sideBar/TaskResult"){
    store.commit("SetSideBarPath","/sideBar/taskManage");
  }else{
    store.commit("SetSideBarPath",to.path);
  }
  next();
});
export default router
