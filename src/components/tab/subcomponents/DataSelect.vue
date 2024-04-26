<template>
  <div>
    <div class="content">
      <div class="left_tree">
        <div class="tipInfo">
          <h3>可选数据</h3>
          <div v-if="moduleName == 'factorDis'">
            <span class="statistic"> 仅可选择多疾病数据集 </span>
          </div>
          <div v-else>
            <span class="statistic"> 一级病种: {{ diseaseNum }} 个 </span>
            <span class="statistic"> 数据表: {{ datasetNum }} 个 </span>
          </div>
        </div>
        <hr class="hr-dashed" />
        <el-input placeholder="输入关键字进行过滤" v-model="filterText">
        </el-input>
        <el-tree ref="tree1" :data="treeData1" v-if="treeData1.length>0" :show-checkbox="false" node-key="id" default-expand-all
          :expand-on-click-node="false" :highlight-current="true" @node-click="changeData"
          :filter-node-method="filterNode">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span  class="left_span">
              <i class="el-icon-document  tree_icon" v-if="data.isLeafs == 1 && data.uid != loginUserID"
              ></i>
              <i class="el-icon-document tree_icon" v-if="data.isLeafs == 1 && data.uid == loginUserID" style="color: rgb(40, 207, 18);"
              ></i>
              <span v-if="data.catLevel == 1" style="font-weight: bold; font-size: 15px; color: #252525">{{ node.label
                }}</span>
              <span v-else :class="{'nodeLabel': node.label.length <= 10, 'scrolling-nodeLabel': node.label.length > 10}">{{ node.label }}
                <span v-if="data.isLeafs == 1 && data.uid == loginUserID"> （我）</span>
              </span>
            </span>
          </span>
        </el-tree>
        <el-tree ref="tree2" :data="treeData2" v-if="treeData2.length>0" :show-checkbox="false" node-key="id" default-expand-all
          :expand-on-click-node="false" :highlight-current="true" @node-click="changeData"
          :filter-node-method="filterNode">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span  class="left_span">
              <i class="el-icon-document  tree_icon" v-if="data.isLeafs == 1 && data.uid != loginUserID"
              ></i>
              <i class="el-icon-document tree_icon" v-if="data.isLeafs == 1 && data.uid == loginUserID" style="color: rgb(40, 207, 18);"
              ></i>
              <span v-if="data.catLevel == 1" style="font-weight: bold; font-size: 15px; color: #252525">{{ node.label
                }}</span>
              <span v-else :class="{'nodeLabel': node.label.length <= 10, 'scrolling-nodeLabel': node.label.length > 10}">{{ node.label }}
                <span v-if="data.isLeafs == 1 && data.uid == loginUserID"> （我）</span>
              </span>
            </span>
          </span>
        </el-tree>
        <el-tree ref="tree3" :data="treeData3" v-if="treeData3.length>0" :show-checkbox="false" node-key="id" default-expand-all
          :expand-on-click-node="false" :highlight-current="true" @node-click="changeData"
          :filter-node-method="filterNode">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span class="left_span">
              <i class="el-icon-document  tree_icon" v-if="data.isLeafs == 1"
              ></i>
              <span v-if="data.catLevel == 1" style="font-weight: bold; font-size: 15px; color: #252525">{{ node.label
                }}</span>
              <span v-else :class="{'nodeLabel': node.label.length <= 10, 'scrolling-nodeLabel': node.label.length > 10}">{{ node.label }}</span>
            </span>
          </span>
        </el-tree>
      </div>
      <div class="right_table">
        <el-card class="right_table_topCard">
          <div style="height: 50px; padding-left: 5px">
            <h3 style="margin-top:-20px">数据预览</h3>
          </div>
          <div class="describe_content">
            <p>
              <i class="el-icon-folder"></i> 数据集名称:<span style="font-weight: bold; font-size: 18px; color: #252525">{{
            showDataForm.tablename }}</span>
              <i class="el-icon-user"></i> 创建人:<span>{{
            showDataForm.createUser
          }}</span>
              <i class="el-icon-time"></i> 创建时间:<span>{{
              showDataForm.createTime
            }}</span>
              <i class="el-icon-finished"></i> 样本个数:<span>{{
              showDataForm.sampleNum
            }}</span>
              <i class="el-icon-finished"></i> 特征个数:<span>{{
              showDataForm.featureNum
            }}</span>
              <!-- <i class="el-icon-folder-opened"></i> 所属类别:<span>{{ showDataForm.classPath }}</span> -->
            </p>
          </div>

          <div class="tableDataCSS" v-loading="table_loading" element-loading-text="数据量较大，拼命加载中"
            element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.05)" ref="listWrap"
            @scroll="scrollListener">
            <div class="tablePlaceholder" v-if="tableData.length < 1 && !table_loading">
              请在左侧选择数据
            </div>
            <div v-else ref="list">
              <el-table :data="tableData" stripe class="custom-table" max-height="550" :fit="false"
                v-if="tableData.length > 0" :header-cell-style="{ background: '#eee', color: '#606266' }"
                ref="scrollTable">
                <el-table-column v-for="(value, key) in tableData[0]" :key="key" :prop="key" :label="key"
                  :width="colWidth" sortable>
                  <template slot-scope="{ row }">
                    <div class="truncate-text">{{ row[key] }}</div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-card>

        <div class="buttonGroup">
          <el-button @click="backStep()" round>上一步</el-button>
          <el-button type="primary" round :disabled="tableData.length < 1"
            @click="next(showDataForm.classPath, showDataForm.tablename)">下一步</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCategory } from "@/api/category";
import { getTableDes, getTableData } from "@/api/tableDescribe.js";
import vuex_mixin from "@/components/mixins/vuex_mixin";
import { getRequest } from "@/api/user";
export default {
  name: "DataSelect",
  mixins: [vuex_mixin],
  props: {
    moduleName: {
      type: String,
      default: "disFactor",
    },
  },
  watch: {
    filterText(val) {
      this.$refs.tree1?.filter(val);
      this.$refs.tree2?.filter(val);
      this.$refs.tree3?.filter(val);
    },

    length(val) {
      // 超过10行数据，就按照最大40*10 400px高度的列表就行
      if (val >= 10) {
        this.$refs.listWrap.style.height = "550px";
      } else {
        // 不足10行数据，这边 加57是因为表头的高度，具体情况，你们加不加无所谓
        this.$refs.listWrap.style.height = "550px";
      }
    },
  },
  computed: {
    colWidth() {
      let arr = Object.keys(this.tableData[0]);
      if (arr.length <= 15) {
        return 90;
      } else {
        return 65;
      }
    },
    length() {
      return this.tableData.length || 0;
    },
    loginUserID() {
      return sessionStorage.getItem("userid");
    },
  },

  data() {
    return {
      treeData: [],
      treeData1: [],
      treeData2: [],
      treeData3: [],
      filterText: '',
      nodeData: {},
      tableData: [], //总共的列表数据
      itemHeight: 48, // item高度
      num: 10, // 展示的数据
      start: 0, // 开始索引
      end: 9, // 结束索引
      showDataForm: {
        createUser: "",
        createTime: "",
        classPath: "",
        tablename: "",
        sampleNum: "",
        featureNum: "",
      },
      diseaseNum: 0,
      datasetNum: 0,
      table_loading: false,
      tempNode: {},
    };
  },

  created() {
    this.init();
    this.getCatgory();
    this.$notify.success({
      title: "提示",
      message: "请选择数据集进行下一步操作！",
      showClose: false,
    });
  },
  mounted() {
    this.$refs.listWrap.style.height = "550px"; // 设置可视区域的高度
  },
  methods: {
    init() {
      if (this.m_node_data !== "") {
        var node = JSON.parse(this.m_node_data);
        this.changeData(node);
      }
    },
    scrollListener() {
      // 获取滚动高度
      const scrollTop = this.$refs.listWrap.scrollTop;
      // 开始的数组索引
      this.start = Math.floor(scrollTop / this.itemHeight);
      // 结束索引
      this.end = this.start + this.num;
      this.$refs.list.style.transform = `translateY(${this.start * this.itemHeight
        }px)`; // 对列表项y轴偏移
    },

    // 树形结构筛选方法
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },

    next(classPath, name) {
      var path = classPath.split("/");
      console.log(this.tempNode);
      if (this.tempNode.isFilter == "1") {
        this.m_changeTaskInfo({
          disease: path[0],
          dataset: name,
          is_common: false,
          node_data: JSON.stringify(this.tempNode),
        });
      } else if (this.tempNode.isUpload == "1") {
        this.m_changeTaskInfo({
          disease: path[0],
          dataset: name,
          is_common: true,
          node_data: JSON.stringify(this.tempNode),
        });
      }
      this.m_changeStep(3);
    },

    backStep() {
      this.m_changeStep(this.m_step - 1);
    },

    changeData(data) {
      if (data.isLeafs == 1) {
        this.tempNode = data;
        this.showDataForm.featureNum = "";
        this.showDataForm.sampleNum = "";
        this.table_loading = true;
        this.tableData = [];
        //获取描述信息
        let that = this;
        that.getTableDescribe(data.id);
        //获取数据信息
        that.getTableData(data.id, data.label);
      }
    },
    getTableDescribe(id) {
      getTableDes("/api/tableDescribe", id)
        .then((response) => {
          if (response.data != null) {
            let res = JSON.parse(response.data);
            this.showDataForm.createUser = res.createUser;
            this.showDataForm.createTime = res.createTime;
            this.showDataForm.classPath = res.classPath;
            this.showDataForm.tablename = res.tableName;
          }
        })
        .catch((error) => {
          console.log("错误", error);
        });
    },
    getTableData(tableId, tableName) {
      getTableData("/api/getTableData", tableId, tableName)
        .then((response) => {
          // 获取表数据
          this.tableData = response.data;
          console.log(this.tableData);
          const fields = Object.keys(this.tableData[0]);
          this.showDataForm.sampleNum = this.tableData.length;
          this.showDataForm.featureNum = fields.length;
          this.table_loading = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    getCatgory() {
      getCategory(`/api/category?uid=${this.loginUserID}`).then((response) => {
        // 如果是多疾病任务，只能选择公共数据集
        if (this.moduleName == "factorDis") {
          const tempData = this.filterTreeByLabel(response.data,'多疾病');
          // console.log(tempData);
          this.treeData = tempData;
          this.treeData1 = this.treeData.slice(0,1);
          this.treeData2 = this.treeData.slice(1,2);
          this.treeData3 = this.treeData.slice(2,3);
          // 为什么find不能用
          // const publicNode = response.data.find((node)=>{
          //   node.id == '1010';
          // })
          // console.log(publicNode);
          // this.treeData = this.filterTree(publicNode)
        } else {
          // this.treeData = this.filterTree(response.data);
          this.treeData1 = this.filterTree(response.data.slice(0,1));
          this.treeData2 = this.filterTree(response.data.slice(1,2));
          this.treeData3 = this.filterTree(response.data.slice(2,3));
        }
        // 获取病种和数据集总数
        this.diseaseNum =
          response.data[0].children.length + response.data[1].children.length;
        getRequest("/api/getTableNumber").then((res) => {
          if (res.code == 200) this.datasetNum = res.data;
        });
        if (this.treeData1.length+this.treeData2.length+this.treeData3.length < 1) {
          this.$message({
            showClose: true,
            type: "warning",
            message: "暂无可用数据",
          });
        }
      });
    },

    // 递归过滤树结构
    filterTree(nodes) {
      if (nodes.length < 1) return;
      return nodes.filter((node) => {
        if (node.isLeafs === 1) {
          return true;
        } else if (node.children && node.children.length > 0) {
          node.children = this.filterTree(node.children);
          return node.children.length > 0;
        }
        return false;
      });
    },
    filterTreeByLabel(tree, label) {
    // 创建一个新数组，存储匹配标签的节点及其子树
    const result = [];

    // 递归函数来检查每个节点及其子树
    function checkNode(node) {
        // 判断节点的标签是否为指定的label
        if (node.label === label) {
            // 如果是则包括这个节点及其全部子树
            return true;
        }
        // 如果有子节点，继续在它们中寻找
        if (node.children && node.children.length > 0) {
            // 新的子节点数组
            const newChildren = [];
            for (let child of node.children) {
                // 递归每个子节点
                if (checkNode(child)) {
                    // 如果子节点或其任一子树匹配，则保留该子节点
                    newChildren.push(child);
                }
            }
            // 如果找到了匹配的子节点，则重构当前节点并保留符合条件的子节点
            if (newChildren.length > 0) {
                node.children = newChildren;
                return true;
            }
        }
        // 如果当前节点和它的子节点都不匹配，则返回false
        return false;
    }

    // 遍历树的顶层节点
    tree.forEach(node => {
        if (checkNode(node)) {
            // 如果节点或其子树匹配，则添加到最终结果中
            result.push(node);
        }
    });
    // 返回匹配的节点及其所有子节点
    return result;
}

  },
};
</script>

<style scoped>
.buttonGroup {
  width: 200px;
  margin-top: 35px;
  margin-left: auto;
  margin-right: auto;
}

.content {
  position: relative;
  width: 100%;
  height: 790px;
}

.left_tree {
  display: inline-block;
  height: 85%;
  width: 15%;
  overflow: auto;
  border-radius: 3px;
  border: 1px solid #e6e6e6;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
  overflow: hidden;
}

.custom-tree-node .left_span{
  width: 10em;
  overflow: hidden;
}

.nodeLabel, .scrolling-nodeLabel{
  display: inline-block;
  white-space: nowrap;  /* 禁止文本换行 */
  box-sizing: border-box;  /* 边框和内填充的宽度也包含在width内 */
}

.scrolling-nodeLabel:hover{
  position: relative;
  overflow: hidden;
  vertical-align: text-bottom;
  animation: scrollText 3s linear infinite;  /* 动画持续时间和循环方式 */
}

@keyframes scrollText {
  0% {
    transform: translateX(0px);
  }
  12% {
    transform: translateX(0px);
  }
  75% {
    transform: translateX(calc(-100% + 10em));
  }
  100% {
    transform: translateX(calc(-100% + 10em));
  }
}

.tipInfo {
  background-color: rgba(124, 124, 124, 0.1);
  height: 50px;
  text-align: center;
}

.tipInfo .statistic {
  font-size: 13px;
  color: #585858;
}

.hr-dashed {
  border: 0;
  border-top: 1px dashed #899bbb;
}

h3 {
  color: #3d3d3d;
  text-align: center;
}

.right_table {
  display: inline-block;
  width: 85%;
  position: absolute;
  overflow: auto;
  height: 100%;
}

.tablePlaceholder {
  height: 550px;
  text-align: center;
  line-height: 550px;
  background-color: rgba(179, 178, 178, 0.144);
  font-weight: bold;
  color: rgba(58, 57, 57, 0.651);
  user-select: none;
}

.tableDataCSS {
  width: 100%;
  /* 因为listWrap设置高度，这里的height会失效 */
  /* height: 550px; */
}

.truncate-text {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.right_table_topCard {
  padding: 0;
  height: auto;
  width: 95%;
  position: relative;
  left: 1%;
}

.describe_content {
  display: inline-block;
  width: 90%;
  margin-bottom: 26px;
}

.describe_content span {
  margin: 10px;
}
</style>
