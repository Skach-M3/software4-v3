<template>
  <div>
    <div id="pdf_1">
      <el-card class="taskInfo_box_card">
        <div slot="header" class="">
          <h2>任务信息:</h2>
        </div>
        <div class="taskInfo_box_card_group">
          <div class="taskInfo_box_card_item">
            <i class="el-icon-data-board" style="font-size: 25px"></i
            ><span class="featureTitle">任务名称：</span>
            <span>{{ m_taskName }}</span>
          </div>

          <div class="taskInfo_box_card_item">
            <i class="el-icon-user" style="font-size: 25px"></i
            ><span class="featureTitle">任务负责人：</span>
            <span>{{ m_principal }}</span>
          </div>

          <div class="taskInfo_box_card_item">
            <i class="el-icon-info" style="font-size: 25px"></i
            ><span class="featureTitle">参与人：</span>
            <span>{{ m_participants }}</span>
          </div>

          <div class="taskInfo_box_card_item">
            <i class="el-icon-collection-tag" style="font-size: 25px"></i
            ><span class="featureTitle">任务备注：</span>
            <span>{{ m_tips }}</span>
          </div>
        </div>
      </el-card>

      <el-card class="taskInfo_box_card">
        <div slot="header" class="">
          <h2>研究对象:</h2>
        </div>
        <div class="taskInfo_box_card_group">
          <div class="taskInfo_box_card_item">
            <i class="el-icon-takeaway-box" style="font-size: 25px"></i
            ><span class="featureTitle">研究病种：</span>
            <span>{{ m_disease }}</span>
          </div>

          <div class="taskInfo_box_card_item">
            <i class="el-icon-folder" style="font-size: 25px"></i
            ><span class="featureTitle">所用数据：</span>
            <span>{{ m_dataset }}</span>
          </div>

          <div class="taskInfo_box_card_item">
            <i class="el-icon-cpu" style="font-size: 25px"></i
            ><span class="featureTitle">所用算法：</span>
            <span>{{ m_algorithm }}</span>
          </div>

          <div class="taskInfo_box_card_item">
            <i class="el-icon-star-off" style="font-size: 25px"></i
            ><span class="featureTitle">所用特征：</span>
            <span>{{ m_caculate_use_features.toString() }}</span>
          </div>
        </div>
        <div class="table_statistic" style="margin-top: 1.5%">
          <div class="taskInfoBox result">
            <i class="el-icon-data-line" style="font-size: 25px"></i
            ><span class="featureTitle">特征分布：</span>
            <el-button
              type="success"
              style="float: right; margin-right: 50px; margin-bottom: 20px"
              @click="exportRes"
              >导出特征信息表</el-button
            >
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

      <el-card class="taskInfo_box_card" id="pdf_graph">
        <div slot="header" class="">
          <h2>任务结果:</h2>
        </div>
        <h3 v-if="initFlag && haveResult">专家知识匹配度：{{ ratio }}</h3>
        <h3 v-if="m_result.time">运算时间：{{ m_result.time }} 秒</h3>
        <h3 v-if="m_result.ci">独立性检验次数：{{ m_result.ci }}次</h3>
        <el-card style="margin-top: 0.8%" shadow="never">
          <div class="graphBox">
            <div class="graphPlaceHolder" v-if="!haveResult">
              未挖掘出相关关系
            </div>
            <GraphVue
              v-if="initFlag && haveResult"
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

    <div class="buttonGroup">
      <el-button @click="backStep()" round>上一步</el-button>
      <!-- <el-button type="success" @click="exportRes" round>导出结果</el-button> -->
      <el-button type="primary" @click="next" round>保存任务</el-button>
    </div>
  </div>
</template>

<script>
// import FileSaver from "file-saver";
import XLSX from "xlsx";
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
import vuex_mixin from "@/components/mixins/vuex_mixin";
import GraphVue from "./Graph.vue";
// import Tree from "./Tree.vue";
import { postRequest } from "@/api/user";
import { mapMutations } from "vuex";
// import { time } from "echarts";
import { getRequest } from "@/api/user.js";
export default {
  name: "Result",
  mixins: [vuex_mixin],
  components: {
    GraphVue,
    // Tree,
  },
  props: {
    moduleName: {
      type: String,
      default: "disFactor",
    },
  },
  computed: {
    ratio() {
      let num = (this.m_result.ratio * 100).toFixed(2);
      return num + "%";
    },
  },

  data() {
    return {
      initFlag: false,
      graphTitile: "",
      node: [],
      links: [],
      data: {},
      type: "",
      distribution: [],
      haveResult: true,
    };
  },

  created() {
    let tempNode = {
      name: this.m_caculate_target_feature[0],
      x: 300,
      y: 300,
      color: "#7B68EE",
      symbolSize: 65,
    };
    let tempLink = {
      source: "",
      target: "",
      value: "",
      label: {
        show: true,
      },
      lineStyle: {
        width: 5,
        curveness: 0.2,
      },
    };
    let top_y = 200;
    let bottom_y = 300;
    switch (this.moduleName) {
      case "disFactor": {
        tempNode.name = this.m_caculate_target_feature[0];
        tempNode.x = 500;
        tempNode.y = bottom_y;
        tempNode.color = "#7B68EE";
        if (this.m_result.res.flat(Infinity).length < 1) {
          this.$message("未挖掘出相关关系");
          this.haveResult = false;
          tempNode.x = 500;
          tempNode.y = 500;
          tempNode.color = "#c2b8fae1";
          break;
        }
        this.graphTitile = `${this.m_disease}相关危险因素`;
        this.node.push(JSON.parse(JSON.stringify(tempNode)));
        let ref_x = 1000 / (this.m_result.res[0].length + 1);
        for (let i = 0; i < this.m_result.res[0].length; i++) {
          tempNode.name = this.m_result.res[0][i];
          tempNode.x = ref_x * (i + 1);
          tempNode.y = top_y;
          tempNode.color = "#FFDEAD";
          this.node.push(JSON.parse(JSON.stringify(tempNode)));
          tempLink.source = this.m_caculate_target_feature[0];
          tempLink.target = this.m_result.res[0][i];
          // 权重是随机数
          // tempLink.value = Number(Math.random().toFixed(3));
          tempLink.lineStyle.width += tempLink.value * 2;
          this.links.push(JSON.parse(JSON.stringify(tempLink)));
        }

        break;
      }

      case "f_Factor": {
        // 不能有重复的name，用map存储已有name进行去重
        let existedName = new Map();
        let ref_x_t = 1000 / (this.m_caculate_target_feature.length + 1);
        for (let i = 0; i < this.m_caculate_target_feature.length; i++) {
          tempNode.name = this.m_caculate_target_feature[i];
          tempNode.x = ref_x_t * i;
          tempNode.y = bottom_y;
          if (
            this.m_result.res[i].length > 0 &&
            this.m_result.res[i].length <= 2
          ) {
            tempNode.color = "#7B68EE";
          } else if (this.m_result.res[i].length >= 3) {
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
        for (const item of this.m_result.res) {
          let tempLen = Number((ref_x_t / (item.length + 1)).toFixed(2));
          ref_x_r.push(tempLen);
          if (item.length > 0) {
            resLength += item.length;
          }
        }
        if (resLength == 0) {
          {
            this.$message("未挖掘出相关关系");
            this.haveResult = false;
            break;
          }
        }

        this.graphTitile = `${this.m_disease}中部分危险因素间关联关系`;
        console.log(this.m_disease, this.graphTitile);

        for (let i = 0; i < this.m_result.res.length; i++) {
          for (let j = 0; j < this.m_result.res[i].length; j++) {
            console.log(this.m_result.res[i][j], ref_x_r[i]);
            if (!existedName.has(this.m_result.res[i][j])) {
              tempNode.name = this.m_result.res[i][j];
              tempNode.x = ref_x_t * i + (ref_x_r[i] + 1) * j;
              tempNode.y = top_y;
              tempNode.color = "#FFDEAD";
              this.node.push(JSON.parse(JSON.stringify(tempNode)));
              existedName.set(tempNode.name, 1);
            }
            tempLink.source = this.m_caculate_target_feature[i];
            tempLink.target = this.m_result.res[i][j];
            // 权重是随机数
            // tempLink.value = Number(Math.random().toFixed(3));
            tempLink.lineStyle.width = 3 + tempLink.value * 8;
            this.links.push(JSON.parse(JSON.stringify(tempLink)));
          }
        }
        break;
      }
      case "factorDis": {
        // 不能有重复的name，用map存储已有name进行去重
        let existedName = new Map();
        let ref_x_t = 1000 / (this.m_caculate_target_feature.length + 1);
        for (let i = 0; i < this.m_caculate_target_feature.length; i++) {
          tempNode.name = this.m_caculate_target_feature[i];
          tempNode.x = ref_x_t * i;
          tempNode.y = bottom_y;
          if (
            this.m_result.res[i].length > 0 &&
            this.m_result.res[i].length <= 2
          ) {
            tempNode.color = "#7B68EE";
          } else if (this.m_result.res[i].length >= 3) {
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
        for (const item of this.m_result.res) {
          let tempLen = Number((ref_x_t / (item.length + 1)).toFixed(2));
          ref_x_r.push(tempLen);
          if (item.length > 0) {
            resLength += item.length;
          }
        }
        if (resLength == 0) {
          {
            this.$message("未挖掘出相关关系");
            this.haveResult = false;
            break;
          }
        }

        this.graphTitile = `${this.m_caculate_target_feature[0]}因素相关疾病`;

        for (let i = 0; i < this.m_result.res.length; i++) {
          for (let j = 0; j < this.m_result.res[i].length; j++) {
            console.log(this.m_result.res[i][j], ref_x_r[i]);
            if (!existedName.has(this.m_result.res[i][j])) {
              tempNode.name = this.m_result.res[i][j];
              tempNode.x = ref_x_t * i + (ref_x_r[i] + 1) * j;
              tempNode.y = top_y;
              tempNode.color = "#FFDEAD";
              this.node.push(JSON.parse(JSON.stringify(tempNode)));
              existedName.set(tempNode.name, 1);
            }
            tempLink.source = this.m_caculate_target_feature[i];
            tempLink.target = this.m_result.res[i][j];
            // 权重是随机数
            tempLink.value = Number(Math.random().toFixed(3));
            tempLink.lineStyle.width = 3 + tempLink.value * 8;
            this.links.push(JSON.parse(JSON.stringify(tempLink)));
          }
        }
        break;
      }
      default:
        break;
    }

    getRequest(`scripts/get_stastic?tablename=${this.m_dataset}`, {
      tableName: this.m_dataset,
    }).then((res) => {
      if (res.code == 200) {
        var result_str = res.data[0].replace(/NaN/g, "null");
        this.distribution = JSON.parse(result_str);
      }
    });
    this.initFlag = true;
  },

  methods: {
    ...mapMutations(["SetTaskList"]),
    next() {
      //上传任务
      let payload = {
        taskName: this.m_taskName,
        leader: this.m_principal,
        participant: this.m_participants,
        tips: this.m_tips,
        disease: this.m_disease,
        model: this.m_algorithm,
        feature: this.m_caculate_use_features,
        targetcolumn: this.m_caculate_target_feature,
        time: this.m_result?.time,
        ratio: this.m_result?.ratio?.toFixed(5),
        ci: this.m_result?.ci,
        res: this.m_result?.res,
        dataset: this.m_dataset,
        uid: sessionStorage.getItem("userid") - 0,
        tasktype: this.moduleName,
      };
      let alghName = "m_" + this.m_algorithm;
      let para = [];
      let paraValue = [];
      for (const key in this[alghName]) {
        if (Object.hasOwnProperty.call(this[alghName], key)) {
          console.log(this[alghName]);
          para.push(key);
          console.log(key);
          console.log(this[alghName][key]);
          paraValue.push(this[alghName][key]);
        }
      }
      payload.para = para;
      payload.paraValue = paraValue;
      postRequest("Task/add", payload)
        .then((res) => {
          this.SetTaskList(res.reverse());
          this.$message({
            showClose: true,
            type: "success",
            message: "任务保存成功",
          });
          // this.m_changeStep(1);
          let defaultValue = {
            step: 1,
            taskName: "",
            principal: "",
            participants: "",
            disease: "",
            tips: "",
            dataset: "",
            use_features: [],
            known_features: [],
            target_feature: [],
            all_featrues: [],
            caculate_use_features: [],
            caculate_known_features: [],
            caculate_target_feature: [],
            algorithm: "",
            SF_DRMB: {
              K_OR: 0.15,
              K_and_PC: 0.3,
              K_and_SP: 0.75,
            },
            result: [],
            is_common: false,
            node_data: "",
          };
          // TODO:这个改不了深层参数，需要写一个深拷贝通用方法
          this.m_changeTaskInfo(defaultValue);
          //任务保存后，跳转到任务管理页面
          this.$router.push("/taskManage");
        })
        .catch((err) => {
          this.$message({
            type: "error",
            message: "新建任务失败",
          });
          console.log(err);
          this.m_changeStep(this.m_step - 1);
          return false;
          this.$router.push("/taskManage");
        })
        .catch((err) => {
          this.$message({
            type: "error",
            message: "新建任务失败",
          });
          console.log(err);
          this.m_changeStep(this.m_step - 1);
          return false;
        });
    },
    backStep() {
      this.m_changeStep(this.m_step - 1);
    },
    exportToXLSX() {
      // 将表格数据转化为CSV格式
      const csvContent = this.convertArrayOfObjectsToCSV(this.distribution);
      console.log(csvContent);
      const ws = XLSX.utils.aoa_to_sheet(csvContent);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, this.m_taskName+'特征分布.xlsx');
      // 创建 Blob 对象
      // const blob = new Blob([csvContent], { type: "text/csv" });

      // // 创建 URL
      // const url = window.URL.createObjectURL(blob);

      // // 创建 a 标签
      // const link = document.createElement("a");

      // // 设置下载属性
      // link.href = url;
      // link.download = this.m_dataset + ".csv";

      // // 模拟点击下载
      // link.click();

      // // 释放资源
      // window.URL.revokeObjectURL(url);
    },
    convertArrayOfObjectsToCSV(data) {
      const csvRows = [];
      const headers = Object.keys(data[0]);

      // 添加表头
      csvRows.push(headers);

      // 添加表格数据
      data.forEach((row) => {
        const values = headers.map((header) => {
          const escaped = ("" + row[header]).replace(/"/g, '\\"');
          return escaped;
        });
        csvRows.push(values);
      });

      return csvRows;
    },

    async exportRes() {
      this.exportToXLSX();
      // const divsToExport = ['pdf_graph'];
      // const pdf_positions = [
      //   { x: 5, y: 10 }
      // ];
      // const pdf = new jsPDF();

      // const renderPromises = divsToExport.map((divId, index) => {
      //   const div = document.getElementById(divId);
      //   return html2canvas(div).then((canvas) => {
      //     const imgData = canvas.toDataURL('image/png');
      //     const imgProps = pdf.getImageProperties(imgData);
      //     const pdfWidth = pdf.internal.pageSize.getWidth();
      //     const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      //     const position = pdf_positions[index] || { x: 0, y: 0 };
      //     pdf.addImage(
      //       imgData,
      //       'PNG',
      //       position.x,
      //       position.y,
      //       pdfWidth,
      //       pdfHeight
      //     );
      //   });
      // });

      // await Promise.all(renderPromises);
      // pdf.save(`${this.m_taskName}.pdf`);
    },

    // getSatisticTableData() {
    //   getRequest(`scripts/get_stastic?tablename=${this.m_dataset}`).then(
    //     (res) => {
    //       if (res.code == 200) {
    //         console.log(res.data[0]);
    //         console.log(typeof (res.data));
    //       }
    //       else {
    //         this.$message.error("获取数据失败");
    //       }
    //     }
    //   );
    // }
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
  font-size: 18px;
  margin-bottom: 20px;
  line-height: 30px;
  vertical-align: top;
}

.taskInfo_box_card_item span {
  line-height: 30px;
  vertical-align: top;
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
  justify-content: center;
  gap: 20px;
}

span {
  white-space: pre-wrap;
  word-wrap: break-word;
}

.taskInfo_box_card {
  margin: 1%;
}

.taskInfo_box_card h2 {
  font-size: 20px;
}

.taskInfo_box_card_group {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.graphPlaceHolder {
  width: 100%;
  height: 380px;
  text-align: center;
  line-height: 350px;
  /* background-color: rgba(179, 178, 178, 0.144); */
  font-weight: bold;
  color: rgba(58, 57, 57, 0.651);
  user-select: none;
}
</style>
