<template>
  <div class="content">
    <div class="left_tree">
      <div class="tipInfo">
        <h3>可选数据</h3>
        <span class="statistic"> 一级病种: {{ diseaseNum }} 个 </span>
        <span class="statistic"> 数据表: {{ datasetNum }} 个 </span>
      </div>
      <hr class="hr-dashed" />
      <el-input placeholder="输入关键字进行过滤" v-model="filterText">
      </el-input>
      <div class="treeArea">
          <!-- =========================================私有数据集树 -->
        <el-tree ref="tree1" :data="treeData1" :show-checkbox="false" node-key="id" :default-expanded-keys="['1']"
          :expand-on-click-node="false" :highlight-current="true" @node-click="changeData"
          :filter-node-method="filterNode">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span class="left_span">
              <i class="el-icon-document tree_icon" v-if="data.isLeafs == 1 && data.uid != loginUserID"
              ></i>
              <i class="el-icon-document tree_icon" v-if="data.isLeafs == 1 && data.uid == loginUserID" style="color: rgb(40, 207, 18);"
              ></i>
              <span v-if="data.catLevel == 1" style="font-weight: bold; font-size: 15px; color: #252525">{{ node.label
                }}</span>
              <span v-else :class="{'nodeLabel': node.label.length <= 12, 'scrolling-nodeLabel': node.label.length > 12}">{{ node.label }}
                <span v-if="data.isLeafs == 1 && data.uid == loginUserID"> （我）</span>
              </span>
              
            </span>
            
            <span>
              <el-popconfirm v-if="data.label != '多疾病'" confirm-button-text="上传数据集" cancel-button-text="纳排数据集" title="请选择添加数据集方式"
                cancel-button-type="primary" @confirm="importData" @cancel="openAddDataForm(data.label)">
                <el-button v-if="data.catLevel != 1 && data.status != 2 && data.isLeafs == 0" icon="el-icon-circle-plus-outline" size="mini"
                  type="text" slot="reference" @click="markNode(data)">
                </el-button>
              </el-popconfirm>
              <el-popconfirm v-else confirm-button-text="上传数据集" title="请上传本地多疾病数据集"
                @confirm="importData">
                <el-button v-if="data.catLevel != 1 && data.status != 2 && data.isLeafs == 0" icon="el-icon-circle-plus-outline" size="mini"
                  type="text" slot="reference" @click="markNode(data)">
                </el-button>
              </el-popconfirm>

              <el-popconfirm title="删除后无法恢复" icon="el-icon-warning" icon-color="red" confirm-button-text="确认"
                cancel-button-text="取消" @confirm="() => remove(node, data)">
                <el-button v-if="(data.isLeafs == 1 && data.status == 0) ||
                (data.isLeafs == 1 && data.uid == loginUserID && data.status != 2)
                " icon="el-icon-delete" size="mini" type="text" slot="reference">
                </el-button>
              </el-popconfirm>
            </span>
          </span>
        </el-tree>

        <!-- =========================================共享数据集树 -->
        <el-tree ref="tree2" :data="treeData2" :show-checkbox="false" node-key="id" :default-expanded-keys="['1']"
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
              <span v-else :class="{'nodeLabel': node.label.length <= 12, 'scrolling-nodeLabel': node.label.length > 12}">{{ node.label }}
                <span v-if="data.isLeafs == 1 && data.uid == loginUserID"> （我）</span>
              </span>
              
            </span>
            
            <span>
              <el-popconfirm v-if="data.label != '多疾病'" confirm-button-text="上传数据集" cancel-button-text="纳排数据集" title="请选择添加数据集方式"
                cancel-button-type="primary" @confirm="importData" @cancel="openAddDataForm(data.label)">
                <el-button v-if="data.catLevel != 1 && data.status != 2 && data.isLeafs == 0" icon="el-icon-circle-plus-outline" size="mini"
                  type="text" slot="reference" @click="markNode(data)">
                </el-button>
              </el-popconfirm>
              <el-popconfirm v-else confirm-button-text="上传数据集" title="请上传本地多疾病数据集"
                @confirm="importData">
                <el-button v-if="data.catLevel != 1 && data.status != 2 && data.isLeafs == 0" icon="el-icon-circle-plus-outline" size="mini"
                  type="text" slot="reference" @click="markNode(data)">
                </el-button>
              </el-popconfirm>

              <el-popconfirm title="删除后无法恢复" icon="el-icon-warning" icon-color="red" confirm-button-text="确认"
                cancel-button-text="取消" @confirm="() => remove(node, data)">
                <el-button v-if="(data.isLeafs == 1 && data.status == 0) ||
            (data.isLeafs == 1 && data.uid == loginUserID && data.status != 2)
            " icon="el-icon-delete" size="mini" type="text" slot="reference">
                </el-button>
              </el-popconfirm>
            </span>
          </span>
        </el-tree>

        <!-- =========================================公共数据集树 -->
        <el-tree ref="tree3" :data="treeData3" :show-checkbox="false" node-key="id" :default-expanded-keys="['1']"
          :expand-on-click-node="false" :highlight-current="true" @node-click="changeData"
          :filter-node-method="filterNode">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span class="left_span">
              <i class="el-icon-document  tree_icon" v-if="data.isLeafs == 1"
              ></i>
              <span v-if="data.catLevel == 1" style="font-weight: bold; font-size: 15px; color: #252525">{{ node.label
                }}</span>
              <span v-else :class="{'nodeLabel': node.label.length <= 12, 'scrolling-nodeLabel': node.label.length > 12}">{{ node.label }}</span>
            </span>
            
            <!-- <span>
              <el-popconfirm confirm-button-text="上传数据集" cancel-button-text="纳排数据集" title="请选择添加数据集方式"
                cancel-button-type="primary" @confirm="importData" @cancel="openAddDataForm(data.label)">
                <el-button v-if="data.catLevel == 3 && data.status != 2 && data.isLeafs == 0" icon="el-icon-circle-plus-outline" size="mini"
                  type="text" slot="reference" @click="markNode(data)">
                </el-button>
              </el-popconfirm>

              <el-popconfirm title="删除后无法恢复" icon="el-icon-warning" icon-color="red" confirm-button-text="确认"
                cancel-button-text="取消" @confirm="() => remove(node, data)">
                <el-button v-if="(data.isLeafs == 1 && data.status == 0) ||
                (data.uid == loginUserID && data.status != 2)
                " icon="el-icon-delete" size="mini" type="text" slot="reference">
                </el-button>
              </el-popconfirm>
            </span> -->
          </span>
        </el-tree>
      </div>

      <el-dialog title="提示" :visible.sync="dialogDiseaseVisible" width="30%">
        <span>
          请输入新病种名称：<el-input placeholder="请输入内容" v-model="diseaseName" class="nameInput"></el-input>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cleanInput()">取 消</el-button>
          <el-button type="primary" @click="() => append(0)">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <el-dialog title="新增数据集" :visible.sync="dialogDataVisible" width="1150px">
      <div class="addDataClass">
        <div class="addDataBaseInfo">
          <i class="el-icon-s-data"></i>
          <span class="titleText">数据集：</span>
          <el-input v-model="addDataForm.dataName" placeholder="请输入数据集名称"></el-input>
        </div>
        <div class="addDataBaseInfo">
          <i class="el-icon-user-solid"></i>
          <span class="titleText">创建人：</span>
          <el-input v-model="addDataForm.createUser" placeholder="请输入创建人姓名" disabled></el-input>
        </div>
        <div class="addDataBaseInfo createTimeArea">
          <i class="el-icon-time"></i>
          <span class="titleText">创建时间：</span>
          <span>{{ showFeatureDataForm.createTime }}</span>
        </div>
        <div class="addDataBaseInfo">
          <!-- <i class="el-icon-pie-chart"></i>
          <span class="titleText">所属类别：</span>
          <span class="belongType">{{ showFeatureDataForm.classPath }}</span> -->
        </div>
      </div>
      <div class="addDataClass" style="margin-top: 20px">
        <div class="addDataTitle">
          <i class="el-icon-connection"></i>&nbsp;&nbsp;特征选择
        </div>
        <div style="margin-top: 20px">
          <el-button type="primary" plain icon="el-icon-plus" style="margin-right: 8px"
            @click="putToAddDataForm">添加新条件</el-button>
          <el-button @click="chooseCharacter(addDataForm.characterList[0])"
            style="margin-right: 8px; margin-left: 0px">{{ addDataForm.characterList[0].button }}</el-button>
          <span v-if="addDataForm.characterList[0].type === 'discrete'">
            <el-select :value="'='" slot="prepend" placeholder="运算符" style="width: 90px; margin-right: 8px" disabled>
              <el-option label="=" value="="></el-option>
            </el-select>
            <el-select v-model="addDataForm.characterList[0].value" placeholder="请选择特征取值" style="width: 300px">
              <el-option v-for="item in addDataForm.characterList[0].range" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </span>
          <span v-else>
            <el-select v-model="addDataForm.characterList[0].computeOpt" slot="prepend" placeholder="运算符"
              style="width: 90px; margin-right: 8px">
              <el-option label=">" value=">"></el-option>
              <el-option label="<" value="<"></el-option>
              <el-option label="=" value="="></el-option>
            </el-select>
            <el-input v-model="addDataForm.characterList[0].value" placeholder="请输入特征取值"
              style="width: 300px"></el-input>
            <span style="width: 200px; color: #858585">
              单位：{{ addDataForm.characterList[0].unit }}</span>
          </span>
        </div>
        <div style="margin-top: 20px" v-for="(characterItem, index) in addDataForm.characterList.slice(1)" :key="index">
          <el-select v-model="characterItem.opt" slot="prepend" placeholder="条件选择"
            style="width: 130px; margin-right: 8px">
            <el-option label="AND" value="0"></el-option>
            <el-option label="OR" value="1"></el-option>
            <el-option label="NOT" value="2"></el-option>
          </el-select>
          <el-button @click="chooseCharacter(characterItem)" style="width: 130px; margin-right: 8px">{{
          characterItem.button }}</el-button>
          <span v-if="characterItem.type === 'discrete'">
            <el-select :value="'='" slot="prepend" placeholder="运算符" style="width: 90px; margin-right: 8px" disabled>
              <el-option label="=" value="="></el-option>
            </el-select>
            <el-select v-model="characterItem.value" placeholder="请选择特征取值" style="width: 300px">
              <el-option v-for="item in characterItem.range" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </span>
          <span v-else>
            <el-select v-model="characterItem.computeOpt" slot="prepend" placeholder="运算符"
              style="width: 90px; margin-right: 8px">
              <el-option label=">" value=">"></el-option>
              <el-option label="<" value="<"></el-option>
              <el-option label="=" value="="></el-option>
            </el-select>
            <el-input v-model="characterItem.value" placeholder="请输入特征取值" style="width: 300px"></el-input>
            <span style="width: 200px; color: #858585">
              单位：{{ characterItem.unit }}</span>
          </span>
          <el-button type="primary" plain icon="el-icon-delete" style="margin-left: 10px"
            @click="deleteToAddDataForm(characterItem)">删除</el-button>
        </div>
        <div style="
            margin-top: 20px;
            margin-bottom: 10px;
            display: flex;
            justify-content: center;
          ">
          <button class="cool-button" @click="submitCharacterCondition">
            筛选病例
          </button>
        </div>
        <!-- 显示筛选出来的表数据 -->
        <el-table :data="addTableData" stripe style="width: 100%" height="450" v-show="showAddTableData"
          :header-cell-style="{ background: '#eee', color: '#606266' }" v-loading="addDataLoading" element-loading-text="正在抽取数据">
          <el-table-column v-for="(value, key) in addTableData[0]" :key="key" :prop="key" :label="key" width="80"
            sortable>
            <template slot-scope="{ row }">
              <div class="truncate-text">{{ row[key] }}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cleanDataInput()">取 消</el-button>
        <el-button type="primary" @click="addTable()">新建表</el-button>
      </span>
      <el-dialog title="特征选择" :visible.sync="characterVisible" width="50%" append-to-body>
        <el-container>
          <el-aside width="180px">
            <el-menu default-active="1" class="el-menu-vertical-demo">
              <el-menu-item index="1" @click="exchangeCharacterList(0)">
                <span slot="title">人口学</span>
              </el-menu-item>
              <el-menu-item index="3" @click="exchangeCharacterList(2)">
                <span slot="title">生理指标</span>
              </el-menu-item>
              <el-menu-item index="4" @click="exchangeCharacterList(3)">
                <span slot="title">行为学</span>
              </el-menu-item>
            </el-menu>
          </el-aside>
          <el-main>
            <el-radio-group v-model="characterId" class="charactersGroup">
              <el-radio v-for="optItem in characterOptList" :key="optItem.characterId" :label="optItem.characterId"
                border style="
                  margin-bottom: 10px;
                  margin-left: 0px;
                  margin-right: 10px;
                ">{{ optItem.chName }}</el-radio>
            </el-radio-group>
          </el-main>
        </el-container>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="confirmCharacter()">确 定</el-button>
        </span>
      </el-dialog>
    </el-dialog>
    <!--===============================     导入数据表单   ===================================================================-->
    <el-dialog v-loading="loading" :element-loading-text="loadText" id="importDataTable" title="导入数据表"
      :visible.sync="dialogFormVisible" width="40%">
      <el-form :model="dialogForm" ref="dialogFormRef" :rules="dialogForm.rules" label-width="110px">
        <el-form-item label="选择数据表" prop="filesInfo">
          <el-upload action="" class="upload" ref="uploadRef" :on-preview="handlePreview" :on-remove="handleRemove"
            :on-change="changeFile" :auto-upload="false" accept=".csv" :limit="1" :multiple="false"
            :file-list="dialogForm.filesInfo" :http-request="(data) => {
          upRequest(data);
        }
          ">
            <el-button slot="trigger" size="small" type="success">选取文件</el-button>
            <div slot="tip" class="el-upload__tip">只能上传csv文件</div>
          </el-upload>
        </el-form-item>

        <el-form-item label="数据表名称" prop="tableName">
          <el-input v-model="dialogForm.tableName" placeholder="请输入数据表名称"></el-input>
        </el-form-item>
        <el-form-item label="涉及疾病" prop="dataDisease">
          <el-input v-model="dialogForm.dataDisease" :disabled="true" style="width: 150px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="
          dialogFormVisible = false;
        resetForm('dialogFormRef');
        ">取消</el-button>
        <el-button @click="resetForm('dialogFormRef')">重置</el-button>
        <el-button type="primary" @click="uploadFile">确定</el-button>
      </div>

      <!-- 解析表后字段分类弹窗 -->
      <el-dialog v-loading="loading2" :element-loading-text="loadText2" append-to-body title="请选择多个疾病标签字段"
        :visible.sync="featuresVision" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
        <!-- <el-form class="featureLabel" label-width="auto"> -->
        <el-checkbox-group v-model="labelList">
          <el-checkbox style="width: 250px" border v-for="(name, index) in Object.keys(featuresMap)" :key="index"
            :label="name"></el-checkbox>
        </el-checkbox-group>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="compelete">完成上传</el-button>
        </div>
      </el-dialog>
    </el-dialog>
    <div class="right_table">
      <el-card class="right_table_topCard" :body-style="{ height: '850px' }">
        <div style="height: 30px; padding-left: 5px">
          <h3 style="margin: -20px">数据预览</h3>
        </div>
        <div class="describe_content">
          <p style="margin-top: 0.5%; width: 100%">
            <i class="el-icon-folder"></i> 数据集名称:<span style="font-weight: bold; font-size: 18px; color: #252525">{{
          showDataForm.tableName }}</span>
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
            <!-- <i class="el-icon-folder-opened"></i> 所属类别:<span>{{
            showDataForm.classPath
          }}</span> -->
            <el-button type="success" size="mini" class="change_btn"
              v-if="nodeData.uid === loginUserID && nodeData.status == '0'" @click="changeStatus()">转为共享</el-button>
            <el-button type="success" size="mini" class="change_btn"
              v-if="nodeData.uid === loginUserID && nodeData.status == '1'" @click="changeStatus()">转为私有</el-button>
            <el-button type="primary" @click="csvDialogVisible = true" size="mini" v-if="showDataForm.tableName"
              class="csv_btn">导出数据</el-button>
          </p>
        </div>
        <!-- 显示表数据 -->

        <div class="tableDataCSS" v-loading="table_loading" element-loading-text="数据量较大，拼命加载中"
          element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.05)" ref="listWrap"
          @scroll="scrollListener">
          <div class="tablePlaceholder" v-if="tableData.length < 1 && !table_loading">
            请在左侧选择数据
          </div>
          <div ref="list">
            <el-table v-if="tableData.length > 0" :data="tableData" stripe style="width: 100%" class="custom-table"
              max-height="720" ref="scrollTable" :header-cell-style="{ background: '#eee', color: '#606266' }">
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

      <el-dialog title="请选择要导出的字段" :visible.sync="csvDialogVisible" width="60%" :before-close="handleCloseCSV">
        <div class="selectFeatrueDescribe" style="background-color: #f5f7fa">
          <i class="el-icon-s-help"></i> 字段个数:<span>{{
          fields.length
        }}</span>
          <i class="el-icon-finished" style="margin-left: 50%"></i>
          已选字段个数:<span>{{ selectedFields.length }}</span>
        </div>
        <el-divider></el-divider>
        <el-checkbox v-model="selectAll" @change="handleSelectAll" /> 全选
        <el-checkbox-group v-model="selectedFields">
          <el-checkbox style="width: 150px" v-for="field in fields" :key="field" :label="field">{{ field
            }}</el-checkbox>
        </el-checkbox-group>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleCloseCSV">取 消</el-button>
          <el-button type="primary" @click="toXLSX">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import XLSX from 'xlsx';
import { getRequest, postRequest, saveParentDisease } from "@/api/user";
import { getFetures } from "@/api/feature.js";
import { getCategory, addDisease, removeCate } from "@/api/category";
import { getTableDes, getTableData } from "@/api/tableDescribe.js";
import { mapGetters, mapMutations, mapState, mapActions } from "vuex";
import { resetForm, debounce } from "@/components/mixins/mixin.js";
let id = 1000;

export default {
  mixins: [resetForm, debounce],
  computed: {
    ...mapGetters(["dataDisList", "dataCreatorList"]),
    ...mapState(["dataList"]),
    loginUserID() {
      return sessionStorage.getItem("userid");
    },
    colWidth() {
      let arr = Object.keys(this.tableData[0]);
      if (arr.length <= 15) {
        return 90;
      } else {
        return 65;
      }
    },
    // 获取展示的列表
    showList() {
      return this.tableData.slice(this.start, this.end);
    },
    // 获取列表长度
    length() {
      return this.tableData.length || 0;
    },
  },
  mounted() {
    this.$refs.listWrap.style.height = "720px"; // 设置可视区域的高度
  },
  watch: {
    "dialogForm.tableName"() {
      this.checkTableName();
    },
    "addDataForm.dataName"() {
      this.checkAddTaleName();
    },
    // diseaseName() {
    //   this.checkDiseasename();
    // },
    selectedFields(newValue) {
      // 如果一键全选框被取消选中，且 selectedFeatures 的长度大于 0，则将其置为 false
      this.selectAll = newValue.length === this.fields.length;
    },
    length(val) {
      this.$refs.listWrap.style.height = "720px";
      // // 超过10行数据，就按照最大40*10 400px高度的列表就行
      // if (val >= 10) {
      //   this.$refs.listWrap.style.height = '800px';
      // } else {
      // // 不足10行数据，这边 加57是因为表头的高度，具体情况
      //   this.$refs.listWrap.style.height = this.itemHeight * val + 80 + 'px'
      // }
    },
    filterText(val) {
      this.$refs.tree1?.filter(val);
      this.$refs.tree2?.filter(val);
      this.$refs.tree3?.filter(val);
    }
  },

  data() {
    return {
      treeData1: [],
      treeData2: [],
      treeData3: [],
      tableData: [], //总共的列表数据
      itemHeight: 48, // item高度
      num: 10, // 展示的数据
      start: 0, // 开始索引
      end: 9, // 结束索引
      diseaseNum: 0,
      datasetNum: 0,
      fullData: "",
      showTooltip: false,
      hoverTimer: null,
      dialogDiseaseVisible: false,
      dialogDataVisible: false,
      characterVisible: false,
      showAddTableData: false,
      characterId: 1,
      showDataForm: {
        tableName: "",
        createUser: "",
        createTime: "",
        classPath: "",
        sampleNum: "",
        featureNum: "",
      },

      showFeatureDataForm: {
        tableName: "",
        createUser: "",
        createTime: "",
        classPath: "",
      },
      addDataForm: {
        dataName: "",
        createUser: "",
        createTime: "",
        path: "",
        characterList: [
          {
            opt: "",
            characterId: -1,
            featureName: "",
            chName: "",
            type: "",
            unit: "",
            range: "",
            button: "点击选择特征",
            value: "",
            computeOpt: "",
          },
        ],
      },
      addDataLoading: false,
      characterOptList: [],
      addTableData: [],
      input3: "",
      select: "",

      dialogDiseaseVisible2: false,

      nodeData: {},

      diseaseName: "",
      diseaseNameisOnly: true,
      loading: false,
      loading2: false,
      getData_loading: false,
      loadText: "拼命加载中",
      loadText2: "拼命加载中",
      disease: "",
      creator: "",
      featuresVision: false,
      DatadialogVisible: false,
      featuresMap: {},
      patientTable: [],
      dialogForm: {
        filesInfo: [],
        tableName: "",
        isOnly: true,
        dataDisease: "",
        fields: [{ name: "", type: "" }],
        rules: {
          tableName: [
            {
              required: true,
              message: "数据表名称不能为空",
              trigger: "change",
            },
          ],
          dataDisease: [
            {
              required: true,
              message: "涉及疾病不能为空",
              trigger: "blur",
            },
          ],
          numFeatures: [
            { required: true, message: "特征个数不能为空", trigger: "blur" },
            { type: "integer", message: "特征个数需为整数", trigger: "blur" },
            { min: 1, message: "特征个数需>1", trigger: "blur" },
          ],
        },
      },
      dialogFormVisible: false,
      options: {
        method: "post",
        data: {},
        url: "/DataTable/upload",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
      csvDialogVisible: false,
      selectedFields: [],
      selectAll: false,
      fields: [],
      labelList: [],
      table_loading: false,
      filterText: '',
      compelete_node:{},
      compelete_userId:'',
      compelete_size:'',
      compelete_tableDescribe:{}      
    };
  },

  created() {
    this.checkAddTaleName = this.debounce(() => {
      getRequest("/api/DataTable/inspection", {
        newname: this.addDataForm.dataName,
      }).then((res) => {
        console.log(res);
        // 上一次重复了这一次不重复就要提醒一下
        if (!this.dialogForm.isOnly && res.data) {
          this.$message({
            showClose: true,
            message: "表名可用",
            type: "success",
          });
        }
        if (typeof res.data === "boolean") {
          this.dialogForm.isOnly = res;
        }
        if (!res.data) {
          this.$message({
            showClose: true,
            message: "数据表重名，请重新填写",
            type: "warning",
          });
          return false;
        }
        return true;
      });
    }, 200);
    this.checkTableName = this.debounce(() => {
      getRequest("/api/DataTable/inspection", {
        newname: this.dialogForm.tableName,
      }).then((res) => {
        console.log(res);
        // 上一次重复了这一次不重复就要提醒一下
        if (!this.dialogForm.isOnly && res.data) {
          this.$message({
            showClose: true,
            message: "表名可用",
            type: "success",
          });
        }
        if (typeof res.data === "boolean") {
          this.dialogForm.isOnly = res;
        }
        if (!res.data) {
          this.$message({
            showClose: true,
            message: "数据表重名，请重新填写",
            type: "warning",
          });
          return false;
        }
        return true;
      });
    }, 200);
    this.getCatgory();
  },

  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
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
    handleSelectAll() {
      if (this.selectAll) {
        this.selectedFields = this.fields.filter((feature) => feature);
      } else {
        // 如果一键全选按钮未选中，则清空已选择数组
        this.selectedFields = [];
      }
    },
    handleCloseCSV() {
      this.selectedFields = [];
      this.csvDialogVisible = false;
    },
    toXLSX() {
      // 发送请求给后端，传递表名和选定的字段
      getRequest(`/api/getInfoByTableName/${this.showDataForm.tableName}`).then(
        (res) => {
          //二维数组 包含表头以及每一行数据
          const final_data = [];
          final_data.push(this.selectedFields);
          const data = res.data;
          // 构建数据行
          const rows = data
            .map((row) => {
              const values = this.selectedFields.map((field) => {
                return this.formatCSVValue(row[field]);
              });
              return values.join(",");
            });
            rows.forEach(row => {
              //将每一行数据转换为列表
              row = row.split(",");
              final_data.push(row);
          });
          const ws = XLSX.utils.aoa_to_sheet(final_data);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
          XLSX.writeFile(wb, this.showDataForm.tableName+'.xlsx');
          this.csvDialogVisible = false;
          this.selectedFields = [];
        }
      );
    },
    formatCSVValue(value) {
      // 处理特殊字符
      if (
        typeof value === "string" &&
        (value.includes(",") || value.includes("\n"))
      ) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    },

    //多标签上传
    compelete() {
      // 判断多标签合理性，并填写上传payload
      let labelCount = 0;
      const payload_feature = {
        tableName: this.dialogForm.tableName,
        tableHeaders: [],
        userID:this.compelete_userId,
        node:this.compelete_node,
        size:this.compelete_size,
        tableDescribe:this.compelete_tableDescribe
      };
      for (const key in this.featuresMap) {
        if (Object.hasOwnProperty.call(this.featuresMap, key)) {
          const tempObject = {
            fieldName: key,
            isLabel: 0,
          };
          if (this.labelList.includes(key)) {
            tempObject.isLabel = 1;
            labelCount++;
          }
          payload_feature.tableHeaders.push(tempObject);
        }
      }
      if (labelCount < 2) {
        this.$message({
          showClose: true,
          type: "warning",
          message: "请至少设置两个标签特征",
        });
        return false;
      }

      this.loadText2 = "正在打标";
      this.loading2 = true;

      postRequest("/tTable/insertTableManager", payload_feature).then((res) => {
        if (res.code == 200) {
          this.loading2 = false;
          this.featuresVision = false;
          this.$message({
            showClose: true,
            type: "success",
            message: "完成",
          });
          this.getCatgory();
        }
      });
    },

    changeLabel(name, label) {
      console.log("name: ");
      console.log(name);

      console.log("label:");
      console.log(label);

      this.featuresMap[name] = label;
    },

    confirmCharacter() {
      this.characterVisible = false;
      let index = this.addDataForm.characterList.indexOf(this.characterOptItem);
      let oldObj = this.addDataForm.characterList[index];
      for (let i = 0; i < this.characterOptList.length; i++) {
        let a = this.characterOptList[i];
        if (this.characterId == a.characterId) {
          oldObj.characterId = a.characterId;
          oldObj.featureName = a.featureName;
          oldObj.chName = a.chName;
          oldObj.type = a.type;
          oldObj.unit = a.unit;
          oldObj.range = a.range;
          oldObj.button = a.chName;
          oldObj.value = "";
          oldObj.opt = a.opt;
        }
      }
      this.addDataForm.characterList[index] = oldObj;
      console.log(this.addDataForm.characterList);
      this.characterId = "";
    },

    // 数据表上传函数
    upRequest(data) {
      console.log("开始上传文件");
      const payload = new FormData();

      payload.append("file", data.file);
      payload.append("newName", this.dialogForm.tableName);
      payload.append("disease", this.dialogForm.dataDisease);
      payload.append("user", sessionStorage.getItem("username"));
      payload.append("uid", sessionStorage.getItem("userid"));
      payload.append("parentId", this.nodeData.id);
      payload.append("parentType", this.nodeData.label);
      payload.append("status", this.nodeData.status);
      payload.append(
        "size",
        this.$refs["uploadRef"].uploadFiles[0].size / 100000
      );
      payload.append("is_upload", "1");
      payload.append("is_filter", "0");
      this.options = {
        method: "post",
        data: payload,
        url: "api/dataTable/upload",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      // 多疾病下的上传文件需要打标签，用不同的接口
      let paths = this.nodeData.label;
      if (paths === "多疾病") {
        this.options.url = "api/dataTable/parseAndUpload";
      }

      this.$axios(this.options).then((res) => {
        console.log(this.options.data.get("uid"));
        // 返回表头信息
        this.loading = false;
        console.log(res);
        if (res?.code == "200") {
          this.$message({
            showClose: true,
            type: "success",
            message: "解析成功",
          });
          let featureList = res.data.featureList;
          this.compelete_userId = res.data.userId;
          this.compelete_node = res.data.node;
          this.compelete_size = res.data.size;
          this.compelete_tableDescribe = res.data.tableDescribe;
          console.log(featureList);
          //把特征存为map的键
          for (const item of featureList) {
            this.$set(this.featuresMap, item, "diagnosis");
          }
          if (paths === "多疾病") {
            this.featuresVision = true;
          }
          this.dialogFormVisible = false;
          this.getCatgory();
        } else {
          this.$message({
            showClose: true,
            type: "error",
            message: "解析失败",
          });
        }
      });
    },
    getCatgory() {
      getCategory(`/api/category?uid=${this.loginUserID}`).then((response) => {
        this.treeData1 = response.data.slice(0, 1);
        this.treeData2 = response.data.slice(1, 2);
        this.treeData3 = response.data.slice(2, 3);
        // 获取病种和数据集总数
        this.diseaseNum = response.data[0].children.length;
        getRequest("/api/getTableNumber").then((res) => {
          if (res.code == 200) this.datasetNum = res.data;
        });
      });
    },
    uploadFile() {
      if (this.$refs["uploadRef"].uploadFiles.length < 1) {
        this.$message({
          showClose: true,
          type: "warning",
          message: "请选择数据表",
        });
        return false;
      }
      this.checkTableName();
      if (!this.dialogForm.isOnly) {
        return false;
      }
      this.$refs["dialogFormRef"].validate((valid) => {
        if (valid) {
          this.loadText = "正在上传并解析文件";
          this.loading = true;
          this.$refs.uploadRef.submit();
          // this.resetForm('dialogFormRef');
        }
      });
    },
    getTableDescribe(id, label) {
      this.showDataForm.tableName = label;
      getTableDes("/api/tableDescribe", id)
        .then((response) => {
          let res = JSON.parse(response.data);
          this.showDataForm.createUser = res.createUser;
          this.showDataForm.createTime = res.createTime;
          this.showDataForm.classPath = res.classPath;
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
          const fields = Object.keys(this.tableData[0]);
          this.fields = fields;
          this.showDataForm.sampleNum = this.tableData.length;
          this.showDataForm.featureNum = this.fields.length;
          this.table_loading = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    changeData(data) {
      if (data.isLeafs == 1) {
        this.showDataForm.featureNum = "";
        this.showDataForm.sampleNum = "";
        //获取描述信息
        this.getTableDescribe(data.id, data.label);
        //获取数据信息
        this.table_loading = true;
        this.tableData = [];
        this.getTableData(data.id, data.label);
        this.nodeData = data;
        console.log(this.nodeData);
      }
    },
    append(isLeaf) {
      if (this.diseaseNameisOnly == false) {
        return false;
      }
      // 发送请求新增一个病种信息（目录结构）
      let catagoryNode = {
        label: this.diseaseName,
        catLevel: this.nodeData.catLevel + 1,
        parentId: this.nodeData.id,
        isLeafs: isLeaf,
        isCommon: this.nodeData.isCommon,
        path: this.nodeData.path + "/" + this.diseaseName,
        isDelete: 0,
        children: [],
      };

      let catagoryNodeJSON = JSON.stringify(catagoryNode);
      addDisease("/api/addDisease", catagoryNodeJSON)
        .then((response) => {
          this.getCatgory(); //刷新目录结构
          console.log(response.data);
        })
        .catch((error) => {
          alert("新增疾病目录错误" + error);
        });
      this.nodeData = {};
      this.cleanInput();
      this.dialogDiseaseVisible = false;
    },
    appendCommon() {
      const newChild = {
        id: id++,
        label: this.diseaseName,
        children: [],
        isLeafs: false,
        isCommon: true,
      };
      if (!this.nodeData.children) {
        this.$set(this.nodeData, "children", []);
      }
      this.nodeData.children.push(newChild);
      this.nodeData = {};
      this.cleanInput();
    },
    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex((d) => d.id === data.id);
      children.splice(index, 1);
      removeCate("/api/category/remove", data)
        .then((response) => {
          // data就是要删除的目录信息
          console.log(response.data);
          this.showDataForm = {};
          this.tableData = [];
          this.nodeData = {};
          this.getCatgory();
        })
        .catch((error) => {
          console.log(error);
        });
    },

    addDisease() {
      console.log("name:", this.diseaseName);
      let diseaseName = this.diseaseName;
      saveParentDisease("/api/addParentDisease", diseaseName)
        .then((response) => {
          this.getCatgory();
          this.cleanInput();
        })
        .catch((error) => {
          console.log(error);
        });
      // const newNode = { id: id++, label: this.diseaseName, children: [] , isLeafs: false};
      // this.treeData.push(newNode);
    },

    handleCheckChange(data, checked) {
      if (checked) {
        this.$refs.tree.setCheckedKeys([data.id]);
      }
    },

    markNode(data) {
      console.log(data);
      this.nodeData = data;
    },

    cleanInput() {
      this.dialogDiseaseVisible = false;
      this.dialogDiseaseVisible2 = false;
      this.diseaseName = "";
    },
    cleanDataInput() {
      this.dialogDataVisible = false;
    },
    addTable() {
      // 创建表
      this.diseaseName = this.addDataForm.dataName;
      this.dialogDataVisible = false;
      let filterConditions = {};
      filterConditions.addDataForm = this.addDataForm;
      filterConditions.nodeData = this.nodeData;
      console.log(filterConditions);
      this.options = {
        method: "post",
        data: filterConditions,
        url: "api/createTable",
        headers: {
          "Content-Type": "application/json",
        },
      };
      this.$axios(this.options).then((res) => {
        this.getCatgory();
      });
    },
    putToAddDataForm() {
      let number = -Math.floor(Math.random() * 100);
      let item = {
        opt: "",
        characterId: -1,
        featureName: "",
        chName: "",
        type: "",
        unit: "",
        range: "",
        removeIndex: number,
        button: "点击选择特征",
        value: "",
        computeOpt: "",
      };
      this.addDataForm.characterList.push(item);
    },
    deleteToAddDataForm(item) {
      let index = this.addDataForm.characterList.indexOf(item);
      if (index !== -1) {
        this.addDataForm.characterList.splice(index, 1);
      }
    },
    chooseCharacter(item) {
      this.exchangeCharacterList(0);
      this.characterVisible = true;
      this.characterOptItem = item;
    },
    submitCharacterCondition() {
      // console.log("this.addDataForm.characterList");
      // console.log(this.addDataForm.characterList);
      this.showAddTableData = true;
      this.addDataLoading = true;
      
      let filterConditions = {};
      filterConditions.addDataForm = this.addDataForm;
      filterConditions.nodeData = this.nodeData;
      this.options = {
        method: "post",
        data: filterConditions,
        url: "api/filterTableData",
        headers: {
          "Content-Type": "application/json",
        },
      };
      // console.log("请求参数：" + JSON.stringify(filterConditions));
      this.$axios(this.options)
        .then((res) => {
          this.addTableData = res.data;
          // console.log("数据:");
          // console.log(this.addTableData);
          // this.showAddTableData = true;
          this.addDataLoading = false;
        })
        .catch((error) => {
          this.$message.error("获取数据失败");
          console.log("获取数据失败" + error);
          this.addDataLoading = false;
        });
      let s = JSON.stringify(this.addDataForm.characterList, null, 2);
      console.log("this.addDataForm:");
      console.log(this.addDataForm);
      console.log(s);
    },
    getNowDateFormat() {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const day = String(currentDate.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    openAddDataForm(type) {
      this.addDataForm = {
        dataName: "",
        uid: sessionStorage.getItem("userid"),
        username: sessionStorage.getItem("username"),
        createUser: sessionStorage.getItem("username"),
        isUpload: "0",
        isFilter: "1",
        characterList: [
          {
            opt: "",
            characterId: -1,
            featureName: "",
            chName: "",
            type: "",
            unit: "",
            range: "",
            button: "点击选择特征",
            value: "",
            computeOpt: "",
          },
        ],
      };
      this.dialogDataVisible = true;
      this.showAddTableData = false;
      this.showFeatureDataForm.createUse = sessionStorage.getItem("username");
      this.showFeatureDataForm.createTime = this.getNowDateFormat();
      this.showFeatureDataForm.classPath = type;
    },
    exchangeCharacterList(index) {
      getFetures("/api/feature/getFeatures", index)
        .then((response) => {
          console.log("特征为：");
          console.log(response.data);
          this.characterOptList = response.data;
          console.log(this.characterList);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    ...mapMutations(["SetDataList"]),
    ...mapActions(["getDataList"]),
    getData(tablename) {
      this.DatadialogVisible = true;
      this.getData_loading = true;
      getRequest("/DataTable/getInfoByTableName", {
        tableName: tablename,
      }).then((res) => {
        this.patientTable = res.data;
        console.log("patientTable:" + res.data);
        this.getData_loading = false;
      });
    },

    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(row) {
      postRequest(`DataTable/delete/${row.id}`).then((res) => {
        this.SetDataList(res.reverse());
      });
    },
    clearFilter() {
      this.disease = "";
      this.creator = "";
    },
    importData() {
      // 涉及疾病填入上一级节点名
      this.dialogForm.dataDisease = this.nodeData.label;
      this.dialogFormVisible = true;
    },

    handleSubmit() {
      console.log("文件上传中...");
    },

    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    beforeUpload(file) {
      //上传前的验证
      const isCSV =
        file.type === "text/csv" || file.type === "application/vnd.ms-excel";
      // const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isCSV) {
        this.$message.error("上传文件仅支持 CSV 格式");
      }
      // if (!isLt2M) {
      //     this.$message.error('上传文件大小不能超过 2MB!');
      // }
      // return isJPG && isLt2M;
      return isCSV;
    },

    removeFileExtension(fileName) {
      // 寻找最后一个点号的位置
      const lastDotIndex = fileName.lastIndexOf(".");

      // 如果找到了点号并且不在文件名的开头或结尾
      if (
        lastDotIndex !== -1 &&
        lastDotIndex < fileName.length - 1 &&
        lastDotIndex > 0
      ) {
        // 返回删除了后缀的文件名部分
        return fileName.substring(0, lastDotIndex);
      } else {
        // 如果没有找到点号或者点号在文件名的开头或结尾，直接返回原文件名
        return fileName;
      }
    },

    changeFile() {
      if (this.dialogForm.tableName.length < 1) {
        this.dialogForm.tableName = this.removeFileExtension(
          this.$refs["uploadRef"].uploadFiles[0].name
        );
      }
    },

    changeStatus() {
      getRequest("/api/changeStatus", this.nodeData)
        .then((response) => {
          if (response.code == 200) {
            this.getCatgory();
            this.tableData = [];
            this.nodeData = {};
            this.$message.success("操作成功");
            //获取数据信息
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style scoped>
.content {
  position: relative;
  width: 100%;
  height: 820px;
}

#top_buttons>* {
  display: inline-block;
}

.truncate-text {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

#DiseaseFilter {
  margin-right: 40px;
}

#creatorFilter {
  margin-right: 20px;
}

#top_right_buttons {
  float: right;
  margin-right: 100px;
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

#table {
  margin-top: 10px;
}

.tablePlaceholder {
  height: 100%;
  text-align: center;
  line-height: 600px;
  background-color: rgba(179, 178, 178, 0.144);
  font-weight: bold;
  color: rgba(58, 57, 57, 0.651);
  user-select: none;
}

.featureLabel {
  height: 55vh;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  overflow: auto;
}

.featureLabel .el-form-item__label {
  color: #252525;
}

.left_tree {
  display: inline-block;
  height: 820px;
  width: 18%;
  border-radius: 3px;
  border: 1px solid #e6e6e6;
  overflow: auto;
}

.treeArea{
  height: calc(820px - 93px);/* 93px是头部信息和按钮的高度 */
  overflow: auto;
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
  width: 12em;
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
    transform: translateX(calc(-100% + 12em));
  }
  100% {
    transform: translateX(calc(-100% + 12em));
  }
}

.right_table {
  display: inline-block;
  height: 820px;
  width: 82%;
  position: absolute;
  /* border: none; */
  /* overflow-y: auto; */
}

.right_table_topCard {
  padding: 0;
  height: 820px;
  width: 95%;
  border-radius: 3px;
  border-bottom: 1px solid #e6e6e6;
  position: relative;
  /* top: 2%; */
  left: 1%;
  /* overflow-y: auto; */
}

.describe_content {
  display: inline-block;
  position: relative;
  width: 100%;
  margin-bottom: 20px;
}

.describe_content span {
  margin: 10px;
}

.add_button {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
}

.nameInput {
  width: 70%;
}

.addDataClass {
  width: calc(1150px * 0.94);
  border-radius: 10px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  padding: 10px;
  font-size: 16px;
}

.addDataClass:first-child {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-items: start;
  row-gap: 10px;
}

.addDataClass .addDataBaseInfo .titleText {
  font-weight: 600;
  margin-left: 5px;
}

.addDataClass .addDataBaseInfo:last-child {
  grid-column-start: 1;
  grid-column-end: 4;
}

.addDataBaseInfo.createTimeArea {
  line-height: 40px;
  vertical-align: text-bottom;
}

.addDataClass .el-input {
  width: 160px;
}

/* .addDataClass .addDataBaseInfo {
  margin-left: 50px;
} */

.addDataClass .addDataTitle {
  margin-top: 10px;
  margin-right: 15px;
  padding-bottom: 10px;
  font-size: 18px;
  border-bottom: 1px solid #ebeef5;
}

.el-select .el-input {
  width: 130px;
}

.input-with-select .el-input-group__prepend {
  background-color: #fff;
}

.cool-button {
  display: inline-block;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: bold;
  color: #fff;
  background: linear-gradient(to right, #26acdf, #3ee09a);
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  width: 200px;
  letter-spacing: 1px;
  cursor: pointer;
}

.cool-button::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.1);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
  z-index: -1;
}

.cool-button:hover {
  background: linear-gradient(to right, #51bae2, #80e7bb);
}

.cool-button:hover::before {
  transform: scaleX(1);
}

.custom-table tr {
  background-color: #dcf3fc !important;
}

.tableDataCSS {
  width: 100%;
  /* 因为listWrap设置高度，这里的height会失效 */
  /* height: 900px; */
}

.csv_btn {
  position: absolute;
  right: 2%;
  top: 5%;
}

.change_btn {
  position: absolute;
  right: 10%;
  top: 5%;
}

.charactersGroup {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-content: flex-start;
  height: 500px;
  overflow: auto;
}
</style>
