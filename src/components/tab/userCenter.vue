<template>
<div >
  <div style="display: flex; justify-content: center; align-items: center; height: calc(100vh - 150px);">
   <el-card style="width: 40%;">
     <h3 style="text-align: center;margin-bottom: 20px;font-weight: bolder;">用户个人信息</h3>
     <el-form ref="form" :model="form" label-width="150px" style="width: 60%;font-size: 15px" :rules="rules">
       <el-form-item label="用户名:" prop="username" >
         <el-input  v-model="form.username" disabled></el-input>
       </el-form-item>
       <el-form-item label="角色:" >
         <el-input v-model="form.role" disabled></el-input>
       </el-form-item>
       <el-form-item label="创建时间:">
         <el-input  v-model="form.createTime" disabled></el-input>
       </el-form-item>
       <el-form-item label="密保问题1:" prop="answer_1">
         <el-input v-model="form.question1" disabled></el-input>
       </el-form-item>
       <el-form-item label="密保答案1:" prop="answer_1">
         <el-input v-model="form.answer_1" ></el-input>
       </el-form-item>
       <el-form-item label="密保问题2:" prop="answer_1">
         <el-input v-model="form.question2" disabled></el-input>
       </el-form-item>
       <el-form-item label="密保答案2:" prop="answer_2">
         <el-input v-model="form.answer_2"></el-input>
       </el-form-item>
       <el-form-item label="密保问题3:" prop="answer_1">
         <el-input v-model="form.question3" disabled></el-input>
       </el-form-item>
       <el-form-item label="密保答案3:" prop="answer_3">
         <el-input v-model="form.answer_3"></el-input>
       </el-form-item>
       <el-form-item v-if="form.role === '普通用户'" label="剩余上传文件容量:">
         <el-input  v-model="form.uploadSize" disabled></el-input>
       </el-form-item>
       <el-form-item>
         <el-button type="primary" @click="submitForm">保存</el-button>
       </el-form-item>
     </el-form>

   </el-card>
 </div>
</div>
</template>

<script >
import {getRequest, postRequest} from "@/utils/api";


export default {
  name:"userCenter",
  data(){
    return{
      form:{
        username:'',
        role:'',
        createTime:'',
        answer_1:'',
        answer_2:'',
        answer_3:'',
        question1:'',
        question2:'',
        question3:'',
        uploadSize:'',
        uid: sessionStorage.getItem("userid")
            ? sessionStorage.getItem("userid")
            : "",
      },
      rules:{
        username: [
          { required: true },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ],
        answer_1:[
          { required: true },
          {min:1, max:20, message: '长度在 1到 20 个字符', trigger: 'blur'}
        ],
        answer_2:[
          { required: true },
          {min:1, max:20, message: '长度在 1到 20 个字符', trigger: 'blur'}
        ],
        answer_3:[
          { required: true },
          {min:1, max:20, message: '长度在 1到 20 个字符', trigger: 'blur'}
        ]
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
    }
  },
  created() {
    this.getUserDetail()
  },
  computed:{
    loginUserID() {
      return sessionStorage.getItem("userid");
    },
  },
  methods:{
    getUserDetail(){
      getRequest(`/user/getmessage/${this.loginUserID}`).then(res => {
        if(res.code === 200){
          console.log(res)
          let data = res.data
          this.form.username = data.username
          if(data.role === 0){
            this.form.role = "管理员"
          }else if(data.role === 1){
            this.form.role = "普通用户"
          }
          console.log(data)
          const inputDateTime  = data.createTime
          const datePart = inputDateTime.split("T")[0];
          this.form.createTime = datePart
          this.form.question1 = data.answer_1.split(":")[0]
          this.form.question2 = data.answer_2.split(":")[0]
          this.form.question3 = data.answer_3.split(":")[0]
          this.form.answer_1 = data.answer_1.split(":")[1]
          this.form.answer_2 = data.answer_2.split(":")[1]
          this.form.answer_3 = data.answer_3.split(":")[1]
          this.form.uploadSize = data.uploadSize
        }
      })
    },
    checkRepetition(){
        getRequest(`user/checkRepetition/${this.form.username}`).then(res=>{
          if(res.code === 200){
            if(res.msg === "用户名已存在"){
              this.$message.error("用户名已存在，请重新输入")
              this.getUserDetail()
            }else {
              return;
            }
          }
        })
    },
    submitForm(){
      const form = {
        username:'',
        answer_1:'',
        answer_2:'',
        answer_3:'',
        uid: sessionStorage.getItem("userid")
            ? sessionStorage.getItem("userid")
            : "",
      }
      if(this.form.role === '管理员'){
        this.form.role = 0
      }else if(this.form.role ==='普通用户'){
        this.form.role = 1
      }
      form.username = this.form.username
      form.answer_1 =`${this.form.question1}:${this.form.answer_1 }`
      form.answer_2 = `${this.form.question2}:${this.form.answer_2 }`
      form.answer_3 = `${this.form.question3}:${this.form.answer_3 }`
      postRequest('/user/updateUser',form).then(res => {
        if(res.code === 200){
          window.sessionStorage.setItem("user", this.form.username);
          this.getUserDetail()
          this.$message.success("修改成功")
          // setTimeout(function() {
          //   location.reload();
          // }, 100);
          this.$router.push("/dash")
        }else {
          this.$message.error("修改失败")
        }
      })
      
    }
  }
}
</script>

<style scoped>

</style>