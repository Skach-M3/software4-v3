<template>
  <div>
    <el-container class="con">
      <el-header class="header">
        <el-menu
          background-color="#071135"
          text-color="#fff"
          active-text-color="#fff"
          class="el-menu-demo"
          mode="horizontal"
        >
          <span index="1" style="float: left; color: cornflowerblue">
            <i class="el-icon-box"></i>
            <span style="font-size: 20px"
              >多病种疾病危险因素关联关系挖掘工具软件</span
            ></span
          >
          <!--            <template slot="title">当前服务器：</template>-->
          <el-dropdown style="float: right">
          <span class="el-dropdown-link" style="color: white;">
            欢迎您{{ LoginUserName }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="toUserCenter">个人信息</el-dropdown-item>
              <el-dropdown-item @click.native="updatePass">修改密码</el-dropdown-item>
              <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        </el-menu>
      </el-header>
      <el-container>
        <el-aside width="245px" class="side">
          <el-menu
            :default-active="activeIndex"
            router
            class="el-menu-vertical-demo"
            background-color="#071135"
            text-color="#fff"
            active-text-color="#ffd04b"
            @select="changeMenu()"
          >
            <el-menu-item index="/dash">
              <i class="el-icon-s-operation"></i>
              <span slot="title">首页</span>
            </el-menu-item>
            <!-- <el-menu-item index="/sideBar/tableManage">
              <i class="el-icon-menu"></i>
              <span slot="title">字段管理</span>
            </el-menu-item> -->
            <el-menu-item index="/dataManage">
              <i class="el-icon-s-data"></i>
              <span slot="title">数据管理</span>
            </el-menu-item>
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-folder"></i>
                <span>任务管理</span>
              </template>
              <el-menu-item index="/taskManage">
                <i class="el-icon-s-order"></i>
                <span slot="title">历史任务查看</span>
              </el-menu-item>
              <el-menu-item index="/DisFactor">
                <i class="el-icon-menu"></i>
                <span slot="title">疾病危险因素挖掘</span>
              </el-menu-item>
              <el-menu-item index="/F_Factor">
                <i class="el-icon-menu"></i>
                <span slot="title">危险因素关系挖掘</span>
              </el-menu-item>
              <el-menu-item index="/FactorDis">
                <i class="el-icon-menu"></i>
                <span slot="title">危险因素与多病种关系挖掘</span>
              </el-menu-item>
            </el-submenu>



            <el-submenu index="2" v-if="role == 0">
              <template slot="title">
                <i class="el-icon-setting"></i>
                <span>系统管理</span>
              </template>

              <el-menu-item index="/userManage">
                <i class="el-icon-user-solid"></i>
                <span slot="title">用户管理</span>
              </el-menu-item>
              <el-menu-item index="/inform">
                <i class="el-icon-info"></i>
                <span slot="title">信息发布</span>
              </el-menu-item>
              <el-menu-item index="/AdminDataManage">
                <i class="el-icon-s-data"></i>
                <span slot="title">数据集管理</span>
              </el-menu-item>
              <el-menu-item index="/LogManage">
                <i class="el-icon-message-solid"></i>
                <span slot="title">日志查看</span>
              </el-menu-item>
              <el-menu-item index="/disSetting">
                <i class="el-icon-suitcase"></i>
                <span slot="title">病种设置</span>
              </el-menu-item>
            </el-submenu>

            <div class="menu-footer">
              <el-menu-item index="/SoftwareIntro">
                软件介绍</el-menu-item
              >
              <el-menu-item index="/Operation"> 操作手册</el-menu-item>
            </div>
          </el-menu>
        </el-aside>
        <el-main class="main">
          <!-- <app-main></app-main> -->
          <router-view></router-view>
        </el-main>
      </el-container>

      <el-footer>
        <h1>
          重庆邮电大学 大数据智能计算创新研发团队 @CopyRight 2020-2024 All
          Rights Reserved
        </h1>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
// import AppMain from "@/components/AppMain";
export default {
  // components: { AppMain },
  mounted() {
    this.LoginUserName = sessionStorage.getItem("username");
    this.role = sessionStorage.getItem("userrole");
  },
  computed: {
    // 写在data里使用router.push时更改vuex后该值不会响应式更新
    activeIndex() {
      return this.$store.state.sideBarPath;
    },
  },
  data() {
    return {
      // activeIndex: this.$store.state.sideBarPath,
      // describVision: false,
      LoginUserName: "",
      role: "",
    };
  },
  methods: {
    ...mapMutations("disFactor", { dfChangeStep: "ChangeStep" }),
    changeMenu() {
      // this.dfChangeStep(1);
    },
    logout() {
      sessionStorage.clear();
      this.$router.replace("/");
      location.reload();
    },
    toUserCenter(){
      this.$router.push("/userCenter");
    },
    updatePass(){
      this.$router.push("/updatePassword");
    },
  },
};
</script>

<style scoped>
*{
  user-select: none;
}
.el-icon-mobile-phone {
  color: white;
}

.el-menu-vertical-demo span {
  font-size: 14px;
}

.el-menu-vertical-demo {
  /*解决侧边栏颜色无法撑起整个高度问题*/
  height: 100%;
  /*解决侧边栏凸起问题*/

  border-right: none;
}

.header {
  background-color: #071135;
  color: #333;
  /* text-align: center; */
  line-height: 59px;
}

.side {
  /*background-color: #071135;*/
  color: #333;
  /*text-align: center;*/
  /*line-height: 200px;*/
  height: calc(100vh - 81px);
}

.main {
  height: calc(100vh - 81px);
  /* background-color: #333; */
  /* width: 100vh; */
  /* overflow: auto; */
}

.el-footer {
  height: 20px !important;
  font-size: 10px;
  background-color: #a5a5a5bb;
  color: #252525;
  display: flex;
  justify-content: center;
  align-items: center;
}

.menu-footer {
  position: absolute;
  bottom: 0;
  margin-left: 40px;
}
</style>
