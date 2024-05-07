<template>
  <div>
    <span>疾病名称：</span>

<!--    这里修改了疾病选择的方式-->
      <el-cascader
          :options="disOptions"
          :props="{ checkStrictly: true }"
          v-model="selected"
          @change="selectDisease"
      ></el-cascader>
    <el-button style="margin-left: 10px" @click="selectAll()">取消</el-button>

    <el-divider></el-divider>

    <el-card class="user_list_card">
      <div slot="header" class="clearfix">
        <span><b style="font-size: 20px">疾病列表</b></span>
        <el-button type="success" round style="margin-left: 90%;"
                   @click="dialogDiseaseVisible = true">添加一级病种</el-button>
      </div>
      <el-table
          :header-cell-style="{ backgroundColor: '#e8e5e5', color: 'black', fontWeight: 'bold'}"
          :data="currentDisease"
          style="width: 100%;margin-bottom: 20px;"
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
            prop="icdCode"
            label="icd编码"
            sortable
            width="150">
        </el-table-column>
        <el-table-column
            prop="tableNum0"
            label="表数量(公共数据集)"
            sortable
            width="170">
        </el-table-column>
        <el-table-column
            prop="tableNum1"
            label="表数量(私有数据集)"
            sortable
            width="170">
        </el-table-column>
        <el-table-column
            prop="tableNum2"
            label="表数量(共享数据集)"
            sortable
            width="170">
        </el-table-column>
        <el-table-column
            prop="username"
            label="创建者"
            sortable
            width="150">
        </el-table-column>
        <!-- 新增多疾病设置 -->
        <el-table-column label="操作（注释：删除上级病种时会将该病种下所有病种删除！）">
          <template slot-scope="scope">
                        <el-button
                            icon="el-icon-folder-add"
                            type="primary"
                            circle
                            style="margin-left: 60%;"
                            @click="setAddDisease(scope.row)"
                            v-if="scope.row.label!=='多疾病'&& scope.row.id!=='14'"
                        ></el-button>
            <el-button type="primary" icon="el-icon-edit" circle @click="getInfoDisease(scope.row)" v-if="scope.row.label!=='多疾病' && scope.row.id!=='14'"></el-button>
            <el-popconfirm confirm-button-text='确定' cancel-button-text='取消' icon="el-icon-info"
                           icon-color="red" title="确定删除该病种吗？" @confirm="deleteDisease(scope.row)">
              <el-button type="danger" icon="el-icon-delete" circle slot="reference"
                         style="margin-left: 10px;" v-if="scope.row.label!=='多疾病'&& scope.row.id!=='14'"></el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--添加了:close-on-click-modal="false"属性-->
    <el-dialog
        title="添加病种"
        :visible.sync="dialogDiseaseVisible"
        width="30%" :close-on-click-modal="false">
        <el-form ref="form" :model="addDiseaseParam"  :label-position="labelPosition">
          <el-form-item label="病种名称">
            <el-input v-model="addDiseaseParam.firstDisease" placeholder="请输入病种名称" style="width: 300px" @blur="checkDiseaseName(addDiseaseParam.firstDisease)"></el-input>
          </el-form-item>
          <el-form-item label="病种icd编码">
            <el-input v-model="addDiseaseParam.icdCode" placeholder="请输入病种icd编码" style="width: 300px"></el-input>
          </el-form-item>
        </el-form>

      <span slot="footer" class="dialog-footer">
          <el-button @click="cleanAdd()">取 消</el-button>
          <el-button type="primary" @click="addDisease()">确 定</el-button>
        </span>
    </el-dialog>
<!--添加了:close-on-click-modal="false"属性-->
    <el-dialog title="编辑病种" :visible.sync="editDialogDiseaseVisible" :close-on-click-modal="false">
      <el-form ref="form" :model="updateDiseaseParam" :label-position="labelPosition">
        <span>注释：上级病种为空则将病种修改为一级病种</span>
<!--        修改了选择的方式-->
        <el-form-item label="上级病种">
          <el-cascader
              :options="optionsWithDisabled"
              :props="{ checkStrictly: true }"
              v-model="test"
              @change="getId"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="病种名称" style="width: 228px">
          <el-input v-model="updateDiseaseParam.diseaseName" :placeholder="updateDiseaseParam.diseaseName" style="width: 300px" @blur="checkDiseaseName(updateDiseaseParam.diseaseName)"></el-input>
        </el-form-item>
        <el-form-item label="病种icd编码" style="width: 228px">
          <el-input v-model="updateDiseaseParam.icdCode" :placeholder="updateDiseaseParam.icdCode" style="width: 300px"></el-input>
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
      disOptions1 : [],
      test:'',
      disOptions: [],
      labelPosition: "top",
      tableData: [],
      dialogDiseaseVisible: false,
      editDialogDiseaseVisible: false,
      searchDisease: '',
      diseases: [],
      total: 0,
      params: {
        page: 1,
        size: 9,
      },
      currentDisease: [],
      addDiseaseParam: {
        catLevel: 2,
        firstDisease: "",
        icdCode: "",
        parentId: "",
        username: "",
        uid: ""
      },
      updateDiseaseParam:{
        categoryId: "",
        diseaseName: "",
        parentDisease: "",
        parentId: "",
        icdCode: "",
        username: "",
        uid: ""
      },
      options:[],
      deleteDis: {
        deleteIds: [],
        deleteNames: [],
        username: "",
        uid: ""
      },
      selected: ''
    };
  },
  // 添加的方法
  computed: {
    optionsWithDisabled() {
      return this.disOptions1.map(option => {
        return this.disableOption(option);
      });
    }
  },

  created() {
    this.getCategory();
    this.getDataDiseases()
    this.getDataDiseases2()
  },

  methods: {
    // 添加的方法
    disableOption(option) {
      if (option.value === this.updateDiseaseParam.categoryId) {
        this.disableSubOptions(option);
      }
      if (option.children) {
        option.children = option.children.map(childOption => {
          return this.disableOption(childOption);
        });
      }
      return option;
    },
    // 添加的方法
    disableSubOptions(option) {
      option.disabled = true;
      if (option.children) {
        option.children.forEach(childOption => {
          this.disableSubOptions(childOption);
        });
      }
    },
    // 添加的方法
    getDataDiseases(){
      getRequest(`/api/selectDataDiseases`).then(res => {
        if (res.code == 200) {
          console.log("selectDataDiseases", res.data);
          this.disOptions = res.data;
        }else{
          console.log("res", res.data)
        }
        this.disOptions1 = this.disOptions
      })
    },
    // 添加的方法
    getDataDiseases2(){
      getRequest(`/api/selectDataDiseases`).then(res => {
        if (res.code == 200) {
          console.log("selectDataDiseases", res.data);
          this.disOptions1 = res.data;
        }else{
          console.log("res", res.data)
        }
      })
    },

    getCategory(){
      getCategory("/api/category/getAllDisease").then((response)=>{
        console.log(response.data)
        this.options = []
        this.diseases = []
        this.tableData = []
        this.tableData = response.data;
        // for(var i=0;i<this.tableData.length;i++){
        //   let a = {value:this.tableData[i].id,label:this.tableData[i].label}
        //   this.options.push(a)
        // }
        for(var i=0;i<this.tableData.length;i++){
          let a = {value:this.tableData[i].id,label:this.tableData[i].label}
          this.options.push(a)
          this.diseases.push(a)
          for(var j=0;j<this.tableData[i].children.length;j++){
            let a = {value:this.tableData[i].children[j].id,label:this.tableData[i].children[j].label}
            this.options.push(a)
            this.diseases.push(a)
            for(var p=0;p<this.tableData[i].children[j].children.length;p++) {
              let a = {value: this.tableData[i].children[j].children[p].id, label: this.tableData[i].children[j].children[p].label}
              this.diseases.push(a)
            }
          }
        }
        this.currentDisease = response.data
      })
    },
    selectDisease(){
      console.log("选择的疾病为：", this.selected[0])
      this.currentDisease = []
      for(var i=0;i<this.tableData.length;i++){
        if(this.tableData[i].id === this.selected[0]){
          this.currentDisease.push(this.tableData[i])
        }
      }
      console.log("查找到的疾病为：", this.currentDisease)
    },
    selectAll(){
      this.currentDisease = this.tableData
      this.selected = ''
    },
    checkDiseaseName(name){
      getRequest(`/api/category/checkDiseaseName/${name}`).then((response)=> {
            if (response.code == 400) {
              this.$message.error(response.data)
            }
          }
      )
    },
    setAddDisease(row){
      this.addDiseaseParam.catLevel = row.catLevel
      this.addDiseaseParam.parentId = row.id
      this.dialogDiseaseVisible = true
    },
    addDisease(){
      getRequest(`/api/category/checkDiseaseName/${this.addDiseaseParam.firstDisease}`).then((response)=> {
        if(response.code==200){
          this.addDiseaseParam.username = sessionStorage.getItem("username");
          this.addDiseaseParam.uid = sessionStorage.getItem("userid");
          //如果为空则添加的是一级病种
          if(this.addDiseaseParam.parentId==""){
            this.addDiseaseParam.parentId = "1";
          }else{
            this.addDiseaseParam.catLevel = this.addDiseaseParam.catLevel+1
          }
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
          this.cleanAdd()
        }else{
          this.$message.error("请填写有效的病种名称")
        }
      }
      )
    },
    cleanAdd(){
      this.dialogDiseaseVisible = false;
      this.addDiseaseParam = {
        catLevel: 2,
        firstDisease: "",
        icdCode: "",
        parentId: "",
        username: "",
        uid: ""
      }
    },
    //修改的方法
    getInfoDisease(row){
      this.editDialogDiseaseVisible = true
      console.log(row)
      if(row.parentId!=="1"){
        // for(var i=0;i<this.tableData.length;i++){
        //   for(var j=0;j<this.tableData[i].children.length;j++){
        //     if(row.parentId===this.tableData[i].children[j].id){
        //       this.updateDiseaseParam.parentDisease = this.tableData[i].children[j].label
        //       break;
        //     }
        //   }
        //   if(row.parentId===this.tableData[i].id){
        //     this.updateDiseaseParam.parentDisease = this.tableData[i].label
        //     break;
        //   }
        // }
        this.test = row.parentId
        console.log("-------"+this.test)
      }
      this.updateDiseaseParam.categoryId = row.id
      this.updateDiseaseParam.diseaseName = row.label
      this.updateDiseaseParam.icdCode = row.icdCode
      this.updateDiseaseParam.parentId = row.parentId
      this.updateDiseaseParam.username = sessionStorage.getItem("username");
      this.updateDiseaseParam.uid = sessionStorage.getItem("userid");
      console.log(this.updateDiseaseParam)
      this.getDataDiseases2()
    },
    getId(data){
      console.log("疾病名称为：", this.updateDiseaseParam.parentDisease)
      console.log("data为：", data[data.length-1])
      this.updateDiseaseParam.parentDisease = ''
      this.updateDiseaseParam.parentId = data[data.length-1]
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
      this.cleanUpdate()
    },
    cleanUpdate(){
      this.editDialogDiseaseVisible=false
      // this.editDialogDiseaseVisible1=false
      this.updateDiseaseParam={
        categoryId: "",
        diseaseName: "",
        parentDisease: "",
        parentId: "",
        icdCode: "",
        username: "",
        uid: ""
      }
    },

    deleteDisease(row) {
      this.deleteDis = {
        deleteIds: [],
        deleteNames: [],
        username: "",
        uid: ""
      }
      if(row.tableNum0==0&&row.tableNum1==0&&row.tableNum2==0){
        this.deleteDis.deleteIds.push(row.id)
        this.deleteDis.deleteNames.push(row.label)
        for(var i=0;i<row.children.length;i++){
          this.deleteDis.deleteIds.push(row.children[i].id)
          this.deleteDis.deleteNames.push(row.children[i].label)
          for(var i=0;i<row.children[i].children.length;i++){
            this.deleteDis.deleteIds.push(row.children[i].id)
            this.deleteDis.deleteNames.push(row.children[i].label)
          }
        }
        this.deleteDis.username = sessionStorage.getItem("username");
        this.deleteDis.uid = sessionStorage.getItem("userid");
        const data = {
          list:this.deleteIds
        }
        console.log(data)
        postRequest('api/category/deleteCategory', this.deleteDis).then(res => {
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
.container{
  display: flex;
  justify-content: center;
}
.user_input {
  width: 20%;
}

.user_search_btn {
  margin-left: 1%;
}
</style>