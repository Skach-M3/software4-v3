<template>
  <div>
    <el-row :gutter="20">
      <div class="grid-content">
        <el-select
          v-model="type"
          class="search_input"
          default-first-option
          placeholder="请选择搜索类型"
        >
          <el-option
            v-for="item in searchTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>

        <el-input
          placeholder="输入信息进行模糊搜索"
          v-model="searchByName"
          class="search_input"
          clearable
          @clear="getAllAdminDataTable()"
        >
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>

        <el-button
          icon="el-icon-search"
          circle
          class="search_btn"
          @click="getAdminDataTableByName()"
        ></el-button>
      </div>
    </el-row>

    <el-divider></el-divider>

    <el-card class="user_list_card">
      <div slot="header" class="clearfix">
        <span>数据信息</span>
        <el-button
          type="success"
          round
          style="margin-left: 90%"
          @click="uploadDataDialogVisible = true"
        >
          <i class="el-icon-upload"></i>上传数据集</el-button
        >
      </div>

      <el-table
        class="el-table"
        :data="displayedAdminDataManageList"
        stripe
        style="width: 100%"
      >
        <el-table-column prop="id" label="id" width="200"> </el-table-column>
        <el-table-column prop="tableName" label="数据表名称" width="180">
        </el-table-column>
        <el-table-column prop="createUser" label="创建用户" width="180">
        </el-table-column>
        <el-table-column prop="classPath" label="所属类别" width="250">
          <!-- <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.role == '0'">管理员</el-tag>
                        <el-tag v-if="scope.row.role == '1'">普通用户</el-tag>
                    </template> -->
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180">
        </el-table-column>
        <el-table-column prop="tableStatus" label="数据表状态" width="100">
        </el-table-column>
        <el-table-column prop="tableSize" label="数据表大小" width="250">
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              @click="
                getEditDataById(
                  scope.row.id,
                  scope.row.tableName,
                  scope.row.tableStatus
                )
              "
            ></el-button>
            <el-popconfirm
              confirm-button-text="确定"
              cancel-button-text="取消"
              icon="el-icon-info"
              icon-color="red"
              title="确定删除该数据表吗？"
              @confirm="
                deleteAdminDataManage(
                  scope.row.id,
                  scope.row.uid,
                  scope.row.tableId,
                  scope.row.tableSize,
                  scope.row.tableName
                )
              "
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                slot="reference"
                style="margin-left: 10px"
              ></el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="this.params.page"
        :page-sizes="[6, 9, 12, 15, 24]"
        :page-size="this.params.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.total"
        style="margin-top: 2%; margin-left: 3%"
      >
      </el-pagination>
    </el-card>

    <el-dialog
      v-loading="loading"
      :element-loading-text="loadText"
      id="importDataTable"
      title="导入数据表"
      :visible.sync="uploadDataDialogVisible"
      width="40%"
    >
      <el-form
        :model="dialogForm"
        ref="dialogFormRef"
        :rules="dialogForm.rules"
        label-width="110px"
      >
        <el-form-item label="选择数据表" prop="filesInfo">
          <el-upload
            action=""
            class="upload"
            ref="uploadRef"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-change="changeFile"
            :auto-upload="false"
            accept=".csv"
            :limit="1"
            :multiple="false"
            :file-list="dialogForm.filesInfo"
            :http-request="
              (data) => {
                upRequest(data);
              }
            "
          >
            <el-button slot="trigger" size="small" type="success"
              >选取文件</el-button
            >
            <div slot="tip" class="el-upload__tip">只能上传csv文件</div>
          </el-upload>
        </el-form-item>

        <el-form-item label="数据表名称" prop="tableName">
          <el-input
            v-model="dialogForm.tableName"
            placeholder="请输入数据表名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="涉及一级疾病">
          <el-select
            v-model="dialogForm.dataDisease"
            filterable
            placeholder="请选择或搜索"
          >
            <el-option
              v-for="item in disOptions.firstSelect"
              :key="item.label"
              :label="item.label"
              :value="item.label"
              @click.native="getLevel3ById(item.id)"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="涉及二级疾病">
          <el-select
            v-model="dialogForm.dataDisease2"
            filterable
            placeholder="请选择或搜索"
          >
            <el-option
              v-for="item in disOptions.secondSelect"
              :key="item.label"
              :label="item.label"
              :value="item.label"
              @click.native="setPid(item.id)"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog()">取 消</el-button>
        <el-button type="primary" @click="uploadFile">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑数据信息" :visible.sync="editAdminDataManageVisible">
      <el-form :model="adminDataManageForm" ref="editUserRef">
        <el-form-item label="id" label-width="120">
          <el-input
            v-model="adminDataManageForm.id"
            autocomplete="off"
            disabled
            size="medium"
          ></el-input>
        </el-form-item>

        <el-form-item label="数据表名称" label-width="120">
          <el-input
            v-model="adminDataManageForm.tableName"
            autocomplete="off"
            size="medium"
          ></el-input>
        </el-form-item>
        <el-form-item label="创建用户" label-width="120">
          <el-input
            v-model="adminDataManageForm.createUser"
            autocomplete="off"
            disabled
            size="medium"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属类别" label-width="120">
          <el-input
            v-model="adminDataManageForm.classPath"
            autocomplete="off"
            disabled
            size="medium"
          ></el-input>
        </el-form-item>
        <el-form-item label="发布时间" label-width="120">
          <el-input
            v-model="adminDataManageForm.createTime"
            autocomplete="off"
            disabled
            size="medium"
          ></el-input>
        </el-form-item>
        <!-- 0私有 1共享 2公用 -->
        <el-form-item
          label="数据集状态"
          label-width="120"
          v-if="
            adminDataManageForm.tableStatus == 0 ||
            adminDataManageForm.tableStatus == 2
          "
        >
          <el-input
            v-model="status[adminDataManageForm.tableStatus]"
            autocomplete="off"
            disabled
            size="medium"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="是否取消共享"
          label-width="120"
          v-if="adminDataManageForm.tableStatus == 1"
        >
          <el-select v-model="is_cancel" placeholder="请选择">
            <el-option
              v-for="item in statusType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="数据表大小" label-width="120">
          <el-input
            v-model="adminDataManageForm.tableSize"
            autocomplete="off"
            disabled
            size="medium"
          ></el-input>
        </el-form-item>

        <!-- <el-form-item label="用户权限" label-width="120">
                    <el-select v-model="showUserForm.role" placeholder="请选择">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editAdminDataManageVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmEditAdminDataManage()"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRequest } from "@/api/user";
import { resetForm, debounce } from "@/components/mixins/mixin";
export default {
  mixins: [resetForm, debounce],

  watch: {
    "dialogForm.tableName"() {
      this.checkTableName();
    },
  },
  computed: {
    displayedAdminDataManageList() {
      const startIndex = (this.params.page - 1) * this.params.size;
      const endIndex = startIndex + this.params.size;
      return this.adminDataManageList.slice(startIndex, endIndex);
    },
  },

  data() {
    return {
      type: "",
      searchByName: "",
      tableName: "",
      searchTypes: [
        {
          value: "table_name",
          label: "数据表名",
        },
        {
          value: "create_user",
          label: "用户名",
        },
        {
          value: "class_path",
          label: "疾病名称",
        },
      ],

      total: 0,
      params: {
        page: 1,
        size: 9,
      },

      adminDataManageList: [],

      uploadDataDialogVisible: false,
      pid: "",
      loading: false,
      loadText: "拼命加载中",
      disOptions: {
        firstSelect: [],
        secondSelect: [],
      },
      dialogForm: {
        filesInfo: [],
        tableName: "",
        isOnly: true,
        dataDisease: "",
        dataDisease2: "",
        featuresNum: 1,
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

      editAdminDataManageVisible: false,
      oldTableName: "",
      adminDataManageForm: {
        id: "",
        tableId: "",
        tableName: "",
        createUser: "",
        uid: "",
        tableStatus: "",
        tableSize: 0,
      },

      status: {
        0: "私有数据集",
        2: "公共数据集",
      },
      is_cancel: "1",
      statusType: [
        {
          value: "0",
          label: "是",
        },
        {
          value: "1",
          label: "否",
        },
      ],
    };
  },

  created() {
    this.init();
    this.getAllAdminDataTable();

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
  },

  methods: {
    init() {
      getRequest(`/api/getLevel2Label`).then((res) => {
        if (res.code == 200) {
          // console.log("ret data", res.data);
          this.disOptions.firstSelect = res.data;
          // console.log(res.data);
        }
      });
    },

    getLevel3ById(pid) {
      this.dialogForm.dataDisease2 = "";
      getRequest(`/api/getLabelByPid`, {
        pid: pid,
      }).then((res) => {
        if (res.code == 200) {
          console.log("secondSelect", res.data);
          this.disOptions.secondSelect = res.data;
        }
      });
    },
    setPid(pid) {
      this.pid = pid;
    },

    getAllAdminDataTable() {
      this.type = "";
      getRequest(`/api/selectAdminDataManage`).then((res) => {
        if (res.code == 200) {
          console.log("ret data", res.data);
          this.total = res.data.total;
          this.adminDataManageList = res.data.list;
        } else {
          console.logt("res", res.data);
        }
      });
    },

    getAdminDataTableByName(type) {
      if (this.type === "") {
        this.$message({
          type: "warning",
          message: "请在下拉框中选择一个搜索类型",
        });
        return;
      }
      if (this.searchByName === "") {
        this.$message({
          type: "warning",
          message: "请输入内容进行搜索",
        });
        return;
      }

      // 这里的type跟数据库的字段一致 table_name create_user class_path
      getRequest(`/api/selectDataByName`, {
        searchType: this.type,
        name: this.searchByName,
      }).then((res) => {
        if (res.code == 200) {
          console.log("ret data", res.data);
          this.total = res.data.total;
          this.adminDataManageList = res.data.list;
        } else {
          console.logt("res", res.data);
        }
      });
    },

    handleSizeChange(val) {
      this.params.size = val;
    },

    handleCurrentChange(val) {
      this.params.page = val;
    },
    // 数据表上传函数
    upRequest(data) {
      if (this.dialogForm.dataDisease === "") {
        this.$message({
          type: "warning",
          message: "请选择该数据表应该在什么一级病种",
        });
        return;
      }
      if (this.dialogForm.dataDisease2 === "") {
        this.$message({
          type: "warning",
          message: "请选择该数据表应该在什么二级病种",
        });
        return;
      }
      console.log("开始上传文件");

      const fileSize = data.file.size;
      const fileSizeInMB = fileSize / 100000;
      console.log("fileSize", fileSize, fileSizeInMB);

      const payload = new FormData();
      payload.append("file", data.file);
      payload.append("pid", this.pid);
      payload.append("tableName", this.dialogForm.tableName);
      payload.append("userName", sessionStorage.getItem("username"));
      payload.append(
        "classPath",
        "公共数据集/" +
          this.dialogForm.dataDisease +
          "/" +
          this.dialogForm.dataDisease2 +
          "/" +
          this.dialogForm.tableName
      );
      payload.append("uid", sessionStorage.getItem("userid") - 0);

      payload.append("tableStatus", "2");
      payload.append("tableSize", fileSizeInMB);
      payload.append("current_uid", sessionStorage.getItem("userid") - 0);

      this.options = {
        method: "post",
        data: payload,
        url: "/api/uploadDataTable",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      this.$axios(this.options).then((res) => {
        // 返回表头信息
        this.loading = false;
        console.log(res);
        if (res?.code == "200") {
          this.$message({
            showClose: true,
            type: "success",
            message: "解析成功",
          });
          // this.featuresVision = true;
          this.uploadDataDialogVisible = false;
          this.getAllAdminDataTable();
        } else {
          this.$message({
            showClose: true,
            type: "error",
            message: "解析失败",
          });
        }
      });
    },
    uploadFile() {
      if (this.dialogForm.dataDisease === "") {
        this.$message({
          type: "warning",
          message: "请选择该数据表应该在什么一级病种",
        });
        return;
      }
      if (this.dialogForm.dataDisease2 === "") {
        this.$message({
          type: "warning",
          message: "请选择该数据表应该在什么二级病种",
        });
        return;
      }
      console.log("开始上传文件");
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
        }
      });
      // this.getAllAdminDataTable();
    },
    changeFile() {
      console.log(this.$refs["uploadRef"].uploadFiles);
      if (this.dialogForm.tableName.length < 1) {
        this.dialogForm.tableName = this.removeFileExtension(
          this.$refs["uploadRef"].uploadFiles[0].name
        );
      }
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

    addTable() {
      // 创建表
      this.diseaseName = this.addDataForm.dataName;
      this.dialogDataVisible = false;
      let filterConditions = {};
      filterConditions.addDataForm = this.addDataForm;
      filterConditions.nodeData = this.nodeData;
      this.options = {
        method: "post",
        data: filterConditions,
        url: "api/createTable",
        headers: {
          "Content-Type": "application/json",
        },
      };
      this.$axios(this.options).then((res) => {
        console.log("数据:");
        console.log(res.data);
      });
      this.append(1);
    },

    closeDialog() {
      this.uploadDataDialogVisible = false;
      this.dialogForm = {
        filesInfo: [],
        tableName: "",
        isOnly: true,
        dataDisease: "",
        featuresNum: 1,
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
      };
    },
    deleteAdminDataManage(id, uid, tableId, tableSize, tableName) {
      console.log("delete:", this.adminDataManageList);
      getRequest(`/api/deleteByTableName`, {
        id: id,
        uid: uid,
        tableId: tableId,
        tableSize: tableSize,
        tableName: tableName,
        current_uid: sessionStorage.getItem("userid") - 0,
      }).then((res) => {
        if (res.code == 200) {
          this.$message.success("删除数据表成功");
          this.getAllAdminDataTable();
        } else {
          this.$message.error("删除数据表失败");
          this.getAllAdminDataTable();
        }
      });
    },

    getEditDataById(id, tableName, tableStatus) {
      this.oldTableName = tableName;
      this.is_cancel = tableStatus;
      getRequest(`/api/selectDataById`, {
        id: id,
      }).then((res) => {
        if (res.code == 200) {
          this.editAdminDataManageVisible = true;
          this.adminDataManageForm = res.data;
          console.log("res.data:", res.data);
        } else {
          this.$message.error("获取用户信息失败");
          this.getAllAdminDataTable();
        }
      });
    },
    confirmEditAdminDataManage() {
      this.adminDataManageForm.tableStatus = this.is_cancel;
      console.log("edit", this.adminDataManageForm.tableStatus);
      getRequest(`/api/updateAdminDataManage`, {
        id: this.adminDataManageForm.id,
        tableid: this.adminDataManageForm.tableId,
        oldTableName: this.oldTableName,
        tableName: this.adminDataManageForm.tableName,
        tableStatus: this.adminDataManageForm.tableStatus,
      }).then((res) => {
        if (res.code == 200) {
          this.$message.success("修改成功");
          this.getAllAdminDataTable();
          // this.pagehelper();
        } else {
          this.$message.error("修改失败");
          this.getAllAdminDataTable();
          // this.pagehelper();
        }
      });
      this.editAdminDataManageVisible = false;
    },
  },
};
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
}
.el-col div:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 4px;
}

.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.search_input {
  margin-left: 5%;
  width: 20%;
}

.search_btn {
  margin-left: 1%;
}
</style>
