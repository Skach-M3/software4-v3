<template>
  <div>
    <div class="myMain">
      <div class="mainContainer">
        <div class="leftContainer">
          <div class="mainRight">
            <img
              src="http://www.cqupt.edu.cn/dfiles/13011/cqupt/img/favicon_128x128.ico"
              style="height: 100px; width: 100px"
            />
            <h1>疾病危险因素与多病种关联关系</h1>
            <h1>挖掘工具软件</h1>
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
          <div class="registerContainer">
            <el-button
              type="text"
              @click="returnLogin"
              style="
                align-self: flex-start;
                margin-left: 20px;
                color: gray;
                font-size: 15px;
              "
              >←返回</el-button
            >
            <div class="myForm">
              <el-form
                element-loading-text="正在注册..."
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                ref="registerForm"
                :model="registerForm"
                :rules="rules"
                style="font-size: 30px"
                label-width="120px"
              >
                <h3 class="registerTitle">系统注册</h3>
                <el-form-item prop="username" label="用户名">
                  <el-input
                    type="text"
                    auto-complete="false"
                    v-model="registerForm.username"
                    placeholder="请输入用户名"
                    @change="debouncedCheckUsername"
                  ></el-input>
                </el-form-item>
                <el-form-item prop="password" label="密码">
                  <el-input
                    type="password"
                    auto-complete="false"
                    v-model="registerForm.password"
                    placeholder="要求:8个字符以上且包含字母、数字、特殊字符任两种"
                  ></el-input>
                </el-form-item>
                <el-form-item prop="repPassword" label="重复密码">
                  <el-input
                    type="password"
                    auto-complete="false"
                    v-model="registerForm.repPassword"
                    placeholder="请重复输入密码"
                  ></el-input>
                </el-form-item>
                <!-- <el-form-item prop="question1" label="安全密保问题一">
                  <el-select
                    v-model="registerForm.question1"
                    placeholder="请选择第一个安全密保问题"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in questionOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.label"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item prop="answer_1" label="安全密保答案一">
                  <el-input
                    type="text"
                    auto-complete="false"
                    v-model="registerForm.answer_1"
                    placeholder="请输入问题一的答案"
                  ></el-input>
                </el-form-item>
                <el-form-item prop="question2" label="安全密保问题二">
                  <el-select
                    v-model="registerForm.question2"
                    placeholder="请选择第二个安全密保问题"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in questionOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.label"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item prop="answer_2" label="安全密保答案一">
                  <el-input
                    type="text"
                    auto-complete="false"
                    v-model="registerForm.answer_2"
                    placeholder="请输入问题二的答案"
                  ></el-input>
                </el-form-item>
                <el-form-item prop="question3" label="安全密保问题三">
                  <el-select
                    v-model="registerForm.question3"
                    placeholder="请选择第三个安全密保问题"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in questionOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.label"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item prop="answer_3" label="安全密保答案三">
                  <el-input
                    type="text"
                    auto-complete="false"
                    v-model="registerForm.answer_3"
                    placeholder="请输入问题三的答案"
                  ></el-input>
                </el-form-item> -->
                <div v-for="n in 3" :key="n">
                  <el-form-item
                    :label="`安全密保问题${n}`"
                    :prop="`question${n}`"
                  >
                    <el-select
                      v-model="registerForm['question' + n]"
                      :placeholder="`请选择第${n}个安全密保问题`"
                      style="width: 100%"
                     @change="() => handleSelectChange(n)"
                    >
                      <el-option
                        v-for="item in availableQuestions(n)"
                        :key="item.value"
                        :label="item.label"
                        :value="item.label"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    :label="`安全密保答案${n}`"
                    :prop="`answer_${n}`"
                  >
                    <el-input
                      type="text"
                      auto-complete="false"
                      v-model="registerForm['answer_' + n]"
                      :placeholder="`请输入问题${n}的答案`"
                    ></el-input>
                  </el-form-item>
                </div>
                <el-button
                  type="primary"
                  style="width: 100%"
                  @click="subitRegister"
                  >提交</el-button
                >
              </el-form>
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
  </div>
</template>

<script>
import { postRequest, getRequest } from "@/utils/api";
import _ from "lodash";
export default {
  name: "Login",
  data() {
    let checkPwd2 = (rule, value, callback) => {
      if (value.trim().length == 0) {
        callback(new Error("请确认密码不能为空"));
      } else if (value != this.registerForm.password) {
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
      registerForm: {
        username: "",
        password: "",
        repPassword: "",
        question1: "",
        question2: "",
        question3: "",
        answer_1: "",
        answer_2: "",
        answer_3: "",
      },
      loading: false,
      checked: true,

      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { validator: this.checkUsernameExist, trigger: "manual" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { validator: checkPwd1, trigger: "blur" },
        ],
        repPassword: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { validator: checkPwd2, trigger: "blur" },
        ],
        question1: [{ required: true, message: "请选择问题", trigger: "blur" }],
        question2: [{ required: true, message: "请选择问题", trigger: "blur" }],
        question3: [{ required: true, message: "请选择问题", trigger: "blur" }],
        answer_1: [{ required: true, message: "请输入答案", trigger: "blur" }],
        answer_2: [{ required: true, message: "请输入答案", trigger: "blur" }],
        answer_3: [{ required: true, message: "请输入答案", trigger: "blur" }],
      },
      questionOptions: [
        {
          value: "1",
          label: "您母亲的姓名是？",
        },
        {
          value: "2",
          label: "您父亲的姓名是？",
        },
        {
          value: "3",
          label: "您小学班主任的姓名是？",
        },
        {
          value: "4",
          label: "您配偶的生日是？",
        },
        {
          value: "5",
          label: "您出生在哪个城市？",
        },
      ],
    };
  },
  created() {
    // 创建防抖函数，这里设置了500毫秒的延迟
    this.debouncedCheckUsername = _.debounce(this.validateUsername, 500);
  },
  methods: {
    returnLogin() {
      this.$router.push("/");
    },
    validateUsername() {
      // 手动触发校验
      this.$refs.registerForm.validateField("username");
    },
 handleSelectChange(n) {
  this.$nextTick(() => {
    this.$refs.registerForm.validateField(`question${n}`);
  });
},
    checkUsernameExist(rule, value, callback) {
      if (!value) {
        return callback();
      }
      getRequest("user/querUserNameExist?userName=" + value).then((res) => {
        console.log("res", res);
        if (res.code == 500) {
          callback(new Error("用户名已经存在"));
        } else {
          callback();
        }
      });
      // .catch(() => {
      //   callback(new Error("验证用户名时发生错误"));
      // });
    },
    // checkUsernameFromBackend(username) {
    //   getRequest("user/querUserNameExist?userName=" + username).then((res) => {
    //     console.log("res", res);
    //     return res;
    //   });
    // },
    availableQuestions(index) {
      // 返回未被当前选择以外的其他输入选中的问题
      const selected = [
        this.registerForm.question1,
        this.registerForm.question2,
        this.registerForm.question3,
      ];
      return this.questionOptions.filter(
        (option) =>
          !selected.includes(option.label) ||
          this.registerForm["question" + index] === option.label
      );
    },
    subitRegister() {
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          const params = {
            username: this.registerForm.username,
            password: this.registerForm.password,
            answer_1:
              this.registerForm.question1 + ":" + this.registerForm.answer_1,
            answer_2:
              this.registerForm.question2 + ":" + this.registerForm.answer_2,
            answer_3:
              this.registerForm.question3 + ":" + this.registerForm.answer_3,
            role: 1,
            userStatus: 0,
          };
          console.log("params", params);
          postRequest("/user/signUp", params).then((resp) => {
            if (resp) {
              this.loading = false;
              console.log(resp);
              if (resp.code == "200") {
                this.$message.success("注册成功！");
                this.$router.replace("/");
              }
              if (resp.code == "500") {
                this.$message.error(`${resp.message}`);
              }
              //   const tokenStr = resp.obj.tokenHead + resp.obj.token;
              //   window.sessionStorage.setItem("tokenStr", tokenStr);

              //   postRequest("/getrole", this.loginForm.id).then((resp) => {
              //     if (resp[0].nameZh === "管理员") {
              //       this.$router.replace("/portal");
              //     } else {
              //       this.$router.replace("/home");
              //     }
              //   });
            }
          });
        } else {
          this.$message.error("请输入所有字段");
          return false;
        }
      });
    },
  },
};
</script>

<style>
* {
  box-sizing: border-box;
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
.registerContainer {
  border-radius: 15px;
  background-clip: padding-box;
  /* margin: 20px 10px; */
  margin-bottom: 80px;
  width: 550px;
  height: 750px;
  background: white;
  border: 1px solid #eaeaee;
  box-shadow: 0 0 25px #cac6c6;
  display: flex;
  align-items: center;
  flex-direction: column;
}
.myForm {
  padding-left: 30px;
  padding-right: 30px;
  width: 100%;
}
.registerTitle {
  margin: 0px auto 40px auto;
  text-align: center;
}

.el-form-item__content {
  display: flex;
  align-items: center;
}

.text-photo1 .el-col img{
  margin-left: 25%;
}

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
  top: -150px;
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
</style>  