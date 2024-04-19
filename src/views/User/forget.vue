<template>
  <div class="myMain">
    <div class="mainContainer">
      <div class="leftContainer">
        <div class="mainRight">
          <img
            src="http://www.cqupt.edu.cn/dfiles/13011/cqupt/img/favicon_128x128.ico"
            style="height: 100px; width: 100px"
          />
          <h1>人群队列数据特征表征工具软件</h1>
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
        <div class="forgetContainer">
          <el-button
            type="text"
            @click="returnLogin"
            style="
              align-self: flex-start;
              margin-left: 20px;
              color: gray;
              font-size: 15px;
            "
            ><返回</el-button
          >
          <div class="step">
            <el-steps :active="active" align-center>
              <el-step title="输入用户名"></el-step>
              <el-step title="输入安全密保问题"></el-step>
              <el-step title="重置密码"></el-step>
            </el-steps>
          </div>
          <div v-if="active == 1">
            <el-form
              ref="forgetForm1"
              :model="forgetForm1"
              :rules="rules"
              label-position="left"
              style="font-size: 30px; width: 360px"
              label-width="80px"
            >
              <el-form-item prop="username" label="用户名">
                <el-input
                  type="text"
                  auto-complete="false"
                  v-model="forgetForm1.username"
                  placeholder="请输入您的用户名"
                  @change="debouncedCheckUsername"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div v-if="active == 2">
            <el-form
              ref="forgetForm2"
              :model="forgetForm2"
              :rules="rules2"
              label-position="left"
              style="font-size: 15px; width: 360px"
              label-width="80px"
            >
              <div v-for="(item, index) in questions" :key="index">
                <div class="questionClass">问题{{ index + 1 }}:{{ item }}</div>
                <el-form-item
                  :prop="'q' + (index + 1)"
                  :label="'答案' + (index + 1)"
                >
                  <el-input
                    type="text"
                    auto-complete="false"
                    v-model="forgetForm2['q' + (index + 1)]"
                    placeholder="请输入答案"
                  ></el-input>
                </el-form-item>
              </div>
            </el-form>
          </div>
          <div v-if="active == 3">
            <el-form
              ref="forgetForm3"
              :model="forgetForm3"
              :rules="rules3"
              label-position="left"
              style="font-size: 15px; width: 360px"
              label-width="120px"
            >
              <el-form-item prop="password" label="新密码">
                <el-input
                  type="password"
                  auto-complete="false"
                  v-model="forgetForm3.password"
                  placeholder="请输入新密码"
                ></el-input>
              </el-form-item>
              <div style="margin-top:30px;">
                <el-form-item prop="repsw" label="重复新密码" >
                <el-input
                  type="password"
                  auto-complete="false"
                  v-model="forgetForm3.repsw"
                  placeholder="请重复新密码"
                ></el-input>
              </el-form-item>
              </div>
            </el-form>
          </div>
          <div class="buttons">
            <el-button
              style="margin-top: 12px"
              v-if="active > 1"
              @click="before"
              type="primary"
              plain
              >上一步</el-button
            >
            <el-button
              style="margin-top: 12px"
              v-if="active < 3"
              @click="next"
              type="primary"
              >下一步</el-button
            >
            <el-button
              style="margin-top: 12px"
              v-if="active == 3"
              @click="submit"
              type="primary"
              >提交</el-button
            >
          </div>
        </div>
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
import { postRequest, getRequest } from "@/utils/api";
import { mapActions } from "vuex";
import _ from "lodash";
export default {
  name: "forget",

  data() {
     let checkPwd2 = (rule, value, callback) => {
      if (value.trim().length == 0) {
        callback(new Error("请确认密码不能为空"));
      } else if (value != this.forgetForm3.password) {
        callback(new Error("两次密码不一致"));
      } else {
        callback();
      }
    };
    let checkPwd1 = (rule, value, callback) => {
      if (value.trim().length == 0) {
        callback(new Error("请确认密码不能为空"));
      } else {
        // 例如，密码需要至少 8 个字符，包含字母和数字
        if (!/^(?![a-zA-Z]+$)(?!\d+$)(?![^\da-zA-Z\s]+$).{8,}$/.test(value)) {
          callback(
            new Error(
              "密码至少需要8个字符，且包含字母、数字、特殊字符串任意两种"
            )
          );
        } else {
          callback();
        }
      }
    };
    return {
      loading: false,
      checked: true,
      active: 1,
      forgetForm1: [{ username: "" }],
      forgetForm2: [{ q1: "", q2: "", q3: "" }],
      forgetForm3: [{ password: "", repsw: "" }],
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { validator: this.checkUsernameExist, trigger: "manual" },
        ],
      },
      rules2: {
        q1: [{ required: true, message: "请输入答案", trigger: "blur" }],
        q2: [{ required: true, message: "请输入答案", trigger: "blur" }],
        q3: [{ required: true, message: "请输入答案", trigger: "blur" }],
      },
      rules3: {
        password: [{ required: true, message: "请输入密码", trigger: "blur" },
          { validator: checkPwd1, trigger: "blur" },],
        repsw: [ { required: true, message: "请输入密码", trigger: "blur" },
          { validator: checkPwd2, trigger: "blur" }],
      },
      questions: [],
    };
  },
  created() {
    // 创建防抖函数，这里设置了500毫秒的延迟

    this.debouncedCheckUsername = _.debounce(this.validateUsername, 500);
  },
  mounted() {},
  methods: {
    before() {
      if (this.active > 1) this.active--;
    },
    returnLogin() {
      this.$router.push("/");
    },
    next() {
      if (this.active === 1) {
        this.$refs.forgetForm1.validate((valid) => {
          if (valid) {
            getRequest(
              "user/queryQuestions?username=" + this.forgetForm1.username
            ).then((res) => {
              this.questions = res.data;
              console.log("question", this.questions);
            });

            this.active++;
          } else {
            this.$message.error("请检查输入！");
            return false;
          }
        });
      }
      if (this.active === 2) {
        this.$refs.forgetForm2.validate((valid) => {
          if (valid) {
            this.customValidation()
          
          }
        });
      }
     
    },
    customValidation() {
      if (this.active === 2) {
        const params = {
          username: this.forgetForm1.username,
          q1: this.questions[0] + ":" + this.forgetForm2.q1,
          q2: this.questions[1] + ":" + this.forgetForm2.q2,
          q3: this.questions[2] + ":" + this.forgetForm2.q3,
        };
    
        postRequest("user/verify", params).then((res) => {
   
          if (res.code === 200) {
            this.$message.success(`${res.msg}`);
               this.active++;
  
          } else {
            this.$message.error(`${res.msg}`);
  
          }
        });
      }
    },
    validateUsername() {
      // 手动触发校验
      if (this.active === 1) {
        this.$refs.forgetForm1.validateField("username");
      }
    },
    checkUsernameExist(rule, value, callback) {
      if (!value) {
        return callback();
      }
      getRequest("user/querUserNameExist?userName=" + value).then((res) => {
        console.log("res", res);
        if (res.code == 200) {
          callback(new Error("用户名未注册，请确认输入的是否正确"));
        } else {
          callback();
        }
      });
    },
    submit(){
       if(this.active===3){
         this.$refs.forgetForm3.validate((valid) => {
           if(valid){
             const params={
               username:this.forgetForm1.username,
               password:this.forgetForm3.password
             }
             postRequest('user/updatePwd',params).then((res)=>{
               console.log('res',res)
               if(res){
               if(res.code===200){
                   this.$message.success("密码修改成功");
                  this.returnLogin()
               }
               else{
                 this.$message.error("密码修改失败！");
               }
               }else{
                 this.$message.error("服务器发生错误，请稍后再试");
               }
             })
           }
         });
      }
    }
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
.forgetContainer {
  border-radius: 15px;
  background-clip: padding-box;
  /* margin: 20px 10px; */
  margin-bottom: 150px;
  width: 500px;
  height: 450px;
  background: white;
  border: 1px solid #eaeaee;
  box-shadow: 0 0 25px #cac6c6;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
}
/* .step{
  width:70%;
  display: flex;
} */

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
.buttons {
  display: flex;
  margin-bottom: 10px;
}
.collapse {
  overflow: auto;
  flex: 0.75;
  width: 100%;
}

.questionClass {
  margin-bottom: 10px;
}
</style>
