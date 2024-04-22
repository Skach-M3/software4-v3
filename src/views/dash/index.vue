<template>
  <div>
    <div class="topStatistic">
      <el-card class="top_statistic_card_left">
        <div slot="header" class="clearfix">
          <span class="lineStyle">▍</span><span>快捷入口</span>
        </div>
        <div class="quickEntryBox">
          <div v-for="(item, index) in quickEntry" :key="index">
            <div class="singleBox" @click="quickLink(index)">
              <img
                :src="item.img"
                class="imgStyle"
                style="border-radius: 15px"
                draggable="false"
                oncontextmenu="return false;"
              />
              <div style="text-align: center">{{ item.title }}</div>
            </div>
          </div>
        </div>
      </el-card>
      <el-card>
        <div slot="header" class="clearfix">
          <span class="lineStyle">▍</span><span>统计信息</span>
        </div>
        <div class="top_statistic_card_right">
          <el-card class="statistic_item">
            <div class="titleArea">
              <i class="el-icon-s-grid"></i>专病集个数
            </div>
            <div class="dataArea">
              <span class="num">{{ statistic.specialityCount }}</span>
              <span class="unit">个</span>
            </div>
            <!-- <div class="text_place">
            <i class="el-icon-s-grid"></i> 专病集个数:{{ statistic.specialityCount }}
          </div> -->
          </el-card>
          <el-card class="statistic_item">
            <div class="titleArea"><i class="el-icon-s-data"></i>样本总量</div>
            <div class="dataArea">
              <span class="num">{{ statistic.sampleCount }}</span>
              <span class="unit">条</span>
            </div>
            <!-- <div class="text_place">
            <i class="el-icon-s-data"></i> 样本总量:{{ statistic.sampleCount }}
          </div> -->
          </el-card>
          <el-card class="statistic_item">
            <div class="titleArea"><i class="el-icon-s-claim"></i>任务总数</div>
            <div class="dataArea">
              <span class="num">{{ statistic.taskCount }}</span>
              <span class="unit">个</span>
            </div>
          </el-card>
          <!-- <el-card class="statistic_item">
          <div class="titleArea" ><i class="el-icon-time"></i>起始时间</div>
          <div class="dataArea" >
            <span class="text" >{{ statistic.startAndEndTime }}</span>
          </div>
        </el-card> -->
        </div>
      </el-card>
    </div>

    <div class="midStatistic">
      <el-card>
        <div class="mid_statistic_card">
          <el-card>
            <div slot="header" class="clearfix">
              <span class="lineStyle">▍</span><span>近期新建任务数</span>
              <el-select
                class="BarchartSelect"
                v-model="charttype"
                placeholder="请选择"
                size="mini"
                @change="changeChart"
              >
                <el-option
                  v-for="item in chartOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
            <div id="chartBox" style="height: 420px; width: 500px">
              <LineChartVue
                v-if="sevendays.length > 0"
                :legend="chartLegend"
                :statistic="chartData"
                :x="sevendays"
              >
              </LineChartVue>
            </div>
          </el-card>
          <el-card>
            <div slot="header" class="clearfix">
              <span class="lineStyle">▍</span><span>疾病占比</span>
            </div>
            <div id="chartBox" style="height: 420px; width: 470px">
              <Pie
                v-if="pieObject.length !== 0"
                :pieObject="pieObject"
                :height="400"
                :width="470"
              >
              </Pie>
            </div>
          </el-card>
          <el-card>
            <div slot="header" class="clearfix">
              <span class="lineStyle">▍</span><span>缺失占比</span>
              <!-- <el-cascader v-model="table_value" :options="table_value_options" :props="{ expandTrigger: 'hover' }" size="mini" @change="table_val_change"></el-cascader> -->
              <el-select
                class="BarchartSelect"
                v-model="table_value"
                placeholder="请选择数据集"
                size="mini"
                @change="table_val_change"
              >
                <el-option
                  v-for="item in table_value_options"
                  :key="item"
                  :label="item"
                  :value="item"
                  size="mini"
                >
                </el-option>
              </el-select>
            </div>
            <div
              id="chartBox"
              style="height: 420px; width: 550px"
              v-loading="fill_rate_loading"
              element-loading-text="后台加载中"
            >
              <Sprit
                v-if="this.sprit_names.length !== 0"
                :sprit_names="sprit_names"
                :sprit_values="sprit_values"
                :height="400"
                :width="550"
                :title="table_value"
              >
              </Sprit>
            </div>
          </el-card>
        </div>
      </el-card>
    </div>

    <!-- <div class="bottomStatistic">
      <el-card class="bottom_statistic_card">
        <div slot="header" class="clearfix">
          <span class="lineStyle">▍</span><span>正负样本占比</span>
        </div>
        <div id="chartBox">
          <Bar
            v-if="
              this.bar_x.length !== 0 &&
              this.bar_pos.length !== 0 &&
              this.bar_neg.length != 0
            "
            style="height: 400px; width: 1400px"
            :bar_x="bar_x"
            :bar_neg="bar_neg"
            :bar_pos="bar_pos"
          >
          </Bar>
        </div>
      </el-card>
    </div> -->
  </div>
</template>

<script>
import { getRequest } from "@/api/user";
import { mapState } from "vuex";
import LineChartVue from "@/components/tab/subcomponents/LineChart.vue";
import Pie from "@/components/tab/subcomponents/Pie.vue";
import Sprit from "@/components/tab/subcomponents/Sprit.vue";
export default {
  name: "index",
  components: { LineChartVue, Pie, Sprit },
  computed: {
    ...mapState(["modelList"]),
  },
  data() {
    return {
      statistic: {
        specialityCount: "xx",
        sampleCount: "xx",
        startAndEndTime: "xx",
        taskCount: "xx",
      },
      quickEntry: [
        {
          title: "数据管理",
          img: require("../../assets/JKZX.png"),
          router: "dataManage",
        },
        {
          title: "任务管理",
          img: require("../../assets/modelTrain.png"),
          router: "taskManage",
        },
        {
          title: "疾病危险因素挖掘",
          img: require("../../assets/singlePredict.png"),
          router: "DisFactor",
        },
        {
          title: "危险因素相关因素挖掘",
          img: require("../../assets/batchPredict.png"),
          router: "F_Factor",
        },
        {
          title: "危险因素相关疾病挖掘",
          img: require("../../assets/lianxi.png"),
          router: "FactorDis",
        },
      ],
      chartLegend: [],
      modelName: [],
      chartData: [],
      taskTotal: [],
      taskModel: [],
      sevendays: [],
      charttype: 1,
      chartOptions: [
        {
          value: 1,
          label: "总数",
        },
        {
          value: 2,
          label: "分任务",
        },
      ],
      table_value: "",
      table_value_options: [],
      pieObject: [],
      sprit_names: [],
      sprit_values: [],
      fill_rate_loading: false,
      userbuilt_table_list: [],
      bar_x: [],
      bar_neg: [],
      bar_pos: [],
    };
  },
  mounted() {},
  created() {
    this.init();
    // this.getTaskList(sessionStorage.getItem("userid") - 0);
    this.getInitInfo();
  },

  methods: {
    // ...mapActions(["getTaskList"]),
    init() {
      getRequest("stastic/7DaysAlgorithmUsage").then((res) => {
        this.chartLegend = ["当天任务数"];

        this.taskTotal.push({
          name: "当天任务数",
          type: "line",
          smooth: true,
          data: [],
        });
        for (const item of this.modelList) {
          this.modelName.push(item);
          this.taskModel.push({
            name: item,
            type: "line",
            smooth: true,
            data: new Array(7).fill(0),
          });
        }
        for (let i = 0; i < 7; i++) {
          this.sevendays.push(res[i].formattedDate);
          this.taskTotal[0].data.push(res[i].total);
          for (const model of res[i].usages) {
            let index = this.taskModel.findIndex((element) => {
              return element.name == model.model;
            });
            this.taskModel[index].data[i] = model.usageCount;
          }
        }
        this.chartData = this.taskTotal;
      });
    },

    quickLink(index) {
      this.$router.push(this.quickEntry[index].router);
    },

    changeChart() {
      switch (this.charttype) {
        case 1: {
          this.chartLegend = ["当天任务数"];
          this.chartData = this.taskTotal;
          break;
        }
        case 2: {
          this.chartLegend = this.modelName;
          this.chartData = this.taskModel;
          break;
        }
      }
    },
    getInitInfo() {
      getRequest("stastic/get_all_table_names").then((res) => {
        if (res.code == 200) {
          this.table_value_options = res.data;
          this.table_value = this.table_value_options[0];
          if(this.table_value_options.length !== 0){
            this.table_val_change();
          }
        } else {
          this.$message.error("获取数据失败");
        }
      });
      getRequest("stastic/getStasticOne").then((res) => {
        if (res.code == 200) {
          this.statistic.sampleCount = res.data.itemNumber;
          this.statistic.taskCount = res.data.taskNumber;
          this.statistic.specialityCount = res.data.specialDiseaseNumber;
          this.statistic.startAndEndTime =
            res.data.startTime + " 至 " + res.data.endTime;
        } else {
          this.$message.error("获取数据失败");
        }
      });
      getRequest("stastic/getdiseaserate").then((res) => {
        if (res.code == 200) {
          for (let key in res.data) {
            let pie_obj = {};
            pie_obj.value = res.data[key];
            pie_obj.name = key;
            this.pieObject.push(pie_obj);
          }
        } else {
          this.$message.error("获取数据失败");
        }
      });
      getRequest("stastic/get_all_userbuilt_table_names").then((res) => {
        if (res.code == 200) {
          this.userbuilt_table_list = res.data;
        } else {
          this.$message.error("获取数据失败");
        }
      });
      // getRequest("stastic/get_pos_neg").then((res) => {
      //   if (res.code == 200) {
      //     this.bar_x = Object.keys(res.data);
      //     let array = Object.values(res.data);
      //     for (let index = 0; index < array.length; index++) {
      //       const element = array[index];
      //       this.bar_neg.push(element.neg);
      //       this.bar_pos.push(element.pos);
      //     }
      //   } else {
      //     this.$message.error("获取数据失败");
      //   }
      // });
    },
    table_val_change() {
      this.fill_rate_loading = true;
      this.sprit_names = [];
      this.sprit_values = [];
      getRequest(`scripts/get_fill_rate?tablename=${this.table_value}`).then(
        (res) => {
          this.sprit_names = res.column_name;
          this.sprit_values = res.miss_rate;
          this.fill_rate_loading = false;
        }
      );
    },
  },
};
</script>

<style scoped>
/* .topBigDiv {
  box-sizing: border-box;
  height: 30vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.topBigDiv .left {
  box-sizing: border-box;
  width: 49%;
  height: 100%;
}

.topBigDiv .right {
  box-sizing: border-box;
  width: 49%;
  height: 100%;
} */

.quickEntryBox {
  /*border: 1px red solid;*/
  /*box-sizing: border-box;*/
  margin-top: 20px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.quickEntryBox .singleBox {
  /*border: 1px red solid;*/
  /*box-sizing: border-box;*/
  width: 80px;
  height: 80px;
  border-radius: 20%;
  cursor: pointer;
  user-select: none;
}

.quickEntryBox .imgStyle {
  width: 90%;
  height: 90%;
}

/* .bottomBigDiv {
  box-sizing: border-box;
  height: 55vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.bottomBigDiv .left {
  box-sizing: border-box;
  height: 100%;
  width: 33%;
  overflow: hidden;
}

.bottomBigDiv .mid {
  box-sizing: border-box;
  height: 100%;
  width: 33%;
}

.bottomBigDiv .right {
  box-sizing: border-box;
  height: 100%;
  width: 33%;
} */

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

.lineStyle {
  color: rgb(100, 172, 231);
  font-weight: 40;
}

.card {
  padding: 0;
  height: 100%;
}

#chartBox {
  width: 100%;
  height: 100%;
}

.BarchartSelect {
  height: 0px;
  margin-left: 25px;
}

.topStatistic {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 20px;
  height: 250px;
  width: 1660px;
}

.top_statistic_card_right {
  text-align: center;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 20px;
}

.top_statistic_card_right .el-card {
  padding: 10px;
  border: 1px solid #fff;
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba;
  background: rgba(255, 255, 255, 0.1);
}

.midStatistic {
  margin-top: 10px;
  height: 550px;
  width: 1660px;
}

.mid_statistic_card {
  display: grid;
  grid-template-columns: repeat(3, 520px);
  /* text-align: center; */
  justify-content: space-around;
}

.mid_statistic_card .el-card {
  border: 1px solid #fff;
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba;
  background: rgba(255, 255, 255, 0.1);
}

/* .bottomStatistic {
  width: 100%;
}

.bottom_statistic_card {
  text-align: center;
  margin-top: 10px;
  margin-bottom: 10px;
  width: 100%;
  height: 100%;
} */

.statistic_item {
  position: relative;
}

.titleArea {
  position: absolute;
  left: 15px;
  top: 8px;
  color: rgb(75, 74, 74);
}

.dataArea {
  /* width: 100%; */
  position: relative;
}

.dataArea .num {
  font-size: 3em;
  color: #132d83;
  line-height: 67px;
}

.dataArea .text {
  position: absolute;
  font-size: 1.5em;
  color: #132d83;
  left: 10px;
  top: 20px;
}

.dataArea .unit {
  position: absolute;
  right: 0px;
  bottom: -10px;
}

.statistic_item .text_place {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translate(-50%, -50%);
  position: relative;
  font-size: 20px;
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
}
</style>
