<template>
  <div>
    <span>疾病名称：</span>
    <el-select v-model="selected" placeholder="请选择要查询的病种" @change="selectDisease">
      <el-option
          v-for="item in options"
          :key="item.label"
          :label="item.label"
          :value="item.label">
      </el-option>
    </el-select>
    <el-button style="margin-left: 10px" @click="selectAll()">取消</el-button>

    <el-divider></el-divider>

    <el-card class="user_list_card">
      <div slot="header" class="clearfix">
        <span><b style="font-size: 20px">疾病列表</b></span>
        <el-button type="success" round style="margin-left: 90%;"
                   @click="dialogDiseaseVisible = true">添加病种</el-button>
      </div>
      <span style="color:red">注意：删除一级病种时会将该病种下所有二级病种删除！</span>
      <el-table
          :data="currentDisease"
          style="margin: 20px 0px;"
          row-key="id"
          border
          default-expand-all
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column
            prop="label"
            label="病种名称"
            sortable
            width="400">
        </el-table-column>
        <el-table-column
            prop="tableNum0"
            label="病种相关表数量(公共数据集)"
            sortable
            width="250">
          </el-table-column>
        <el-table-column
            prop="tableNum1"
            label="病种相关表数量(私有数据集)"
            sortable
            width="250">
        </el-table-column>
          <el-table-column
              prop="tableNum2"
              label="病种相关表数量(共享数据集)"
              sortable
              width="250">
          </el-table-column>
        <el-table-column
            prop="username"
            label="创建者"
            sortable
            width="150">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
<!--            <el-button-->
<!--                icon="el-icon-folder-add"-->
<!--                type="primary"-->
<!--                circle-->
<!--                @click="dialogDiseaseVisible = true"-->
<!--                style="margin-left: 60%;"-->
<!--            ></el-button>-->
            <el-button type="primary" icon="el-icon-edit" circle @click="getInfoDisease(scope.row)"></el-button>
            <el-popconfirm confirm-button-text='确定' cancel-button-text='取消' icon="el-icon-info"
                           icon-color="red" title="确定删除该病种吗？" @confirm="deleteDisease(scope.row)">
              <el-button type="danger" icon="el-icon-delete" circle slot="reference"
                         style="margin-left: 10px;"></el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

<!--      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"-->
<!--                     :current-page="this.params.page" :page-sizes="[6, 9, 12, 15, 24]" :page-size="this.params.size"-->
<!--                     layout="total, sizes, prev, pager, next, jumper" :total="this.total"-->
<!--                     style="margin-top: 2%; margin-left: 3%;">-->
<!--      </el-pagination>-->

    </el-card>

    <el-dialog
        title="添加病种"
        :visible.sync="dialogDiseaseVisible"
        width="30%">
      <el-form ref="form" :model="addDiseaseParam">
        <el-form-item label="一级病种">
          <el-input v-model="addDiseaseParam.firstDisease" placeholder="请输入一级病种名" style="width: 300px"></el-input>
        </el-form-item>

        <el-form-item label="二级病种">
          <el-input v-model="addDiseaseParam.secondDisease" placeholder="请输入二级病种名" style="width: 300px"></el-input>
        </el-form-item>
        <span>注释：当二级病种名为空时，则添加一级病种</span>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="cleanAdd()">取 消</el-button>
          <el-button type="primary" @click="addDisease()">确 定</el-button>
        </span>
    </el-dialog>


    <el-dialog title="编辑病种" :visible.sync="editDialogDiseaseVisible">
      <el-form ref="form" :model="updateDiseaseParam">
        <el-form-item label="一级病种">
          <el-input v-model="updateDiseaseParam.firstDisease" :placeholder="updateDiseaseParam.firstDisease" style="width: 300px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cleanUpdate()">取 消</el-button>
        <el-button type="primary" @click="updateDisease()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑病种" :visible.sync="editDialogDiseaseVisible1">
      <el-form ref="form" :model="updateDiseaseParam">
        <el-form-item label="一级病种">
          <el-select v-model="updateDiseaseParam.firstDisease" :placeholder="updateDiseaseParam.firstDisease" @change="getId">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="{value:item.value,label:item.label}">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级病种">
          <el-input v-model="updateDiseaseParam.secondDisease" :placeholder="updateDiseaseParam.secondDisease" style="width: 300px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cleanUpdate()">取 消</el-button>
        <el-button type="primary" @click="updateDisease()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRequest, postRequest } from "@/api/user";
import { resetForm } from "@/components/mixins/mixin";
import {getCategory} from "@/api/category";
export default {
  mixins: [resetForm],
  watch: {
  },

  data() {
    return {
      tableData: [],
      dialogDiseaseVisible: false,
      editDialogDiseaseVisible: false,
      editDialogDiseaseVisible1: false,
      searchDisease: '',
      total: 0,
      params: {
        page: 1,
        size: 9,
      },
      currentDisease: [],
      addDiseaseParam: {
        firstDisease: "",
        secondDisease: "",
        username: "",
        uid: ""
      },
      updateDiseaseParam:{
        categoryId: "",
        firstDisease: "",
        secondDisease: "",
        parentId: "",
        username: "",
        uid: ""
      },
      options:[],
      deleteIds: [],
      selected: ''
    };
  },

  created() {
    this.getCategory();
  },

  methods: {
    getCategory(){
      getCategory("/api/category/getAllDisease").then((response)=>{
        this.options = []
        this.tableData = []
        this.tableData = response.data;
        for(var i=0;i<this.tableData.length;i++){
          let a = {value:this.tableData[i].id,label:this.tableData[i].label}
          this.options.push(a)
        }
        this.currentDisease = response.data
      })
    },
    selectDisease(){
      this.currentDisease = []
      for(var i=0;i<this.tableData.length;i++){
        if(this.tableData[i].label === this.selected){
          this.currentDisease.push(this.tableData[i])
        }
      }
    },
    selectAll(){
      this.currentDisease = this.tableData
      this.selected = ''
    },
    addDisease(){
      if(this.addDiseaseParam.firstDisease==""){
        this.$message.error("请输入一级疾病名称");
      }else{
        this.addDiseaseParam.username = sessionStorage.getItem("username");
        this.addDiseaseParam.uid = sessionStorage.getItem("userid");
        console.log(this.addDiseaseParam)
        postRequest('api/category/addCategory', this.addDiseaseParam).then(res => {
          console.log(res)
          if (res.code == 200) {
            this.$message.success("添加病种成功")
            this.getCategory();
          } else {
            this.$message.error(res.msg)
            this.getCategory();
          }
        })
        this.addDiseaseParam={
          firstDisease: "",
          secondDisease: "",
          username: "",
          uid: ""
        }
        this.dialogDiseaseVisible = false
      }
    },
    cleanAdd(){
      this.dialogDiseaseVisible = false;
      this.addDiseaseParam = {
        firstDisease: "",
        secondDisease: "",
        username: "",
        uid: ""
      }
    },
    getInfoDisease(row){
      console.log(row)
      if(row.parentId=="1"){
        this.editDialogDiseaseVisible = true
        this.updateDiseaseParam.categoryId = row.id
        this.updateDiseaseParam.firstDisease = row.label
        this.updateDiseaseParam.parentId = row.parentId
      }
      else {
        this.editDialogDiseaseVisible1 = true
        for(var i=0;i<this.tableData.length;i++){
          if(row.parentId==this.tableData[i].id){
            this.updateDiseaseParam.firstDisease = this.tableData[i].label
          }
        }
        this.updateDiseaseParam.categoryId = row.id
        this.updateDiseaseParam.secondDisease = row.label
        this.updateDiseaseParam.parentId = row.parentId
      }
      this.updateDiseaseParam.username = sessionStorage.getItem("username");
      this.updateDiseaseParam.uid = sessionStorage.getItem("userid");
      console.log(this.updateDiseaseParam)
    },
    getId(data){
      const {value,label} = data;
      this.updateDiseaseParam.firstDisease = label
      this.updateDiseaseParam.parentId = value
    },
    updateDisease(){
      console.log(this.updateDiseaseParam)
      postRequest('api/category/updateCategory', this.updateDiseaseParam).then(res => {
        console.log(res)
        if (res.code == 200) {
          this.$message.success("修改病种成功")
          this.getCategory();
        } else {
          this.$message.error("修改病种失败")
          this.getCategory();
        }
      })
      this.editDialogDiseaseVisible=false
      this.editDialogDiseaseVisible1=false


    },
    cleanUpdate(){
      this.editDialogDiseaseVisible=false
      this.editDialogDiseaseVisible1=false
      this.updateDiseaseParam={
        categoryId: "",
            firstDisease: "",
            secondDisease: "",
            parentId: "",
            username: "",
            uid: ""
      }
    },

    deleteDisease(row) {
      this.deleteIds = []
      if(row.tableNum0==0&&row.tableNum1==0&&row.tableNum2==0){
        if(row.parentId=="0"){
          this.deleteIds.push(row.id)
          for(var i=0;i<row.children.length;i++){
            this.deleteIds.push(row.children[i].id)
          }

        }else{this.deleteIds.push(row.id)}
        const data = {
          list:this.deleteIds
        }
        console.log(data)
        postRequest('api/category/deleteCategory', this.deleteIds).then(res => {
          console.log(res)
          if (res.code == 200) {
            this.$message.success("删除病种成功")
            this.getCategory();
          } else {
            this.$message.error("删除病种失败")
            this.getCategory();
          }
        })
      }else {
        this.$message.error("请将该病种下所有表删除后再删除该病种！")
      }

    },
  },

};
</script>

<style scoped>
.user_input {
  width: 20%;
}

.user_search_btn {
  margin-left: 1%;
}
</style>