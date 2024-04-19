<template>
  <div>
    <div class="searchByUserName">
      <el-input
        placeholder="请输入您想搜索的通知标题或内容"
        v-model="searchTitle"
        class="user_input"
        clearable
        @clear="getInformTable(1)"
        @input="handleInput"
      >
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>

      <el-button
        icon="el-icon-search"
        circle
        class="user_search_btn"
        @click="searchInformInData()"
      ></el-button>
    </div>
    <el-divider></el-divider>

    <el-card class="user_list_card">
      <div slot="header" class="clearfix">
        <span>通告列表</span>
        <el-button
          type="success"
          round
          style="margin-left: 80%"
          @click="addInformDialogVisible = true"
          >发布通告</el-button
        >
      </div>

      <el-table :data="currentInformList" stripe style="width: 100%"  :header-cell-style="{ backgroundColor: '#e8e5e5', color: 'black', fontWeight: 'bold'}">
        <el-table-column label="通告标题" width="300" align="center">
          <template slot-scope="scope">
            <div v-show="scope.row.editing">
              <el-input v-model="scope.row.title" size="small"></el-input>
            </div>
            <div v-show="!scope.row.editing">
              {{ scope.row.title }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="发布人"
          prop="username"
          width="250"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="最新发布时间"
          width="300"
          align="center"
        >
        </el-table-column>
        <el-table-column label="通告内容" width="300" align="center">
          <template slot-scope="scope">
            <div v-show="scope.row.editing">
              <el-input v-model="scope.row.content" size="small"></el-input>
            </div>
            <div v-show="!scope.row.editing">
              {{ scope.row.content }}
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
              title="确定删除该通告吗？"
              @confirm="deleteInform(scope.row)"
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

    <el-dialog title="新增通告" :visible.sync="addInformDialogVisible">
      <div class="addInformcontent">
        <el-form :model="addInformForm" ref="addInformForm">
          <el-form-item label="通告标题" label-width="120">
            <el-input
              v-model="addInformForm.title"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="通告内容" label-width="120">
            <el-input
              type="textarea"
              v-model="addInformForm.content"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog()">取 消</el-button>
        <el-button type="primary" @click="addInform()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRequest, postRequest } from "@/api/user";
import { resetForm } from "@/components/mixins/mixin";
export default {
  mixins: [resetForm],

  watch: {},

  data() {
    return {
      searchTitle: "",
      tableData: [],
      total: 0,
      currentTotal: 0,
      pageNum: 1,
      currentPage: 1,
      currentInformList: [],
      addInformDialogVisible: false,
      addInformForm: {
        title: "",
        content: "",
      },
    };
  },

  created() {
    this.getInformTable(1);
    this.getAllInform()
  },

  methods: {
      getAllInform(){
          getRequest('notice/queryNotices').then((res)=>{

            this.tableData = res;
       
          })
      },
    convertToBeijingTime(isoString) {
      // 解析 ISO 字符串为 Date 对象
      const date = new Date(isoString);

      // 调整时区到北京时间，UTC+8
      const beijingTime = new Date(date.getTime() + 8 * 60 * 60 * 1000); // 添加8小时的毫秒数

      // 使用 Intl.DateTimeFormat 格式化输出
      const formatter = new Intl.DateTimeFormat("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "Asia/Shanghai",
      });

      return formatter
        .format(beijingTime)
        .replace(/\//g, "-")
        .replace(", ", " ");
    },
    getInformTable(pageNum) {
      getRequest(
        "notice/allNotices?pageNum=" + pageNum + "&pageSize=" + 10
      ).then((res) => {
        if (res) {
          const dataWithEditing = res.list.map((item) => ({
            ...item,
            updateTime: this.convertToBeijingTime(item.updateTime), // 格式化时间为北京时间
            editing: false,
          }));

          this.total = res.total;
          this.currentTotal = res.total;
          this.currentInformList = dataWithEditing;
        }
      });
    },
    toggleEditing(row) {
      if (row.editing) {
        this.saveChanges(row); // 如果当前是保存状态，保存数据
      }
      row.editing = !row.editing; // 切换编辑状态
    },
    saveChanges(row) {
      // 在这里实现保存数据到服务器的逻辑
      // 假设保存成功，更新userStatus显示

      postRequest("notice/updateNotice", row).then((res) => {
        if (res.code == 200) {
          this.$message.success("修改成功");
        } else {
          this.$message.warning("修改失败！");
          this.getInformTable(1);
        }
      });
    },
    searchInformInData() {
      if (!this.searchTitle) {
        this.getInformTable(1);
      } else {
        // 将用户输入转化为小写一次，然后重用这个结果，减少重复计算
        const searchTitleLower = this.searchTitle.toLowerCase();
        let filterData = this.tableData.filter((inform) => {
          const titleMatches = inform.title
            .toLowerCase()
            .includes(searchTitleLower);
          const contentMatches = inform.content
            .toLowerCase()
            .includes(searchTitleLower);
          return titleMatches || contentMatches;
        });
  
        // 将过滤结果赋值给 currentInformList
        this.currentInformList = filterData;
         this.currentTotal = filterData.length;
      }
    },
    handleInput() {
      if (!this.searchTitle.trim()) {
        this.getInformTable(1);
      }
    },

    handleCurrentChange(val) {
      this.currentPage = val;
      this.getInformTable(val);
    },

    deleteInform(row) {
      postRequest("notice/delNotice", row).then((res) => {
        if (res.code == 200) {
          this.$message.success("删除通告成功");
          this.getInformTable(1);
        } else {
          this.$message.error("删除通告失败");
          this.getInformTable(1);
        }
      });
    },
    addInform() {
      const params = {
        title: this.addInformForm.title,
        content: this.addInformForm.content,
        uid: sessionStorage.getItem("userid"),
        username: sessionStorage.getItem("username"),
      };
      postRequest("notice/insertNotice", params).then((res) => {
        if (res.code == 200) {
          this.$message.success("发布通告成功");
          this.closeDialog();
          this.getInformTable(1);
        } else {
          this.$message.error("发布通告失败");
          this.closeDialog();
          this.getInformTable(1);
        }
      });
    },
    closeDialog() {
      this.addInformDialogVisible = false;
      this.addInformForm.title = "";
      this.addInformForm.content = "";
    },
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
.addInformcontent {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.pagination{
     display: flex;
  justify-content: center; 
}
</style>