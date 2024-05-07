<template>
  <div>
    <div style="width: 100%; height: 20px" class="header">
      <el-page-header @back="goBack" content="任务结果页面"> </el-page-header>
    </div>
    <div id="pdf_1">
      <el-card class="taskInfo_box_card">
        <div slot="header" class="">
          <h2>任务信息:</h2>
        </div>
        <div class="taskInfo_box_card_group">
          <div class="taskInfo_box_card_item">
            <i class="el-icon-folder-checked" style="font-size: 25px"></i
            ><span class="featureTitle">任务名称：</span>
            <span>{{ res.taskName }}</span>
          </div>

          <div class="taskInfo_box_card_item">
            <i class="el-icon-user" style="font-size: 25px"></i
            ><span class="featureTitle">任务负责人：</span>
            <span>{{ res.leader }}</span>
          </div>

          <div class="taskInfo_box_card_item">
            <i class="el-icon-info" style="font-size: 25px"></i
            ><span class="featureTitle">参与人：</span>
            <span>{{ res.participant }}</span>
          </div>

          <div class="taskInfo_box_card_item">
            <i class="el-icon-collection-tag" style="font-size: 25px"></i
            ><span class="featureTitle">任务备注：</span>
            <span>{{ res.tips }}</span>
          </div>
        </div>
      </el-card>

      <el-card class="taskInfo_box_card">
        <div slot="header" class="">
          <h2>研究对象:</h2>
        </div>

        <!-- 两种不同展示方式 -->
        <div class="taskInfo_box_card_group" v-if="res.feature.length <= 15">
          <div class="taskInfo_box_card_item">
            <i class="el-icon-takeaway-box" style="font-size: 25px"></i
            ><span class="featureTitle">研究病种：</span>
            <span>{{ res.disease }}</span>
          </div>

          <div class="taskInfo_box_card_item">
            <i class="el-icon-s-grid" style="font-size: 25px"></i
            ><span class="featureTitle">所用数据：</span>
            <span>{{ res.dataset }}</span>
          </div>

          <div class="taskInfo_box_card_item">
            <i class="el-icon-cpu" style="font-size: 25px"></i
            ><span class="featureTitle">所用算法：</span>
            <span>{{ res.model }} </span>
            <span v-if="res.para[0] !== ''">
              <span v-for="(item, index) in res.para" :key="index">
                {{ item }}:{{ res.paraValue[index] }};</span
              >
            </span>
          </div>

          <div class="taskInfo_box_card_item">
            <i class="el-icon-star-off" style="font-size: 25px"></i
            ><span class="featureTitle">所用特征：</span>
            <span>{{ res.feature.toString() }}</span>
          </div>
        </div>

        <div v-else>
          <div class="taskInfo_box_card_group">
            <div class="taskInfo_box_card_item">
              <i class="el-icon-takeaway-box" style="font-size: 25px"></i
              ><span class="featureTitle">研究病种：</span>
              <span>{{ res.disease }}</span>
            </div>

            <div class="taskInfo_box_card_item">
              <i class="el-icon-s-grid" style="font-size: 25px"></i
              ><span class="featureTitle">所用数据：</span>
              <span>{{ res.dataset }}</span>
            </div>

            <div class="taskInfo_box_card_item">
              <i class="el-icon-cpu" style="font-size: 25px"></i
              ><span class="featureTitle">所用算法：</span>
              <span>{{ res.model }} </span>
              <span v-if="res.para[0] !== ''">
              <span v-for="(item, index) in res.para" :key="index">
                {{ item }}:{{ res.paraValue[index] }};</span
              >
            </span>
            </div>
          </div>

          <div class="taskInfo_box_card_group">
            <div class="taskInfo_box_card_item">
              <i class="el-icon-star-off" style="font-size: 25px"></i
              ><span class="featureTitle">所用特征：</span>
              <span style="white-space: pre-wrap">{{
                res.feature.toString()
              }}</span>
            </div>
          </div>
        </div>

        <div class="table_statistic" style="margin-top: 1.5%">
          <div class="taskInfoBox result">
            <i class="el-icon-data-line" style="font-size: 25px"></i
            ><span class="featureTitle">特征分布：</span>
          </div>
          <div id="table">
            <!-- <div id="creatorFilter">
              <span>特征类型：</span>
              <el-select v-model="type" clearable placeholder="请选择">
                <el-option key="人口学" label="人口学" value="人口学"> </el-option>
                <el-option key="社会学" label="社会学" value="社会学"> </el-option>
                <el-option key="行为学" label="行为学" value="行为学"> </el-option>
              </el-select>
            </div> -->
            <el-table
              :data="
                distribution.filter((data) => !type || data.type.includes(type))
              "
              style="width: 100%; margin-top: 20px; margin-bottom: 50px"
              stripe
              max-height="800"
              :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
              id="out_table"
            >
              <el-table-column label="特征名" prop="column_name">
              </el-table-column>
              <!-- <el-table-column label="样本量" prop="num"> </el-table-column> -->
              <!-- <el-table-column label="特征类型" prop="type"> </el-table-column> -->
              <el-table-column label="平均值" prop="mean"> </el-table-column>
              <el-table-column label="标准差" prop="std"></el-table-column>
              <el-table-column label="偏度" prop="skew"> </el-table-column>
              <el-table-column label="峰度" prop="kur"> </el-table-column>
              <el-table-column label="Shapiro-Wilk">
                <el-table-column label="统计量D值" prop="Shapiro_Wilk_D">
                </el-table-column>
                <el-table-column label="P值" prop="Shapiro_Wilk_p">
                </el-table-column>
              </el-table-column>
              <el-table-column label="Kolmogorov-Smirnov">
                <el-table-column label="统计量D值" prop="Kolmogorov_Smirnov_D">
                </el-table-column>
                <el-table-column label="P值" prop="Kolmogorov_Smirnov_p">
                </el-table-column>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-card>

      <el-card class="taskInfo_box_card">
        <div slot="header" class="">
          <h2>任务结果:</h2>
        </div>
        <h3>专家知识匹配度：{{ ratio }}</h3>
        <h3 v-if="res.time">运算时间：{{ res.time }} 秒</h3>
        <h3 v-if="res.ci">独立性检验次数：{{ res.ci }}次</h3>
        <el-card style="margin-top: 0.8%">
          <div class="graphBox">
            <GraphVue
              v-if="initFlag"
              :title_text="graphTitile"
              :node="node"
              :links="links"
            ></GraphVue>
          </div>
        </el-card>
        <!-- <el-card style="margin-top: 0.8%;">
          <div class="treeBox">
            <Tree v-if="initFlag" :title_text="graphTitile" :data="data"></Tree>
          </div>
        </el-card> -->
      </el-card>
    </div>
  </div>
</template>

<script>
import GraphVue from "./Graph.vue";
// import Tree from "./Tree.vue";
// import { postRequest } from "@/api/user";
// import { time } from "echarts";
import { getRequest } from "@/api/user.js";
export default {
  name: "TaskResult",
  components: {
    GraphVue,
  },

  computed: {
    ratio() {
      let num = (this.res.ratio * 100).toFixed(2);
      return num + "%";
    },
  },

  data() {
    return {
      res: {},
      initFlag: false,
      graphTitile: "",
      node: [],
      links: [],
      data: {},
      type: "",
      distribution: [],
    };
  },

  created() {
    this.res = JSON.parse(sessionStorage.getItem("result"));
    console.log(this.res);
    // var treeData = {
    //   name: "结果统计",
    //   children: [],
    // };
    let tempNode = {
      name: this.res.targetcolumn[0],
      x: 300,
      y: 300,
      color: "#7B68EE",
      symbolSize: 65,
    };
    let tempLink = {
      source: "",
      target: "",
      value: '',
      label: {
        show: true,
      },
      lineStyle: {
        width: 3,
        curveness: 0.2,
      },
    };
    let top_y = 200;
    let bottom_y = 300;

    // 不能有重复的name，用map存储已有name进行去重
    let existedName = new Map();
    let ref_x_t = 1000 / (this.res.targetcolumn.length + 1);
    for (let i = 0; i < this.res.targetcolumn.length; i++) {
      tempNode.name = this.res.targetcolumn[i];
      tempNode.x = ref_x_t * i;
      tempNode.y = bottom_y;
      if (this.res.res[i]?.length > 0 && this.res.res[i]?.length <= 2) {
        tempNode.color = "#7B68EE";
      } else if (this.res.res[i]?.length >= 3) {
        tempNode.color = "#000080";
      } else {
        tempNode.color = "#c2b8fae1";
      }
      this.node.push(JSON.parse(JSON.stringify(tempNode)));
      existedName.set(tempNode.name, 1);
    }
    // 检查结果二维数组中是否有值并统计总长度
    let resLength = 0;
    let ref_x_r = [];
    for (const item of this.res.res) {
      let tempLen = Number((ref_x_t / (item.length + 1)).toFixed(2));
      ref_x_r.push(tempLen);
      if (item.length > 0) {
        resLength += item.length;
      }
    }

    this.graphTitile = `${this.res.targetcolumn[0]}因素相关疾病`;

    for (let i = 0; i < this.res.res.length; i++) {
      for (let j = 0; j < this.res.res[i].length; j++) {
        console.log(this.res.res[i][j], ref_x_r[i]);
        if (!existedName.has(this.res.res[i][j])) {
          tempNode.name = this.res.res[i][j];
          tempNode.x = ref_x_t * i + (ref_x_r[i] + 1) * j;
          tempNode.y = top_y;
          tempNode.color = "#FFDEAD";
          this.node.push(JSON.parse(JSON.stringify(tempNode)));
          existedName.set(tempNode.name, 1);
        }
        tempLink.source = this.res.targetcolumn[i];
        tempLink.target = this.res.res[i][j];
        // 权重是随机数
        // tempLink.value = Number(Math.random().toFixed(3));
        tempLink.lineStyle.width = 3 + tempLink.value * 8;
        this.links.push(JSON.parse(JSON.stringify(tempLink)));
      }
    }
    console.log("links", this.links);
    console.log("nodes", this.node);
    // var resTreedata = this.res.treeRes;
    // Object.entries(resTreedata).forEach(function ([key, value], index) {
    //   var firstChildren = { name: String(key), children: [] };
    //   treeData.children.push(firstChildren);
    //   var secondChildrenList = Array.from(value);
    //   secondChildrenList.forEach((element) => {
    //     var secondChildren = { name: String(element), children: [] };
    //     treeData.children[index].children.push(secondChildren);
    //   });
    // });
    // this.data = treeData;
    getRequest(`scripts/get_stastic?tablename=${this.res.dataset}`, {
      tableName: this.res.dataset,
    }).then((res) => {
      if (res.code == 200) {
        var result_str = res.data[0].replace(/NaN/g, "null");
        this.distribution = JSON.parse(result_str);
      }
    }).catch((err) => {
      this.$message.warning("数据表已删除，故无法进行统计！");
      this.distribution = [];
    });

    this.initFlag = true;
  },

  methods: {
    goBack() {
      this.$router.go(-1);
      sessionStorage.removeItem("result");
    },
  },
};
</script>

<style scoped>
.taskBox1 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.taskInfoBox {
  margin-bottom: 20px;
}

.lineStyle {
  color: rgb(100, 172, 231);
  font-weight: 100;
  font-size: 25px;
}

.featureTitle {
  font-size: 20px;
  margin-right: 30px;
  margin-bottom: 20px;
}

h3 {
  display: inline;
  margin-right: 15%;
}

.graphBox {
  width: 100%;
  height: 40vh;

  margin-top: 20px;
}

.treeBox {
  width: 100%;
  height: 50vh;

  margin-top: 20px;
}

.buttonGroup {
  margin-top: 30px;
  display: flex;
  justify-content: left;
  gap: 20px;
}

span {
  white-space: pre-wrap;
  word-wrap: break-word;
}

.taskInfo_box_card {
  margin: 1%;
}

.taskInfo_box_card_group {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
