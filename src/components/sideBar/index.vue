<template>
  <div>
    <el-container class="con">
      <el-header class="header">
        <el-menu background-color="#071135" text-color="#fff" active-text-color="#fff" class="el-menu-demo"
          mode="horizontal">
          <span index="1" style="float: left; color: cornflowerblue">
            <i class="el-icon-box"></i>
            <span style="font-size:20px">多病种疾病危险因素关联关系挖掘工具软件</span></span>
          <!--            <template slot="title">当前服务器：</template>-->
          <el-menu-item index="2" style="float: right" @click="logout"><i class="el-icon-close"></i>退出登录</el-menu-item>
          <span index="3" style="float: right;color:#fff"><i class="el-icon-user"></i>欢迎您{{ LoginUserName }}</span>
        </el-menu>
      </el-header>
      <el-container>
        <el-aside width="215px" class="side">
          <el-menu :default-active=activeIndex router class="el-menu-vertical-demo" background-color="#071135"
            text-color="#fff" active-text-color="#ffd04b" @select="changeMenu()">
            <el-menu-item index="/sideBar/dash">
              <i class="el-icon-s-operation"></i>
              <span slot="title">首页</span>
            </el-menu-item>
            <!-- <el-menu-item index="/sideBar/tableManage">
              <i class="el-icon-menu"></i>
              <span slot="title">字段管理</span>
            </el-menu-item> -->
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-folder"></i>
                <span>任务管理</span>
              </template>
              <el-menu-item index="/sideBar/taskManage">
                <i class="el-icon-s-order"></i>
                <span slot="title">历史任务查看</span>
              </el-menu-item>
              <el-menu-item index="/sideBar/DisFactor">
                <i class="el-icon-menu"></i>
                <span slot="title">疾病危险因素挖掘</span>
              </el-menu-item>
              <el-menu-item index="/sideBar/F_Factor">
                <i class="el-icon-menu"></i>
                <span slot="title">危险因素相关因素挖掘</span>
              </el-menu-item>
              <el-menu-item index="/sideBar/FactorDis">
                <i class="el-icon-menu"></i>
                <span slot="title">危险因素相关疾病挖掘</span>
              </el-menu-item>
            </el-submenu>

            <el-menu-item index="/sideBar/dataManage">
              <i class="el-icon-s-data"></i>
              <span slot="title">数据管理</span>
            </el-menu-item>


            <el-submenu index="2" v-if="role == 0">
              <template slot="title">
                <i class="el-icon-setting"></i>
                <span>系统管理</span>
              </template>
              
            <el-menu-item index="/sideBar/userManage" >
              <i class="el-icon-user-solid"></i>
              <span slot="title">用户管理</span>
            </el-menu-item>
            <el-menu-item index="">
              <i class="el-icon-info"></i>
              <span slot="title">信息发布</span>
            </el-menu-item>
            <el-menu-item index="">
              <i class="el-icon-s-data"></i>
              <span slot="title">数据管理</span>
            </el-menu-item>
            <el-menu-item index="">
              <i class="el-icon-message-solid"></i>
              <span slot="title">日志查看</span>
            </el-menu-item>
            <el-menu-item index="">
              <i class="el-icon-suitcase"></i>
              <span slot="title">病种设置</span>
            </el-menu-item>
            </el-submenu>
            



            <div class="menu-footer">
              <el-menu-item index="/sideBar/SoftwareIntro"> 软件介绍</el-menu-item>
              <el-menu-item> 操作手册</el-menu-item>
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
          重庆邮电大学 大数据智能计算创新研发团队 @CopyRight 2020-2024 All Rights
          Reserved
        </h1>
      </el-footer>

    </el-container>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
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
    }
  },
  data() {
    return {
      // activeIndex: this.$store.state.sideBarPath,
      // describVision: false,
      LoginUserName: '',
      role: ''
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
    }
  },
};
</script>

<style scoped>
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
  overflow: auto;
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
