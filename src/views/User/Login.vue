<template>
  <div class="myMain">
    <div class="mainContainer">
      <div class="topContainer">
        <div class="mainRight1">
          <img
            src="http://www.cqupt.edu.cn/dfiles/13011/cqupt/img/favicon_128x128.ico"
            style="height: 100px; width: 100px"
          />
          <h1>疾病危险因素与多病种关联关系挖掘工具软件</h1>
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
      <div class="bottomContainer">
        <div class="notificationDiv">
          <div class="notification_title">
            <span style="font-size: 20px; font-weight: bold; margin-top: 20px"
              >通告栏</span
            >
            <div style="display: flex; line-height: 20px; margin-top: 20px">
              <el-button type="text" @click="moreNotice">
                <i class="el-icon-zoom-in"></i>更多</el-button
              >
            </div>
          </div>
          <div class="notification_container">
            <div v-for="(item, index) in notification" :key="item.infoId">
              <ul>
                <li
                  style="
                    display: flex;
                    justify-content: space-between;
                    align-items: end;
                    line-height: 15px;
                    overflow: hidden;
                    width: 650px;
                  "
                
                >
                  <span
                    class="notification_content_title"
                    @click="showDetails(item)"
                    :class="{'scroll-on-hover': shouldScroll(item.title)}"
                  >
                    <span> {{ item.title }}</span>
                  </span>
                  <span style="padding-right: 20px">{{ item.updateTime }}</span>
                </li>
              </ul>
              <el-divider></el-divider>
            </div>
          </div>
        </div>
        <div class="loginContainer">
          <!-- <div class="banner">
            <div class="notification_container">
              <div
                class="scroll-text"
                title="点击查看更多通知"
                @click="moreNotice"
              >
                {{ notification }}
              </div>
            </div>
          </div> -->
          <div class="myForm">
            <!-- </div> -->

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
        <el-dialog
          title="通告栏"
          :visible.sync="dialogVisible2"
          :modal-append-to-body='false'
          width="50%"
          center
          :close-on-click-modal="true"
        >
          <div v-for="(item, index) in notification" :key="item.infoId" >
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
                  <span> {{ item.title }}</span>
                </span>
                <span style="padding-right: 20px">{{ item.updateTime }}</span>
              </li>
            </ul>
            <el-divider></el-divider>
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
import { mapActions } from "vuex";
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
      selectedNotification: {},
      dialogVisible: false,
      dialogVisible2: false,
      notificationList: [],
      notification: "",
    };
  },
  created() {
    this.getNotification();
  },
  mounted() {
    this.updatecaptcha();
  },
  methods: {
   shouldScroll(title) {
      // Check if the title length exceeds 20 characters
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';

      tempDiv.style.visibility = 'hidden';
      tempDiv.innerHTML = title;
      document.body.appendChild(tempDiv);
      const width = tempDiv.offsetWidth;
      document.body.removeChild(tempDiv);

      // Check if the width exceeds 180px
      return width > 300;
    },
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
        // hour: "2-digit",
        // minute: "2-digit",
        // second: "2-digit",
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
            updateTime: this.convertToBeijingTime(item.updateTime),
          }));

          this.notification = temp;
          console.log("notification", this.notification);
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
                  // document.cookie('uid=1225952')
                  // console.log(document.cookie);
                  this.$router.push("/sideBar");
                  this.$message.success("登录成功");
                } else if (resp.data.userStatus === "2") {
                  this.$message.error("您的账号已被禁用");
                }else {
                  this.$message.error("账号异常，请联系管理员或重新注册");
                }
              }else if(resp.code == "400"){
                this.$message.warning("您的账号待激活，请等待管理员处理");
              }else if(resp.code == "500"){
                this.$message.warning(resp.msg);
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
    moreNotice() {
      this.dialogVisible2 = true;
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
  list-style-type: none;
  margin: 0;
  padding: 0;
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.topContainer {
  flex: 0.4; /* 左侧盒子的放大比例为1 */
  padding: 20px; /* 内边距 */
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: end;
}
.bottomContainer {
  flex: 0.6; /* 右侧盒子的放大比例为2 */
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 30px;
  z-index: 2;
      opacity: 0.9;
}
.notificationDiv {
  border-radius: 15px;
  background-clip: padding-box;
  /* margin: 20px 10px; */
  margin-bottom: 150px;
  width: 700px;
  height: 450px;
  background: white;
  border: 1px solid #eaeaee;
  box-shadow: 0 0 25px #cac6c6;
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-right: 40px;
}
.loginContainer {
  border-radius: 15px;
  background-clip: padding-box;
  /* margin: 20px 10px; */
  margin-bottom: 150px;
  width: 450px;
  height: 450px;
  background: white;
  border: 1px solid #eaeaee;
  box-shadow: 0 0 25px #cac6c6;
  display: flex;
  align-items: center;
}
.myForm {
  padding-left: 30px;
  padding-right: 30px;
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
    top: 565px;
    left: 1000px;
    z-index: 0

}

img.png {
  position: absolute;
  top: 400px;
  left: 720px;;
  z-index: 0
}

.mainRight1 {
  /* position: absolute;
  top: 8px;
  left: 100px; */
  display: flex;
  align-items: center;
  vertical-align: bottom;
}

.mainRight1 h1 {
  display: block;
  color: white;
  font-size: 40px;
  letter-spacing: 4px;
  margin-top: -10px;
}
.mainImg {
  display: flex;
  z-index: 1;
}

.cooperation {
  background-color: white;
  position: absolute;
  bottom: 0px;
  width: 100%;
  height: 150px;
}
.cooperation .text-photo1 .el-col {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
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

.notification_container {
  width: 100%;
  height: 400px;
  overflow: hidden;
  display: flex; /* 使用 Flexbox */
  align-items: center; /* 垂直居中子元素 */
  flex-direction: column;
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
  max-width: 400px;
}
.scroll-on-hover {
  overflow: hidden;
  white-space: nowrap;
}

.scroll-on-hover:hover {
  overflow: visible;
  animation: scroll-text 5s linear infinite;
}

@keyframes scroll-text {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}
/* s */
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
.notification_title {
  height: 50px;
  width: 100%;
  margin-bottom: 40px;
  display: flex;
  justify-content: space-between;
  align-content: center;
  padding-left: 20px;
  padding-right: 20px;
}
.el-divider--horizontal {
  display: block;
  height: 1px;
  width: 100%;
  margin: 18px 0;
}
</style>
