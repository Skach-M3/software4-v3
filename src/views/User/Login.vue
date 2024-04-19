<template>
  <div class="myMain">
    <div class="mainContainer">
      <div class="leftContainer">
        <div class="mainRight">
          <img
            src="http://www.cqupt.edu.cn/dfiles/13011/cqupt/img/favicon_128x128.ico"
            style="height: 100px; width: 100px"
          />
          <h1>疾病危险因素与多病种疾病关联关系挖掘工具软件</h1>
        </div>
        <div class="mainImg">
          <img
            class="gif"
            src="https://img.benmu-health.com/sanyi-health/gif.gif"
          />
          <img
            class="png"
            src="https://img.benmu-health.com/sanyi-health/main-pic-new.png"
          />
        </div>
      </div>
      <div class="rightContainer">
        <div class="loginContainer">
          <div class="myForm">
            <el-form
              element-loading-text="正在登陆..."
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8)"
              ref="loginForm"
              :model="loginForm"
              :rules="rules"
              style="font-size: 30px"
            >
              <h3 class="loginTitle">软件登陆</h3>
              <el-form-item prop="username">
                <el-input
                  type="text"
                  auto-complete="false"
                  v-model="loginForm.username"
                  placeholder="请输入用户名"
                ></el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  type="password"
                  auto-complete="false"
                  v-model="loginForm.password"
                  placeholder="请输入密码"
                ></el-input>
              </el-form-item>
              <el-form-item prop="code">
                <el-input
                  type="text"
                  auto-complete="false"
                  v-model="loginForm.code"
                  placeholder="点击图片更换验证码"
                  style="width: 250px; margin-right: 5px"
                ></el-input>
                <img :src="captchaUrl" @click="updatecaptcha" />
              </el-form-item>
              <div
                style="
                  display: flex;
                  justify-content: space-between;
                  margin-top: -15px;
                "
              >
                <el-button type="text" @click="forgetPsw">忘记密码</el-button>
                <el-button type="text" @click="register">注册账号</el-button>
              </div>
              <el-button
                type="primary"
                style="width: 100%; font-size: 20px; margin-top: 20px"
                @click="submitlogin"
                >登录</el-button
              >
              <!-- <el-button
                type="danger"
                style="
                  width: 100%;
                  margin-top: 20px;
                  margin-left: 0px;
                  font-size: 20px;
                "
                @click="backToPlatform"
                >退出软件</el-button
              > -->
            </el-form>
          </div>
          <div class="notificationDiv">
            <div class="notification_title">通告栏</div>
            <div class="notification_container">
              <div :class="{ 'animate-scroll': notification.length > 6 }">
                <div v-for="(item) in notification" :key="item.infoId">
                  <ul>
                    <li
                      style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        line-height: 15px;
                        overflow: hidden;
                      "
                    >
                      <span
                        class="notification_content_title"
                        @click="showDetails(item)"
                      >
                        <span
                          class="scroll-text"
                          :class="{
                            scrolling: item.title.split('').length > 25,
                          }"
                        >
                          {{ item.title }}</span
                        >
                      </span>
                      <span style="padding-right: 20px">{{
                        item.createTime
                      }}</span>
                    </li>
                  </ul>
                  <el-divider></el-divider>
                </div>
              </div>
            </div>
          </div>
        </div>
        <el-dialog
          title="通告详细信息"
          :visible.sync="dialogVisible"
          width="50%"
          center
          :close-on-click-modal="true"
        >
          <div class="selectedNotificationTitle">
            {{ selectedNotification.title }}
          </div>
          <div class="selectedNotificationContent">
            {{ selectedNotification.content }}
          </div>
        </el-dialog>
      </div>
    </div>
    <div class="cooperation">
      <el-row class="text-coop">
        <el-col :span="24">合作单位：</el-col>
      </el-row>
      <el-row class="text-photo1" style="margin-top: 5px">
        <el-col :span="6">
          <img
            src="@/assets/cqupt.png"
            alt="重庆邮电大学"
            style="height: 45px"
          />
        </el-col>
        <el-col :span="5">
          <img src="@/assets/sdu.png" alt="山东大学" style="height: 45px" />
        </el-col>
        <el-col :span="5">
          <img
            src="@/assets/sanjun.jpg"
            alt="陆军军医大学"
            style="height: 45px"
          />
        </el-col>
        <el-col :span="7">
          <img
            src="@/assets/sfu.png"
            alt="山东第一医科大学"
            style="height: 45px"
          />
        </el-col>
      </el-row>
      <el-row class="text-photo1">
        <el-col :span="6">
          <img src="@/assets/lrjk.png" alt="联仁健康" style="height: 45px" />
        </el-col>
        <el-col :span="5">
          <img src="@/assets/hhrj.png" alt="互惠软件" style="height: 45px" />
        </el-col>
        <el-col :span="5">
          <img src="@/assets/ft.png" alt="富通" style="height: 45px" />
        </el-col>
        <el-col :span="7">
          <img
            src="@/assets/sdhl.png"
            alt="山东华链医疗科技有限公司"
            style="height: 45px"
          />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getRequest, postRequest } from "@/utils/api";
export default {
  name: "Login",

  data() {
    return {
      captchaUrl: `api/common/kaptcha?timestamp=${new Date().getTime()}`,
      loginForm: {
        username: "",
        password: "",
        code: "",
      },
      loading: false,
      checked: true,
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
      },
      notification: [],
      selectedNotification: {},
      dialogVisible: false,
    };
  },
  created() {
    this.getNotification();
  },
  mounted() {
    this.updatecaptcha();
  },
  methods: {

    showDetails(item) {
      this.selectedNotification = item;
      this.dialogVisible = true;
    },
    convertToBeijingTime(isoString) {
      // 解析 ISO 字符串为 Date 对象
      const date = new Date(isoString);

      // 调整时区到北京时间，UTC+8
      const beijingTime = new Date(date.getTime() + 8 * 60 * 60 * 1000); // 添加8小时的毫秒数

      // 使用 Intl.DateTimeFormat 格式化输出
      const formatter = new Intl.DateTimeFormat("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "Asia/Shanghai",
      });

      return formatter
        .format(beijingTime)
        .replace(/\//g, "-")
        .replace(", ", " ");
    },
    getNotification() {
      getRequest("notice/queryNotices").then((res) => {
        if (res) {
          const temp = res.map((item) => ({
            ...item,
            createTime: this.convertToBeijingTime(item.createTime),
          }));
          this.notification = temp;
       
        }
      });
    },
    handleClose(done) {
      console.log("close");
      this.dialogVisible = false;
      done(); // 必须调用 done()，否则对话框不会关闭
    },
    updatecaptcha() {
     
      this.captchaUrl = `api/common/kaptcha?timestamp=${new Date().getTime()}`;
    },

    submitlogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          postRequest("user/login", this.loginForm).then((resp) => {
            if (resp) {
              this.loading = false;
              console.log(resp);
              if (resp.code == "200") {
                if (resp.data.userStatus === "1") {
                  console.log("in");
                  sessionStorage.setItem("username", resp.data.username);
                  sessionStorage.setItem("userid", resp.data.uid);
                  sessionStorage.setItem("userrole", resp.data.role);
                  this.$router.push("/sideBar");
                  this.$message.success("登录成功");
                } else if (resp.data.userStatus === "2") {
                  this.$message.error("您的账号已被禁用");
                }else {
                  this.$message.error("账号异常，请联系管理员或重新注册");
                }
              }else if(resp.code == "400"){
                this.$message.warning("您的账号待激活，请等待管理员处理");
              }
            } else {
              this.$message.error("用户不存在或者密码错误");
            }
          });
        } else {
          this.$message.error("请输入所有字段");
          return false;
        }
      });
    },
    register() {
      this.$router.push("/register");
    },
    forgetPsw() {
      this.$router.push("/forget");
    },
    // backToPlatform() {
    //   window.location.href = "http://10.16.48.219:8000";
    // },
  },
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}
li {
  list-style-type: none; /* 去除列表项前的标记 */
  margin: 0; /* 去除列表项的默认外边距 */
  padding: 0; /* 去除列表项的默认内边距 */
}
.myMain {
  width: 100%;
  background: url("https://img.benmu-health.com/sanyi-health/bg1-new.png")
    no-repeat;
  background-size: 100% 100%;
}
.mainContainer {
  display: flex; /* 启用Flex布局 */
  height: 90vh;
}
.leftContainer {
  flex: 0.4; /* 左侧盒子的放大比例为1 */
  padding: 20px; /* 内边距 */
}
.rightContainer {
  flex: 0.6; /* 右侧盒子的放大比例为2 */
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 30px;
}
.loginContainer {
  border-radius: 15px;
  background-clip: padding-box;
  /* margin: 20px 10px; */
  margin-bottom: 150px;
  width: 900px;
  height: 550px;
  background: white;
  border: 1px solid #eaeaee;
  box-shadow: 0 0 25px #cac6c6;
  display: flex;
  align-items: center;
}
.myForm {
  flex: 0.45;
  padding-left: 30px;
  padding-right: 30px;
}
.notificationDiv {
  flex: 0.55;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  height: 550px;
  border-left: 1px dashed #aaaaac;

}
.loginTitle {
  margin: 0px auto 40px auto;
  text-align: center;
}

/* .loginDiv {
  position: absolute;
  right: 80px;
  margin-top: 40px;
} */

img.gif {
  position: absolute;
  top: 479px;
  left: 909px;
}

img.png {
  position: absolute;
  top: 315px;
  left: 612px;
}

.mainRight {
  position: absolute;
  top: 8px;
  left: 100px;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.mainRight h1 {
  display: block;
  color: white;
  font-size: 40px;
  letter-spacing: 4px;
  margin-top: -10px;
}
.mainImg {
  display: block;
  position: absolute;
  left: -480px;
  top: -200px;
}

.cooperation {
  background-color: white;
  position: absolute;
  bottom: 0px;
  width: 100%;
  height: 150px;
}
.cooperation .text-coop {
  margin-left: 20px;
  text-align: left;
  font-size: 20px;
  font-weight: 1000;
  color: black;
}
.cooperation img {
  margin-left: 10px;
}
.loginRemember {
  text-align: left;
  margin: 0px 0px 15px 0px;
}
.el-form-item__content {
  display: flex;
  align-items: center;
}
.notification_title {
  font-size: 30px;
  font-weight: bold;
  flex: 0.25;
  justify-content: center;
  align-items: center;
  display: flex;
}
.notification_container {
  flex: 0.75;
  width: 100%;
  height: 450px;
    overflow: hidden;
}
.collapse {
  overflow: auto;
  flex: 0.75;
  width: 100%;
}
.notification_content_title {
  padding-left: 20px;
  white-space: nowrap;
  overflow: hidden;
  cursor: pointer;
  max-width: 250px;
}
@keyframes scroll {
  0% {
    transform: translateX(250px);
  }
  100% {
    transform: translateX(-100%);
  }
  200% {
    transform: translateX(250px);
  }
}

.scroll-text {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  font-weight: 500;
}

.scrolling {
  animation: scroll 10s linear infinite;
}

.notification_content_title:hover .scroll-text {
  animation-play-state: running;
}

.selectedNotificationTitle {
  font-size: 30px;
  font-weight: bold;
  display: flex;
  justify-content: center;
}
.selectedNotificationContent {
  font-size: 17px;
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
.animate-scroll {
  animation: scroll-up 30s linear infinite;
}

@keyframes scroll-up {
  0% {
    transform: translateY(0%);
  }
  100% {
    transform: translateY(-100%);
  }
    150% {
    transform: translateY(0%);
  }
}
</style>
