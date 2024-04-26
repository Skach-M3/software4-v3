<template>
  <div class="Box">
    <!-- 以下为V2.0 -->
    <div class="content">
      <div class="specify">
        <p>特征下方进度条为特征完备率</p>
      </div>

      <!-- 选择参与运算的特征(因变量) -->
      <div class="select_feature_var">
        <div class="select_feature_var_top">
          <h3 class="title">选择参与运算的特征(因变量)</h3>
          <div class="searchButton">
            <el-input
              style="width: 200px"
              v-model="feature_input"
              placeholder="请输入搜索特征名称"
              clearable
            ></el-input>
            <el-button
              icon="el-icon-search"
              circle
              size="mini"
              style="margin-left: 1%"
              type="success"
              @click="search_feature"
            ></el-button>
            <el-button
              icon="el-icon-delete"
              circle
              size="mini"
              style="margin-left: 1%"
              type="info"
              @click="clear_feature"
            ></el-button>
          </div>
        </div>
        <div class="select_feature_check_boxs">
          <el-skeleton :row="6" animated :loading="all_features.length < 1" />
          <el-checkbox-group v-model="checked_dependent_variables">
            <div v-for="item in show_features" :key="item.id">
              <el-checkbox
                :label="item"
                @change="dependent_variables_groupCheck(item)"
                >{{ item.label }}
              </el-checkbox>
              <el-progress
                :percentage="item.fill_rate"
                :color="changeProgressColor(item.fill_rate)"
              ></el-progress>
            </div>
          </el-checkbox-group>
        </div>
        <el-pagination
          @current-change="currentPageChange()"
          :current-page.sync="currentPage"
          :page-size.sync="pageSize"
          layout="total, prev, pager, next"
          :total="dataTotal"
          style="margin-left: 5%; margin-top: 20px"
          :hide-on-single-page="true"
        >
        </el-pagination>
      </div>

      <!--  选择参与运算的疾病(自变量)-->
      <div class="select_feature_var">
        <div class="select_feature_var_top">
          <h3 class="title">选择参与运算的疾病(自变量)</h3>
        </div>
        <div class="select_feature_check_boxs">
          <el-skeleton :row="6" animated :loading="label_list.length < 1" />
          <el-checkbox-group v-model="checked_independent_variables">
            <div v-for="item in show_labels" :key="item.id">
              <el-checkbox
                :label="item"
                @change="item.status = item.status == 2 ? 0 : 2"
                >{{ item.label }}
              </el-checkbox>
              <el-progress
                :percentage="item.fill_rate"
                :color="changeProgressColor(item.fill_rate)"
              ></el-progress>
            </div>
          </el-checkbox-group>
        </div>
        <el-pagination
          @current-change="currentPageChange()"
          :current-page.sync="currentPage"
          :page-size.sync="pageSize"
          layout="total, prev, pager, next"
          :total="dataTotal"
          style="margin-left: 5%; margin-top: 20px"
          :hide-on-single-page="true"
        >
        </el-pagination>
      </div>

      <!--  已选特征-->
      <div class="select_feature_var">
        <div class="select_feature_var_top">
          <h3 class="title">已选特征</h3>
        </div>
        <div class="select_feature_check_boxs">
          <el-checkbox-group v-model="checked_dependent_variables">
            <div v-for="item in checked_dependent_variables" :key="item.id">
              <el-checkbox :label="item" @change="item.status = 0"
                >{{ item.label }}
              </el-checkbox>
              <el-progress
                :percentage="item.fill_rate"
                :color="changeProgressColor(item.fill_rate)"
              ></el-progress>
            </div>
          </el-checkbox-group>
        </div>
        <el-pagination
          @current-change="currentPageChange()"
          :current-page.sync="currentPage"
          :page-size.sync="pageSize"
          layout="total, prev, pager, next"
          :total="dataTotal"
          style="margin-left: 5%; margin-top: 20px"
          :hide-on-single-page="true"
        >
        </el-pagination>
      </div>

      <!-- 已选疾病 -->
      <div class="select_feature_var">
        <div class="select_feature_var_top">
          <h3 class="title">已选疾病</h3>
        </div>
        <div class="select_feature_check_boxs">
          <el-checkbox-group v-model="checked_independent_variables">
            <div v-for="item in checked_independent_variables" :key="item.id">
              <el-checkbox :label="item" @change="item.status = 0"
                >{{ item.label }}
              </el-checkbox>
              <el-progress
                :percentage="item.fill_rate"
                :color="changeProgressColor(item.fill_rate)"
              ></el-progress>
            </div>
          </el-checkbox-group>
        </div>
        <el-pagination
          @current-change="currentPageChange()"
          :current-page.sync="currentPage"
          :page-size.sync="pageSize"
          layout="total, prev, pager, next"
          :total="dataTotal"
          style="margin-left: 5%; margin-top: 20px"
          :hide-on-single-page="true"
        >
        </el-pagination>
      </div>

      <!-- 已知危险因素 -->
      <div class="select_feature_var">
        <div class="select_feature_var_top knowFeatures">
          <h3 class="title">已知相关疾病</h3>
          <el-popover
            placement="top-start"
            title="标题"
            trigger="hover"
            content="这是医学专家已经查明的疾病危险因素"
          >
            <i
              class="el-icon-question"
              style="margin-left: 10px"
              slot="reference"
            ></i>
          </el-popover>
        </div>
        <div class="select_feature_check_boxs">
          <el-skeleton :row="6" animated :loading="all_features.length < 1" />
          <el-checkbox-group v-model="know_variables">
            <div v-for="item in all_features" :key="item.index">
              <el-checkbox :label="item">{{ item.label }} </el-checkbox>
            </div>
          </el-checkbox-group>
        </div>
        <el-pagination
          @current-change="currentPageChange()"
          :current-page.sync="currentPage"
          :page-size.sync="pageSize"
          layout="total, prev, pager, next"
          :total="dataTotal"
          style="margin-left: 5%; margin-top: 20px"
          :hide-on-single-page="true"
        >
        </el-pagination>
      </div>
      <div class="buttonGroup">
        <el-button @click="backStep()" round>上一步</el-button>
        <el-button type="warning" @click="resetButton" round
          >重置选项</el-button
        >
        <el-button type="primary" @click="next()" round>确认</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getRequest } from "@/api/user.js";
import vuex_mixin from "@/components/mixins/vuex_mixin";
export default {
  name: "FeatureSelect",
  props: {
    moduleName: {
      type: String,
      default: "disFactor",
    },
  },
  mixins: [vuex_mixin],
  computed: {},
  data() {
    return {
      computeFeatures: [],
      knownFeatures: [],
      targetFeature: [],
      //用于存储左侧特征选择树值
      featureSelectTree: [],
      //特征选择数的备份，用于删除叶子节点
      filteredTree: [],
      //用于存储所有特征
      all_features: [],
      // 用于存储所有标签
      label_list: [],
      show_features: [],
      show_labels: [],
      //用于存储已选的因变量（已选标签特征）
      checked_dependent_variables: [],
      //用于存储已选的因变量（已选危险因素）
      checked_independent_variables: [],
      know_variables: [],
      //分页数据
      pageSize: 10,
      currentPage: 1,
      dataTotal: 10,
      value: "",
      feature_input: "",
    };
  },

  created() {
    this.init();
  },

  methods: {
    init() {
      if (this.m_is_common == false) {
        getRequest(`api/feature/getTreeFeatures?tablename=${this.m_dataset}`, {
          tableName: this.m_dataset,
        }).then((res) => {
          if (res.code == 200) {
            this.featureSelectTree = res.data;
            //获取dependent_variables
            this.featureSelectTree.forEach((root) => {
              this.extractLeafNodes(root);
            });
          }
          // 同步vuex里的数据
          this.checked_independent_variables = this.m_use_features;
          this.know_variables = this.m_known_features;

          if (this.moduleName !== "disFactor") {
            this.checked_dependent_variables = this.m_target_feature;
            // this.changeBox_target();
          }
        });
      } else {
        getRequest(
          `/api/feature/getCommonMutipleTableTreeFeatures?tablename=${this.m_dataset}`
        ).then((res) => {
          if (res.code == 200) {
            for (let i = 0; i < res.data.length; i++) {
              if (res.data[i].is_label == "0") {
                this.all_features.push({
                  label: res.data[i].field_name,
                  fill_rate: res.data[i].fill_rate,
                  id: i,
                });
              } else {
                this.label_list.push({
                  label: res.data[i].field_name,
                  fill_rate: res.data[i].fill_rate,
                  id: i,
                });
              }
            }
            // 赋值给展示用数组
            this.show_features = this.all_features;
            this.show_labels = this.label_list;

            //获取dependent_variables
            this.featureSelectTree.forEach((root) => {
              this.extractLeafNodes(root);
            });
          }
          // 同步vuex里的数据
          this.checked_independent_variables = this.m_use_features;
          this.know_variables = this.m_known_features;
          if (this.moduleName !== "disFactor") {
            this.checked_dependent_variables = this.m_target_feature;
            // this.changeBox_target();
          }
        });
      }
    },

    next() {
      console.log(this.checked_dependent_variables);
      this.checked_dependent_variables.forEach((item) => {
        this.targetFeature.push(item.label);
      });

      this.checked_independent_variables.forEach((item) => {
        this.computeFeatures.push(item.label);
      });

      this.know_variables.forEach((item) => {
        this.knownFeatures.push(item.label);
      });

      if (this.checked_independent_variables.length < 2) {
        this.$message({
          type: "warning",
          message: "请选择至少2个自变量参与运算",
        });
        return;
      }
      this.m_changeTaskInfo({
        caculate_use_features: this.computeFeatures,
        caculate_known_features: this.knownFeatures,
        caculate_target_feature: this.targetFeature,
      });
      this.m_changeStep(this.m_step + 1);
    },

    backStep() {
      this.m_changeStep(this.m_step - 1);
    },

    //获得dependent_variables
    extractLeafNodes(tree) {
      if (tree.children) {
        tree.children.forEach((child) => {
          this.extractLeafNodes(child);
        });
      } else {
        // 叶子节点
        // this.dependent_variables.push(tree);
        // this.independent_variables.push(tree);
        this.all_features.push(tree);
      }
    },

    changeProgressColor(rate) {
      if (rate < 30) {
        return "RGB(230,162,60)";
      } else if (rate < 60) {
        return "RGB(245,108,108)";
      } else if (rate < 90) {
        return "RGB(64,158,255)";
      } else {
        return "RGB(103,194,58)";
      }
    },
    //分页函数
    currentPageChange() {},
    filterNonLeafNodes(tree) {
      if (tree.children) {
        // 过滤掉没有子节点的非叶子节点
        tree.children = tree.children.filter((child) => child.children);

        // 递归处理子节点
        tree.children.forEach((child) => {
          this.filterNonLeafNodes(child);
        });
      }
    },
    getCheckedNodes() {
      //获得所有选中的节点
      const checkeList = this.$refs.tree.getCheckedNodes();
      console.log(checkeList);
      //如果没有节点选中，则让all_features恢复所有值
      if (checkeList.length === 0) {
        this.all_features = [];
        this.featureSelectTree.forEach((root) => {
          this.extractLeafNodes(root);
        });
      }
      //或者过滤
      else {
        this.all_features = checkeList.filter((node) => node.isLeaf === true);
      }
    },
    resetButton() {
      for (let i = 0; i < this.checked_dependent_variables.length; i++) {
        this.checked_dependent_variables[i].status = 0;
      }
      for (let i = 0; i < this.checked_independent_variables.length; i++) {
        this.checked_independent_variables[i].status = 0;
      }
      this.checked_dependent_variables = [];
      this.checked_independent_variables = [];
      this.know_variables = [];
    },
    isEqual(obj1, obj2) {
      if (obj1.name === obj2.name && obj1.status === obj2.status) {
        return true;
      } else {
        return false;
      }
    },
    dependent_variables_groupCheck(item) {
      if (this.moduleName == "disFactor") {
        for (const obj1 of this.checked_dependent_variables) {
          for (const obj2 of this.all_features) {
            if (this.isEqual(obj1, obj2)) {
              obj2.status = 0;
            }
          }
        }
        item.status = item.status == 1 ? 0 : 1;
        this.checked_dependent_variables = [];
        if (item.status === 1) {
          this.checked_dependent_variables.push(item);
        }
      } else {
        item.status = item.status == 1 ? 0 : 1;
      }
    },
    search_feature() {
      console.log(this.feature_input);
      const filterFeature = this.all_features.filter((feature) =>
        feature.label.toLowerCase().includes(this.feature_input.toLowerCase())
      );
      this.show_features = filterFeature;
    },
    clear_feature() {
      this.feature_input = "";
      this.show_features = this.all_features;
    },
  },
};
</script>

<style scoped>
.featureTitle {
  font-size: 30px;
  margin-right: 30px;
  margin-bottom: 20px;
}

.featureSubTitle {
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 18px;
}

.el-checkbox--small {
  padding-bottom: 10px;
}

.el-checkbox-group {
  padding-top: 10px;
  display: grid;
  grid-template-columns: repeat(8, 150px);
  grid-gap: 20px;
  grid-template-rows: 20px, 20px;
}

/* 使用popover以后省略号就没用了 */
.el-checkbox-group >>> .el-checkbox__label {
  /* padding-top: 5px; */
  line-height: 16px;
  vertical-align: text-bottom;
  width: 90px;
  overflow: hidden;
  white-space: nowrap; /* 防止文本换行 */
  text-overflow: ellipsis; /* 显示省略号 */
}

.el-checkbox-group >>> .el-checkbox__label:hover {
  overflow: visible;
}

.select_feature_check_boxs {
  width: 100%;
  height: auto;
  margin-left: 5%;
}

/* .lineStyle {
  color: rgb(100, 172, 231);
  font-weight: 100;
  font-size: 25px;
} */

.buttonGroup {
  margin-top: 20px;
  margin-left: 28%;
}

.content {
  width: 95%;
  height: auto;
}

.left_tree {
  display: inline-block;
  height: auto;
  width: 13%;
  border-radius: 3px;
}

.specify {
  margin-top: 1px;
  width: 100%;
  height: 5%;
  text-align: center;
  line-height: 35px;
  background-color: #e6e6e6;
}

.select_feature_var {
  margin-top: 1px;
  width: 100%;
  height: auto;
}

.select_feature_var_top {
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
}

.knowFeatures {
  width: 100%;
  display: block;
}

.searchButton {
  position: absolute;
  right: 100px;
  width: 300px;
}

.title {
  display: inline-block;
  margin-left: 3%;
}

.selection {
  margin-left: 2%;
  position: relative;
  bottom: 5px;
}
</style>
