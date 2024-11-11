import Vue from 'vue'
import store from '../store/index'
import VueRouter from 'vue-router'
import SideBar from '@/components/sideBar/index.vue'
import dash from '@/views/dash/index.vue'
import LogIn from "@/views/User/Login.vue"
import register from "@/views/User/register.vue"
import forget from "@/views/User/forget.vue"
import userManage from "@/components/tab/manager/userManage.vue"
import inform from "@/components/tab/manager/inform.vue"
import unauthorized from "@/views/404.vue"
import TaskManage from "@/components/tab/TaskManage.vue";
import dataManage from "@/components/tab/dataManage.vue";
import DisFactor from "@/components/tab/DisFactor.vue"
import F_Factor from "@/components/tab/F_Factor.vue";
import FactorDis from "@/components/tab/FactorDis.vue";
import tableManage from "@/components/tab/tableManage.vue";
// import userManage from "@/components/tab/userManage.vue"; 老的用户管理，整合完新的后可删除
import TaskResult from "@/components/tab/subcomponents/TaskResult.vue";
import AdminDataManage from "@/components/tab/manager/AdminDataManage.vue";
import DisSetting from "@/components/tab/manager/DisSetting.vue";
import LogManage from "@/components/tab/manager/LogManage.vue";
import SoftwareIntro from "@/components/tab/SoftwareIntro.vue";
import Operation from "@/components/tab/Operation.vue";
import updatePassword from "@/components/tab/updatePassword.vue";
import userCenter from "@/components/tab/userCenter.vue";
Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "LogIn",
    component: LogIn,
  },
  {
    path: "/register",
    name: "register",
    component: register,
  },
  // {
  //   path: "/register",
  //   name: "Register",
  //   component: Register,
  // },
  {
    path: '/forget',
    name: 'forget',
    component: forget,
    meta: { roles: ['1', '0'] }, 
  },
  {
     path: "/sideBar",
    //path: "/SoftwareIntro",
    name: "SideBar",
    redirect: "/SoftwareIntro",
    component: SideBar,
    meta: { roles: ['1', '0'] }, // 只允许管理员0和普通用户1访问
    children: [
      {
        path: '/unauthorized',
        name: 'unauthorized',
        component: unauthorized,
        meta: { roles: ['1', '0'] },
      },
      {
        path: "/dash",
        name: "dash",
        component: dash,
        meta: { roles: ['1', '0'] },
      },
      {
        path: "/tableManage",
        name: "tableManage",
        component: tableManage,
        // meta: { roles: ['1', '0'] },
      },
      {
        path: "/dataManage",
        name: "dataManage",
        component: dataManage,
        meta: { roles: ['1', '0'] },
      },
      {
        path: "/updatePassword",
        name: "updatePassword",
        component: updatePassword,
        meta: { roles: ['0'] },
      },
      {
        path: "/userCenter",
        name: "userCenter",
        component: userCenter,
        meta: { roles: ['0'] },
      },
      {
        path: "/AdminDataManage",
        name: "AdminDataManage",
        component: AdminDataManage,
        meta: { roles: ['0'] },
      },
      {
        path: "/userManage",
        name: "userManage",
        component: userManage,
        meta: { roles: ['0'] },
      },
      {
        path: "/SoftwareIntro",
        name: "SoftwareIntro",
        component: SoftwareIntro,
        meta: { roles: ['1', '0'] },
      },
      {
        path: "/Operation",
        name: "Operation",
        component: Operation,
        meta: { roles: ['1', '0'] },
      },
      {
        path: "/TaskManage",
        name: "TaskManage",
        component: TaskManage,
        meta: { roles: ['1', '0'] },
      },
      {
        path: "/TaskResult",
        name: "TaskResult",
        component: TaskResult,
        meta: { roles: ['1', '0'] },
      },
      {
        path: "/DisFactor",
        name: "DisFactor",
        component: DisFactor,
        meta: { roles: ['1', '0'] },
      },
      {
        path: "/F_Factor",
        name: "F_Factor",
        component: F_Factor,
        meta: { roles: ['1', '0'] },
      },
      {
        path: "/FactorDis",
        name: "FactorDis",
        component: FactorDis,
        meta: { roles: ['1', '0'] },
      },
      {
        path: "/DisSetting",
        name: "DisSetting",
        component: DisSetting,
        meta: { roles: ['0'] },
      },
      {
        path: "/LogManage",
        name: "LogManage",
        component: LogManage,
        meta: { roles: ['0'] },
      },
      {
        path: "/inform",
        name: "inform",
        component: inform,
        meta: { roles: ['0','1'] },
      },
    ],
  },
];

const router = new VueRouter({
  routes
})

const whiteList = ['/logIn', '/register', '/unauthorized','/forget']

router.beforeEach(function(to, from, next) {
  //to将要访问的路径
  //from代表从哪个路径跳转而来
  //next是一个函数，表示放行
  //next() 放行 next('/login')强制跳转

  // 刘璇的路由设置
  if (whiteList.indexOf(to.path) !== -1) {
    // 如果在白名单中，则直接放行
    next()
  } else {
    const userRoles = sessionStorage.getItem('userrole'); // 从sessionStorage获取用户角色信息
    let record = to.matched[to.matched.length - 1]// 获取当前匹配路由的最右侧路由
    let isAuthorized = false; // 初始化权限标志为false

    if (record.meta.roles) {
      // 检查用户角色是否在路由允许的角色列表中
      if (record.meta.roles.includes(userRoles)) {
        isAuthorized = true; // 如果找到匹配的角色，设置权限标志为true
      }
    }
    if (isAuthorized) {
      if(to.path === "/TaskResult"){
        store.commit("SetSideBarPath","/taskManage");
      }else{
        store.commit("SetSideBarPath",to.path);
      }
      next(); // 用户有权限，允许访问
    } else if (to.matched.some(record => record.meta.roles)) {
   
      next({ path: '/unauthorized' }); // 用户无权限，重定向到未授权页面
    } else {
      if(to.path === "/TaskResult"){
        store.commit("SetSideBarPath","/taskManage");
      }else{
        store.commit("SetSideBarPath",to.path);
      }
      next(); // 如果没有定义roles元数据，允许所有用户访问
    }
  }

// 自己的路由设置
  // if (to.path === '/') return next();
  // if(to.path==='/register') return next();
  // //获取token
  // const uid = window.sessionStorage.getItem('userid');
  // if (!uid) return next('/');
  // // 查看任务结果页面需要高亮历史任务侧栏
  // console.log(to.path);
  // if(to.path === "/TaskResult"){
  //   store.commit("SetSideBarPath","/taskManage");
  // }else{
  //   store.commit("SetSideBarPath",to.path);
  // }
  // next();
});
export default router
