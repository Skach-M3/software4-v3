<template>
  <div class="Box">
    <!-- 以下为V2.0 -->
    <div class="content">
      <div class="left_tree">
        <div class="tipInfo">
          <div>字段分类:</div>
          <span>(点击类别进行字段筛选)</span>
          <!-- <div class="statistic">当前共有 {{diseaseNum}} 个总病种，{{datasetNum}} 个数据表</div> -->
        </div>
        <el-skeleton animated :loading="featureSelectTree.length < 1" />
        <el-tree
          v-if="featureSelectTree.length > 0"
          :data="featureSelectTree"
          show-checkbox
          node-key="id"
          ref="tree"
          highlight-current
          @check="getCheckedNodes"
          default-expend-keys="[1]"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span v-if="!data.isLeaf">{{ node.label }}</span>
            <span v-if="!data.isLeaf"> ({{ data.children.length }})</span>
            <span v-else>{{ node.label }}</span>
          </span>
        </el-tree>
      </div>
      <div class="right_table">
        <div class="specify">
          <p>特征下方进度条为特征填充度</p>
        </div>

        <!-- 选择作为标签的特征(因变量) -->
        <div class="select_feature_var" v-if="this.moduleName == 'f_Factor'">
          <div class="select_feature_var_top">
            <h3 class="title">选择作为标签的特征(因变量)</h3>
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
            <el-skeleton
              :row="6"
              animated
              :loading="featureSelectTree.length < 1"
            />
            <el-checkbox-group v-model="checked_dependent_variables">
              <div
                class="checkItem"
                v-for="item in all_features"
                :key="item.id"
                v-show="item.status == 0 || item.status == 1"
              >
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

        <!-- 如果要做单选框 -->
        <div class="select_feature_var" v-else>
          <div class="select_feature_var_top">
            <h3 class="title">选择作为标签的特征(因变量)</h3>
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
            <el-skeleton
              :row="6"
              animated
              :loading="featureSelectTree.length < 1"
            />
            <el-checkbox-group v-model="checked_dependent_variables">
              <div
                class="checkItem"
                v-for="item in all_features"
                :key="item.id"
                v-show="item.status == 0 || item.status == 1"
              >
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

        <!--  选择危险因素(自变量)-->
        <div class="select_feature_var">
          <div class="select_feature_var_top">
            <h3 class="title">选择危险因素(自变量)</h3>
          </div>
          <div class="select_feature_check_boxs">
            <el-skeleton
              :row="6"
              animated
              :loading="featureSelectTree.length < 1"
            />
            <el-checkbox-group v-model="checked_independent_variables">
              <div
                v-for="item in all_features"
                :key="item.id"
                v-show="item.status == 0 || item.status == 2"
              >
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

        <!--  已选标签特征-->
        <div class="select_feature_var">
          <div class="select_feature_var_top">
            <h3 class="title">已选标签特征</h3>
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

        <!-- 已选危险因素 -->
        <div class="select_feature_var">
          <div class="select_feature_var_top">
            <h3 class="title">已选危险因素</h3>
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
            <h3 class="title">已知危险因素</h3>
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
            <el-skeleton
              :row="6"
              animated
              :loading="featureSelectTree.length < 1"
            />
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
      // computeFeatures: [],
      // knownFeatures: [],
      // targetFeature: [],
      //用于存储左侧特征选择树值
      featureSelectTree: [],
      //特征选择数的备份，用于删除叶子节点
      filteredTree: [],
      //用于存储所有特征
      all_features: [],
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
      caculate_use_features: [],
      caculate_known_features: [],
      caculate_target_feature: [],
    };
  },

  created() {
    this.init();
  },

  methods: {
    init() {
      if (this.m_is_common == false) {
        getRequest(
          `api/feature/getContinueFeatrue?tablename=${this.m_dataset}`,
          {
            tableName: this.m_dataset,
          }
        ).then((res) => {
          if (res.code == 200) {
            this.featureSelectTree = res.data;
            console.log("featureSelectTree:", this.featureSelectTree);
            //获取dependent_variables
            if (this.m_all_featrues.length == 0) {
              this.featureSelectTree.forEach((root) => {
                this.extractLeafNodes(root);
              });
            } else {
              this.all_features = this.m_all_featrues;
            }
            console.log("all_features:", this.all_features);
            this.checked_dependent_variables = this.m_target_feature;
            this.checked_independent_variables = this.m_use_features;
            this.know_variables = this.m_known_features;
          }
          // 同步vuex里的数据

          if (this.moduleName !== "disFactor") {
            this.checked_dependent_variables = this.m_target_feature;
            // this.changeBox_target();
          }
        });
      } else {
        getRequest(
          `api/feature/getUserTableTreeFeatures?tablename=${this.m_dataset}`,
          {
            tableName: this.m_dataset,
          }
        ).then((res) => {
          if (res.code == 200) {
            this.featureSelectTree = res.data;
            if (this.m_all_featrues.length == 0) {
              this.featureSelectTree.forEach((root) => {
                this.extractLeafNodes(root);
              });
            } else {
              this.all_features = this.m_all_featrues;
            }
            this.checked_dependent_variables = this.m_target_feature;
            this.checked_independent_variables = this.m_use_features;
            this.know_variables = this.m_known_features;
          }

          if (this.moduleName !== "disFactor") {
            this.checked_dependent_variables = this.m_target_feature;
            // this.changeBox_target();
          }
        });
      }
    },

    next() {
      if (
        this.moduleName == "disFactor" &&
        this.checked_dependent_variables.length !== 1
      ) {
        this.$message({
          type: "warning",
          message: "此模块为疾病危险因素挖掘，只能选择一个因变量",
        });
        return;
      }
      this.checked_dependent_variables.forEach((item) => {
        this.caculate_target_feature.push(item.name);
      });

      this.checked_independent_variables.forEach((item) => {
        this.caculate_use_features.push(item.name);
      });

      this.know_variables.forEach((item) => {
        this.caculate_known_features.push(item.name);
      });

      if (this.checked_independent_variables.length < 5) {
        this.$message({
          type: "warning",
          message: "请选择至少5个自变量参与运算",
        });
        return;
      }
      this.m_changeTaskInfo({
        use_features: this.checked_independent_variables,
        known_features: this.know_variables,
        target_feature: this.checked_dependent_variables,
        all_featrues: this.all_features,
        caculate_target_feature: this.caculate_target_feature,
        caculate_use_features: this.caculate_use_features,
        caculate_known_features: this.caculate_known_features,
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

    // 字段分类树的筛选
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
        console.log(checkeList);
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
      console.log(this.all_features);
      const filterFeature = this.all_features.filter((feature) =>
        feature.label.toLowerCase().includes(this.feature_input.toLowerCase())
      );
      // this.all_features = filterFeature;
      // 假设 allFeatures 和 filterFeature 是两个数组对象

      // 将过滤后的数据添加到原始数据的最前面
      this.all_features = filterFeature.concat(this.all_features.filter(item => !filterFeature.includes(item)));
      console.log(this.all_features);
    },
    clear_feature() {
      this.feature_input = "";
      this.all_features = [];
      this.featureSelectTree.forEach((root) => {
        this.extractLeafNodes(root);
      });
      this.getCheckedNodes();
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

.el-checkbox-group {
  padding-top: 10px;
  display: grid;
  grid-template-columns: repeat(7, 150px);
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
  margin-left: 2.5%;
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
  width: 100%;
  height: auto;
}

.tipInfo {
  /* background-color: pink; */
  height: 50px;
}
.tipInfo div {
  font-weight: bold;
  font-size: 1.2em;
  /* color: rgb(45, 105, 235); */
}
.tipInfo span {
  color: grey;
}

.left_tree {
  display: inline-block;
  height: auto;
  width: 13%;
  border-radius: 3px;
  /* border: 1px solid #e6e6e6; */
  /* border-right: 1px solid #e6e6e6; */
}

.custom-tree-node span {
  font-size: 0.9em;
  color: #3a3a3a;
}
.custom-tree-node span:nth-child(2) {
  color: grey;
}

.right_table {
  display: inline-block;
  height: 75vh;
  width: 75%;
  position: absolute;
  overflow: auto;
}

.specify {
  margin-top: 1px;
  width: 90%;
  height: 5%;
  text-align: center;
  line-height: 35px;
  background-color: #e6e6e6;
}

.select_feature_var {
  margin-top: 1px;
  width: 90%;
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
