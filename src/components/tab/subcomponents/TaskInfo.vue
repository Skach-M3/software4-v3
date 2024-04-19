<template>
  <div id="mainBox">
    <el-form
      ref="taskInfoForm"
      :model="taskInfoForm"
      label-width="100px"
      class="form"
      label-position="top"
    >
      <el-form-item prop="taskName" class="inputBox shortItem">
        <template slot="label">
          <span class="lineStyle">▍</span>
          <span>任务名称</span>
        </template>
        <el-input v-model="taskInfoForm.taskName"></el-input>
      </el-form-item>
      <el-form-item prop="principal" class="inputBox shortItem">
        <template slot="label">
          <span class="lineStyle">▍</span>
          <span>任务负责人</span>
        </template>
        <el-input v-model="taskInfoForm.principal" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item prop="participants" class="inputBox shortItem">
        <template slot="label">
          <span class="lineStyle">▍</span>
          <span>参与人员</span>
        </template>
        <el-input v-model="taskInfoForm.participants"></el-input>
      </el-form-item>
      <el-form-item prop="tips">
        <template slot="label">
          <span class="lineStyle">▍</span>
          <span>备注</span>
        </template>
        <el-input
          type="textarea"
          :autosize="{ minRows: 10, maxRows: 10 }"
          maxlength="200"
          show-word-limit
          placeholder="请输入内容"
          v-model="taskInfoForm.tips"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="resetForm('taskInfoForm')" round>重置</el-button>
        <el-button type="primary" @click="next()" round>下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { resetForm } from "@/components/mixins/mixin.js";
import vuex_mixin from "@/components/mixins/vuex_mixin";
import { mapMutations } from "vuex";
export default {
  name: "TaskInfo",
  mixins: [resetForm, vuex_mixin],
  props: {
    moduleName: {
      type: String,
      default: "disFactor",
    },
  },
  watch: {},
  computed: {},
  data() {
    return {
      taskInfoForm: {
        taskName: "",
        principal: "",
        participants: "",
        // disease: "",
        tips: "",
      },
    };
  },

  // TODO:初始化两遍，还可把数据放到localStorage里解决这个问题
  created() {
    this.init();
    // this.$watch("m_dataDisList", () => {
    //   this.init();
    //   this.$message({
    //     message: "数据更新成功",
    //     type: "success",
    //   });
    // });
  },

  methods: {
    ...mapMutations("disFactor", ["ChangeStep", "ChangeTaskInfo"]),
    init() {
      //和vuex内数据同步
      console.log("当前模块名👉", this.moduleName);
      this.taskInfoForm.taskName = this.m_taskName;
      this.taskInfoForm.principal = sessionStorage.getItem("username");
      this.taskInfoForm.participants = this.m_participants;
      // this.taskInfoForm.disease = this.m_disease;
      this.taskInfoForm.tips = this.m_tips;
    },

    next() {
      if (
        this.taskInfoForm.taskName.length < 1 ||
        this.taskInfoForm.principal.length < 1
      ) {
        this.$message("请填写任务名称和负责人");
        return;
      }
      this.m_changeTaskInfo(this.taskInfoForm);
      this.m_changeStep(2);
    },
  },
};
</script>

<style scoped>
/* #mainBox{
  overflow: auto;
} */
.form {
  width: 80vh;
  margin: auto;
}
.form .inputBox {
  width: 25%;
}
.form .shortItem {
  display: inline-block;
  margin-right: 12vh;
}
.form .inputBox:last-child {
  width: 50%;
}

.lineStyle {
  color: rgb(100, 172, 231);
}

#disGroup {
  width: 70%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}
.disGroup-item {
  width: 180px;
  margin-bottom: 10px;
}
</style>
