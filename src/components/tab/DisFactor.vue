<template>
  <div>
    <el-container>
      <el-header>
        <div id="step">
          <el-steps :active="step" align-center>
            <el-step title="任务信息" icon="el-icon-guide"></el-step>
            <el-step title="选择数据" icon="el-icon-edit"></el-step>
            <el-step title="特征选择" icon="el-icon-edit"></el-step>
            <el-step title="算法选择" icon="el-icon-edit"></el-step>
            <el-step title="运算结果" icon="el-icon-view"></el-step>
          </el-steps>
        </div>
      </el-header>

      <el-divider></el-divider>

      <el-main v-if="step == 1" class="mainBox">
        <TaskInfoVue :moduleName="moduleName"></TaskInfoVue>
      </el-main>

      <el-main v-if="step == 2" class="mainBox">
        <DataSelectVue :moduleName="moduleName"></DataSelectVue>
      </el-main>

      <el-main v-if="step == 3" class="mainBox">
        <FeatureSelectVue :moduleName="moduleName"></FeatureSelectVue>
      </el-main>

      <el-main v-if="step == 4" class="mainBox">
        <AlgorithmSelectVue :moduleName="moduleName"></AlgorithmSelectVue>
      </el-main>

      <el-main v-if="step == 5" class="mainBox">
        <ResultVue :moduleName="moduleName"></ResultVue>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { mapState } from "vuex";
import AlgorithmSelectVue from "./subcomponents/AlgorithmSelect.vue";
import DataSelectVue from "./subcomponents/DataSelect.vue";
import FeatureSelectVue from "./subcomponents/FeatureSelect.vue";
import ResultVue from "./subcomponents/Result.vue";
import TaskInfoVue from "./subcomponents/TaskInfo.vue";
export default {
  name: "DisFactor",
  components: {
    TaskInfoVue,
    DataSelectVue,
    FeatureSelectVue,
    AlgorithmSelectVue,
    ResultVue,
  },
  computed: {
    ...mapState("disFactor", ["step"]),
  },
  data() {
    return {
      moduleName: "disFactor",
    };
  },

  methods: {},
};
</script>

<style scoped></style>
