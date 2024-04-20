<template>
  <div>
    <div class="searchByCondition">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="筛选用户权限">
          <el-select v-model="formInline.role" placeholder="用户权限">
            <el-option
              v-for="option in options"
              :label="option.label"
              :value="option.value"
              :key="option.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="筛选用户状态">
          <el-select v-model="formInline.selectStatus" placeholder="用户状态">
            <el-option
              v-for="status in statusOptions"
              :label="status.label"
              :value="status.value"
              :key="status.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onFilter">查询</el-button>
          <el-button @click="clearFilter">清除条件</el-button>
        </el-form-item>
      </el-form>
      <div class="searchByUserName">
        <el-input
          placeholder="请输入用户名称"
          v-model="searchUser"
          class="user_input"
          clearable
          @clear="getUserTable(1)"
          @input="handleInput"
        >
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>

        <el-button
          icon="el-icon-search"
          circle
          class="user_search_btn"
          @click="searchUserInData()"
        ></el-button>
      </div>
    </div>
    <el-divider></el-divider>

    <el-card class="user_list_card">
      <div slot="header" class="clearfix">
        <span>用户列表</span>
        <!-- <el-button
          type="success"
          round
          style="margin-left: 90%"
          @click="addUserDialogVisible = true"
          >添加用户</el-button
        > -->
      </div>

      <el-table
        :data="currentUserList"
        stripe
        style="width: 100%"
        :header-cell-style="{
          backgroundColor: '#e8e5e5',
          color: 'black',
          fontWeight: 'bold',
        }"
      >
        <el-table-column
          prop="username"
          label="用户名称"
          width="200"
          align="center"
        >
        </el-table-column>
        <el-table-column label="用户权限" width="250" align="center">
          <template slot-scope="scope">
            <div v-show="scope.row.editing">
              <el-select
                v-model="scope.row.selectRole"
                :placeholder="
                  scope.row.role ? options[scope.row.role].label : null
                "
              >
                <template v-for="item in options">
                  <el-option
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                    <template v-slot:default>
                      <el-tag :type="getRoleTagType(item.value)">{{
                        item.label
                      }}</el-tag>
                    </template>
                  </el-option>
                </template>
              </el-select>
            </div>
            <div v-show="!scope.row.editing">
              <!-- 默认显示状态文本，点击可以切换到编辑模式 -->
              <!-- <el-tag :type="getRoleTagType(scope.row.role)">{{
                options[scope.row.role].label
              }}</el-tag> -->
                  <el-tag
                :type="getRoleTagType(scope.row.role)"
                v-if="scope.row.role !== null"
              >
                {{ options[scope.row.role].label }}
              </el-tag>
              <el-tag v-else></el-tag>
            </div>
        
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="注册时间"
          width="300"
          align="center"
        >
        </el-table-column>
        <el-table-column label="可上传容量（MB）" width="250" align="center">
          <template slot-scope="scope">
            <div v-show="scope.row.editing">
              <el-input v-model="scope.row.uploadSize" size="small"></el-input>
            </div>
            <div v-show="!scope.row.editing">
              {{ scope.row.uploadSize }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="用户状态" width="200" align="center">
          <template slot-scope="scope">
            <div v-show="scope.row.editing">
              <el-select
                v-model="scope.row.selectStatus"
                :placeholder="
                  scope.row.userStatus != null
                    ? statusOptions[scope.row.userStatus].label
                    : null
                "
              >
                <template v-for="item in statusOptions">
                  <el-option
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                    <template v-slot:default>
                      <el-tag :type="getTagType(item.value)">{{
                        item.label
                      }}</el-tag>
                    </template>
                  </el-option>
                </template>
              </el-select>
            </div>
            <div v-show="!scope.row.editing">
              <!-- 默认显示状态文本，点击可以切换到编辑模式 -->
              <el-tag
                :type="getTagType(scope.row.userStatus)"
                v-if="scope.row.userStatus !== null"
              >
                {{ statusOptions[scope.row.userStatus].label }}
              </el-tag>
              <el-tag v-else></el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="400" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="toggleEditing(scope.row)"
            >
              {{ scope.row.editing ? "保存" : "编辑" }}</el-button
            >

            <el-popconfirm
              confirm-button-text="确定"
              cancel-button-text="取消"
              icon="el-icon-info"
              icon-color="red"
              title="确定删除该用户吗？"
              @confirm="deleteUser(scope.row)"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                slot="reference"
                style="margin-left: 10px"
                >删除</el-button
              >
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="this.currentPage"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="this.currentTotal"
          style="margin-top: 2%; margin-left: 3%"
        >
        </el-pagination>
      </div>
    </el-card>

    <!-- <el-dialog title="新增用户" :visible.sync="addUserDialogVisible">
      <el-form :model="addUserForm" ref="addUserRef" :inline="true">
        <el-form-item label="用户名称" label-width="120">
          <el-input
            v-model="addUserForm.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户密码" label-width="120">
          <el-input
            v-model="addUserForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog()">取 消</el-button>disabled
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog> -->

    <el-dialog title="编辑用户" :visible.sync="editUserDialogVisible">
      <el-form :model="showUserForm" ref="editUserRef">
        <el-form-item label="用户名称" label-width="120">
          <el-input
            v-model="showUserForm.username"
            autocomplete="off"
            disabled
            size="medium"
          ></el-input>
        </el-form-item>

        <el-tooltip
          class="item"
          effect="dark"
          content="由于密码进行加密操作，此处为密文"
          placement="top-start"
        >
          <el-form-item label="用户密码" label-width="120">
            <el-input
              v-model="showUserForm.password"
              autocomplete="off"
              size="medium"
              class="pwd_input"
            ></el-input>
          </el-form-item>
        </el-tooltip>

        <el-form-item label="用户权限" label-width="120">
          <el-select v-model="showUserForm.role" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="注册时间" label-width="120" size="medium">
          <el-input
            v-model="showUserForm.createTime"
            autocomplete="off"
            disabled
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmEditUser()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRequest, postRequest, saveParentDisease } from "@/api/user";
import { resetForm } from "@/components/mixins/mixin";
// import { filter } from 'vue/types/umd';
export default {
  mixins: [resetForm],

  watch: {},

  data() {
    return {
      searchUser: "",
      tableData: [],
      total: 0,
      currentTotal: 0,
      pageNum: 1,
      currentPage: 1,
      currentUserList: [],
      addUserDialogVisible: false,
      addUserForm: {
        username: "",
        password: "",
      },
      showUserForm: {
        uid: "",
        username: "",
        password: "",
        role: "",
        createTime: "",
      },
      editUserDialogVisible: false,
      options: [
        {
          label: "管理员",
          value: 0,
        },
        {
          label: "普通用户",
          value: 1,
        },
      ],
      formInline: {
        role: "",
        selectStatus: "",
      },
      statusOptions: [
        {
          label: "待激活",
          value: 0,
        },
        {
          label: "正常",
          value: 1,
        },
        {
          label: "禁用",
          value: 2,
        },
      ],
    };
  },

  created() {
    this.getUserTable(1);
    this.getUserAll();
  },

  methods: {
    getUserAll() {
      getRequest("user/querUser").then((res) => {
        if (res) {
          this.tableData = res;
        }
      });
    },
    getUserTable(pageNum) {
      getRequest("user/allUser?pageNum=" + pageNum).then((res) => {
        if (res) {
          console.log("pageNum", pageNum);
          const dataWithEditing = res.data.map((item) => ({
            ...item,
            editing: false,
            selectStatus: Number(item.userStatus),
            selectRole: Number(item.role),
          }));
          this.total = res.total;
          this.filterData(); // 加载完数据后进行筛选
          this.tableData = dataWithEditing;
          this.currentTotal = res.total;
          this.currentUserList=dataWithEditing
        }
      });
    },
    toggleEditing(row) {
      if (row.editing) {
        this.saveChanges(row); // 如果当前是保存状态，保存数据
      }
      this.$set(row,"editing",!row.editing)
      console.log('row',row.selectRole)
      //row.editing = !row.editing; // 切换编辑状态
      // this.$forceUpdate();
    },
    saveChanges(row) {
      const params = {
        uid: row.uid,
        status: row.selectStatus,
        role: row.selectRole,
        uploadSize: row.uploadSize,
      };
      console.log('row.selectStatus',row.selectStatus)
      postRequest("user/updateStatus", params).then((res) => {
        if (res.code == 200) {
          this.$message.success("修改成功");
          this.getUserTable(1);
        } else {
          this.$message.warning("修改失败！");
          this.getUserTable(1);
        }
      });
    },

    filterData() {
      let filteredData = this.tableData.filter((user) => {
        const matchesRole =
          this.formInline.role !== ""
            ? Number(user.role) === Number(this.formInline.role)
            : true;
        const matchesStatus =
          this.formInline.selectStatus !== ""
            ? Number(user.userStatus) === Number(this.formInline.selectStatus)
            : true;
        const matchesName = this.searchUser
          ? user.username.toLowerCase().includes(this.searchUser.toLowerCase())
          : true;

        return matchesRole && matchesStatus && matchesName;
      });

      this.currentUserList = filteredData;
      this.currentTotal = filteredData.length;
    },
    handleInput() {
      if (!this.searchUser.trim()) {
        this.getUserTable(1);
      }
    },
    onFilter() {
      this.filterData();
    },
    searchUserInData() {
      this.filterData();
    },

    clearFilter() {
      this.currentUserList = this.tableData;
      this.formInline.role = "";
      this.formInline.selectStatus = "";
      this.currentTotal = this.total;
      this.filterData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getUserTable(val);
    },
    getTagType(val) {
      if (val === 0 || val === "0") {
        return "warning";
      }
      if (val === 1 || val === "1") {
        return "success";
      }
      if (val === 2 || val === "2") {
        return "danger";
      }
    },
    getRoleTagType(val) {
      if (val === 0 || val === "0") {
        return "success";
      }
      if (val === 1 || val === "1") {
        return "";
      }
    },

    // pagehelper() {
    //   getRequest(
    //     `user/selectByPage?pageNum=${this.params.page}&pageSize=${this.params.size}&searchUser=${this.searchUser}`
    //   ).then((res) => {
    //     if (res) {
    //       this.total = res.data.total;
    //       this.currentUserList = res.data.list;
    //     }
    //   });
    // },
    // addUser() {
    //   postRequest("/user/addUser", this.addUserForm).then((res) => {
    //     if (res.code == 200) {
    //       this.$message.success("新增用户成功");
    //       this.closeDialog();
    //       this.pagehelper();
    //     } else {
    //       this.$message.error("新增用户失败");
    //       this.closeDialog();
    //       this.pagehelper();
    //     }
    //   });
    // },
    // closeDialog() {
    //   this.addUserDialogVisible = false;
    //   this.addUserForm.username = "";
    //   this.addUserForm.password = "";
    // },
    deleteUser(row) {
      const params = {
        uid: row.uid,
        status: row.selectStatus,
      };
      postRequest("user/delUser", params).then((res) => {
        if (res.code == 200) {
          console.log("删除成功");
          this.$message.success("删除用户成功");
          this.getUserTable();
        } else {
          this.$message.error("删除用户失败");
          this.getUserTable();
        }
      });
    },

    // getInfoUser(uid) {
    //   getRequest(`user/getInfo/${uid}`).then((res) => {
    //     if (res.code == 200) {
    //       this.editUserDialogVisible = true;
    //       this.showUserForm.username = res.data.username;
    //       this.showUserForm.password = res.data.password;
    //       this.showUserForm.role = res.data.role;
    //       this.showUserForm.createTime = res.data.createTime;
    //       this.showUserForm.uid = res.data.uid;
    //     } else {
    //       this.$message.error("获取用户信息失败");
    //       this.pagehelper();
    //     }
    //   });
    // },
    // confirmEditUser() {
    //   postRequest("user/edit", this.showUserForm).then((res) => {
    //     if (res.code == 200) {
    //       this.$message.success("修改用户成功");
    //       this.pagehelper();
    //     } else {
    //       this.$message.error("修改用户失败");
    //       this.pagehelper();
    //     }
    //   });
    // },
  },
};
</script>

<style scoped>
.searchByCondition {
  display: flex;
  height: 40px;
  justify-content: space-between;
}
.searchByUserName {
  width: 25%;
}
.user_input {
  width: 80%;
}
.user_search_btn {
  margin-left: 1%;
}
.pagination {
  display: flex;
  justify-content: center;
}
</style>
