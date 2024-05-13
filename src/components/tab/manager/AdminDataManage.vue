<template>
    <div>
        <el-row :gutter="20">
            <div class="grid-content ">
                <el-select v-model="type" class="search_input" default-first-option placeholder="请选择搜索类型">
                    <el-option v-for="item in searchTypes" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>

                <el-input placeholder="输入信息进行模糊搜索" v-model="searchByName" class="search_input" clearable
                    @clear="getAllAdminDataTable()">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>

                <el-button icon="el-icon-search" circle class="search_btn"
                    @click="getAdminDataTableByName()"></el-button>
            </div>
        </el-row>

        <el-divider></el-divider>

        <el-card class="user_list_card">
            <div slot="header" class="clearfix">
                <span>数据信息</span>
                <el-button type="success" round style="margin-left: 90%;"
                    @click="uploadDataDialogVisible = true; getDataDiseases()">
                    <i class="el-icon-upload"></i>上传数据集</el-button>
            </div>

            <el-table class="el-table" :data="displayedAdminDataManageList" stripe style="width: 100%">
                <el-table-column prop="id" label="id" width="200">
                </el-table-column>
                <el-table-column prop="tableName" label="数据表名称" width="150">
                </el-table-column>
                <el-table-column prop="createUser" label="用户名称" width="100">
                </el-table-column>
                <el-table-column prop="classPath" label="所属类别" width="300">
                    <!-- <template slot-scope="scope">
                      <el-tag type="success" v-if="scope.row.role == '0'">管理员</el-tag>
                      <el-tag v-if="scope.row.role == '1'">普通用户</el-tag>
                  </template> -->
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="100">
                </el-table-column>
                <el-table-column label="数据表状态" width="100">
                    <template slot-scope="props">
                        <span v-if="props.row.tableStatus == 0">私有</span>
                        <span v-if="props.row.tableStatus == 1">共享</span>
                        <span v-if="props.row.tableStatus == 2">公有</span>
                    </template>
                </el-table-column>
                <el-table-column prop="tableSize" label="数据表大小" width="100">
                </el-table-column>
                <el-table-column prop="checkApproving" label="申请下载用户" width="150">
                </el-table-column>
                <el-table-column prop="checkApproved" label="已批准下载用户" width="150">
                </el-table-column>
                <el-table-column label="操作" width="200" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" circle
                            @click="getDataDiseases(); getEditDataById(scope.row.id, scope.row.tableName, scope.row.tableStatus)"></el-button>
                        <el-popconfirm confirm-button-text='确定' cancel-button-text='取消' icon="el-icon-info"
                            icon-color="red" title="确定删除该数据表吗？"
                            @confirm="deleteAdminDataManage(scope.row.id, scope.row.uid, scope.row.tableId, scope.row.tableSize, scope.row.tableName)">
                            <el-button type="danger" icon="el-icon-delete" circle slot="reference"
                                style="margin-left: 10px;"></el-button>
                        </el-popconfirm>
                        <el-badge :value="checkInfos(scope.row.checkApproving)" class="item"  style="margin-left: 10px;">
                            <el-button type="warning" icon="el-icon-s-check" circle
                            @click="getCheckDataById(scope.row.id, scope.row.tableName)"></el-button>                        
                        </el-badge>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="this.params.page" :page-sizes="[6, 9, 12, 15, 24]" :page-size="this.params.size"
                layout="total, sizes, prev, pager, next, jumper" :total="this.total"
                style="margin-top: 2%; margin-left: 3%;">
            </el-pagination>

        </el-card>


        <el-dialog v-loading="loading" :element-loading-text="loadText" id="importDataTable" title="导入数据表"
            :visible.sync="uploadDataDialogVisible" width="40%">
            <el-form :model="dialogForm" ref="dialogFormRef" :rules="dialogForm.rules" label-width="110px">
                <el-form-item label="选择数据表" prop="filesInfo">
                    <el-upload action="" class="upload" ref="uploadRef" :on-preview="handlePreview"
                        :on-remove="handleRemove" :on-change="changeFile" :auto-upload="false" accept=".csv" :limit="1"
                        :multiple="false" :file-list="dialogForm.filesInfo" :http-request="(data) => {
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
                <el-form-item label="请选择病种">
                    <div class="block">
                        <el-cascader :options="disOptions" :props="{ checkStrictly: true }" v-model="selectedOptions"
                            @change="handleCascaderChange"></el-cascader>
                    </div>
                </el-form-item>

            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="closeDialog()">取 消</el-button>
                <el-button type="primary" @click="uploadFile">确 定</el-button>
            </div>

            <!-- 多疾病新增 -->
            <el-dialog v-loading="loading2" :element-loading-text="loadText2" append-to-body title="请选择多个疾病标签字段"
                :visible.sync="featuresVision" :show-close="false" :close-on-click-modal="false"
                :close-on-press-escape="false">
                <!-- <el-form class="featureLabel" label-width="auto"> -->
                <el-checkbox-group v-model="labelList">
                    <el-checkbox style="width: 250px" border v-for="(name, index) in Object.keys(featuresMap)"
                        :key="index" :label="name"></el-checkbox>
                </el-checkbox-group>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="compelete">完成上传</el-button>
                </div>
            </el-dialog>
        </el-dialog>

        <el-dialog title="编辑数据信息" :visible.sync="editAdminDataManageVisible">
            <el-form :model="adminDataManageForm" ref="editUserRef">
                <el-form-item label="id" label-width="120">
                    <el-input v-model="adminDataManageForm.id" autocomplete="off" disabled size="medium"></el-input>
                </el-form-item>

                <el-form-item label="数据表名称" label-width="120">
                    <el-input v-model="adminDataManageForm.tableName" autocomplete="off" size="medium"></el-input>
                </el-form-item>
                <el-form-item label="用户名称" label-width="120">
                    <el-input v-model="adminDataManageForm.createUser" autocomplete="off" disabled
                        size="medium"></el-input>
                </el-form-item>
                <el-form-item label="用户角色" label-width="120">
                    <el-input v-model="adminDataManageForm.createUser" autocomplete="off" disabled
                        size="medium"></el-input>
                </el-form-item>
                <el-form-item label="请选择病种">
                    <div class="block">
                        <el-cascader clearable :options="disOptions" :props="{ checkStrictly: true }"
                            v-model="selectedOptions2" @change="handleCascaderChange"></el-cascader>
                    </div>
                </el-form-item>

                <el-form-item label="发布时间" label-width="120">
                    <el-input v-model="adminDataManageForm.createTime" autocomplete="off" disabled
                        size="medium"></el-input>
                </el-form-item>
                <!-- 0私有 1共享 2公用 -->
                <el-form-item label="数据集状态" label-width="120"
                    v-if="adminDataManageForm.tableStatus == 0 || adminDataManageForm.tableStatus == 2">
                    <el-input v-model="status[adminDataManageForm.tableStatus]" autocomplete="off" disabled
                        size="medium"></el-input>
                </el-form-item>
                <el-form-item label="是否取消共享" label-width="120" v-if="adminDataManageForm.tableStatus == 1">
                    <el-select v-model="is_cancel" placeholder="请选择">
                        <el-option v-for="item in statusType" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>



                <el-form-item label="数据表大小" label-width="120">
                    <el-input v-model="adminDataManageForm.tableSize" autocomplete="off" disabled
                        size="medium"></el-input>
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
                <el-button type="primary" @click="confirmEditAdminDataManage()">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="数据表下载审批" :visible.sync="checkAdminDataManageVisible" v-loading="multipleLoding">
           
           <el-button type="primary" round 
               @click="selectTableVisible=true;selectTableByid()">
               <i  class="el-icon-document"></i>数据预览</el-button>
           <el-button type="success" round 
               @click="confirmUsenames(1)">
               <i  class="el-icon-check"></i>一键同意</el-button>
           <el-button type="danger" round 
               @click="confirmUsenames(0)">
               <i  class="el-icon-close"></i>一键拒绝</el-button>
           
           <el-table
               ref="multipleTable"
               :data="checkDataManageForm"
               tooltip-effect="dark"
               style="width: 100%"
               @selection-change="handleSelectionChange"
               >
               <el-table-column
               
                   type="selection"
                   width="55"
                   label="全选"
                   align="center">
               </el-table-column>
               <el-table-column
                   type="index"
                   width="50"
                   label="id"
                   align="center">                    
               </el-table-column>
               <el-table-column
                   prop="uid"
                   label="用户id"
                   width="120"
                   align="center">
               </el-table-column>
               <el-table-column
                   prop="username"
                   label="用户名称"
                   width="120"
                   align="center">
               </el-table-column>
               <el-table-column
                   prop="classpath"
                   label="所属类别"
                   
                   align="center">
               </el-table-column>

               <el-table-column label="操作" align="center">
                   <template slot-scope="scope">
                       <el-button type="success" round
                           @click="updateCheckApprove(scope.row.username, 1)">同意下载</el-button>
                       
                       <el-button type="danger" round
                       @click="updateCheckApprove(scope.row.username, 0)">拒绝下载</el-button>
                       
                   </template>
               </el-table-column>
           </el-table>
           <div slot="footer" class="dialog-footer">
               <el-button @click="checkAdminDataManageVisible = false">取 消</el-button>
               <el-button type="primary" @click="checkAdminDataManageVisible = false">关 闭</el-button>
           </div>
       </el-dialog>

       <el-dialog title="数据表预览" :visible.sync="selectTableVisible">
            <div class="table-container-after">
                <!---------------------------------- 骨架屏 --------------------------------->
                <el-skeleton
                v-if="selectTableLoading"
                style="width: 100%"
                :rows="15"
                animated
                />

                <el-table
                v-else
                :data="tableData"
                stripe
                class="custom-table"
                :header-cell-style="headerCellStyle"
                ref="scrollTable"
                max-height="600px"
                >
                <el-table-column
                    v-for="(value, key) in tableData[0]"
                    :key="key"
                    :prop="key"
                    :label="key"
                    width="auto"
                    :show-overflow-tooltip="true"
                    :sortable="true"
                >
                    <template slot-scope="{ row }">
                    <div class="truncate-text">{{ row[key] }}</div>
                    </template>
                </el-table-column>
                </el-table>
            </div>
       </el-dialog>


    </div>
</template>

<script>
import { getRequest, postRequest } from "@/api/user";
import { resetForm, debounce, deepClone } from "@/components/mixins/mixin";
import { getTableData } from "@/api/tableDescribe.js";
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
            // 首先对数据进行排序,不修改原始数据
            const adminDataManageList_temp = deepClone(this.adminDataManageList);
            const sortedList = adminDataManageList_temp.sort((a, b) => {
                // 假设 scope.row.checkApproving 是 a.checkApproving
                const checkApprovingA = this.checkInfos(a.checkApproving);
                const checkApprovingB = this.checkInfos(b.checkApproving);
                // 降序排序，如果 checkApprovingA 大于 checkApprovingB，则 a 应该排在 b 前面
                if (checkApprovingA > checkApprovingB) {
                return -1;
                } else if (checkApprovingA < checkApprovingB) {
                return 1;
                } else {
                return 0; // 如果相等，则保持原有顺序
                }
            });
            // 然后切片出当前页需要显示的数据
            return sortedList.slice(startIndex, endIndex);
        },
        headerCellStyle() {
            return {
                color: "black",
            };
            },
    },

    data() {
        return {
            type: '',
            searchByName: '',
            selectedOptions2: [],
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
            pid: '',
            loading: false,
            loadText: "拼命加载中",
            disOptions: [],
            selectedOptions: [],
            dialogForm: {
                filesInfo: [],
                tableName: "",
                isOnly: true,
                dataDisease: "",
                dataDisease2: "",
                dataDisease3: "",
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
                id: '',
                tableId: '',
                tableName: '',
                createUser: '',
                uid: '',
                tableStatus: "",
                tableSize: 0
            },
            roles: [
                {
                    label: "管理员",
                    value: 0,
                },
                {
                    label: "普通用户",
                    value: 1,
                },
            ],


            status: {
                '0': "私有数据集",
                '2': "公共数据集"
            },
            is_cancel: '1',
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
            //多疾病新增
            featuresMap: {},
            featuresVision: false,
            labelList: [],
            loadText2: "拼命加载中",
            loading2: false,
            compelete_node: {},
            compelete_userId: '',
            compelete_size: '',
            compelete_tableDescribe: {},
            // 审批表格
            checkAdminDataManageVisible: false,
            checkDataManageForm:{
                username: '',
                uid:'',
                classpath: ""
            },
            tid: "",
            tname:"",
            multipleSelection: [],
            multipleLoding: false,
            selectTableLoading: false,
            selectTableVisible: false,
            tableData:[]
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
            getRequest(`/api/getLevel2Label`).then(res => {
                if (res.code == 200) {
                    // console.log("ret data", res.data);
                    this.disOptions.firstSelect = res.data;
                    // console.log(res.data);
                }
            })
        },

        async getLevel3ById(pid, level) {
            let data = [];
            console.log("pid, level", pid, level)
            await getRequest(`/api/getLabelByPid`, {
                pid: pid
            }).then(res => {
                if (res.code == 200) {
                    data = res.data;
                }
            })

            if (level === 2) {
                this.dialogForm.dataDisease2 = '';
                this.dialogForm.dataDisease3 = '';
                this.disOptions.secondSelect = data;
            }
            if (level === 3) {
                this.dialogForm.dataDisease3 = '';
                this.disOptions.thirdSelect = data;
                console.log("this.thirdSelect", this.disOptions.thirdSelect)
            }

            console.log("this.disOptions", this.disOptions.secondSelect, this.disOptions.thirdSelect)


        },
        handleCascaderChange(value) {
            // console.log('Selected Options:',value, this.selectedOptions[this.selectedOptions.length-1]);
            // 如果你希望同时更新 dataDisease
            this.pid = value[value.length - 1];
            console.log(this.pid, this.dataDisease)
        },
        setPid(pid) {
            this.pid = pid === '' ? this.pid : pid;
        },
        getDataDiseases() {
            getRequest(`/api/selectDataDiseases`).then(res => {
                if (res.code == 200) {
                    console.log("selectDataDiseases", res.data);
                    this.disOptions = res.data;
                } else {
                    console.logt("res", res.data)
                }
            })
        },
        //新增多疾病
        compelete() {
            // 判断多标签合理性，并填写上传payload
            let labelCount = 0;
            const payload_feature = {
                tableName: this.dialogForm.tableName,
                tableHeaders: [],
                userID: this.compelete_userId,
                node: this.compelete_node,
                size: this.compelete_size,
                tableDescribe: this.compelete_tableDescribe
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
                    this.getAllAdminDataTable();
                }
            });
        },

        getAllAdminDataTable() {
            getRequest(`/api/selectAdminDataManage`).then(res => {
                if (res.code == 200) {
                    console.log("ret data", res.data)
                    this.total = res.data.total;
                    this.adminDataManageList = res.data.list;
                } else {
                    console.logt("res", res.data)
                }
            })
        },

        getAdminDataTableByName(type) {
            if (this.type === '') {
                this.$message({
                    type: "warning",
                    message: "请在下拉框中选择一个搜索类型",
                });
                return;
            }
            if (this.searchByName === '') {
                this.$message({
                    type: "warning",
                    message: "请输入内容进行搜索",
                });
                return;
            }

            // 这里的type跟数据库的字段一致 table_name create_user class_path
            getRequest(`/api/selectDataByName`, {
                searchType: this.type,
                name: this.searchByName
            }).then(res => {
                if (res.code == 200) {
                    console.log("ret data", res.data)
                    this.total = res.data.total;
                    this.adminDataManageList = res.data.list;
                } else {
                    console.logt("res", res.data)
                }
            })


        },


        handleSizeChange(val) {
            this.params.size = val;
        },

        handleCurrentChange(val) {
            this.params.page = val;

        },
        // 数据表上传函数
        //新增多疾病
        upRequest(data) {
            if (this.selectedOptions.length < 1) {
                this.$message({
                    type: "warning",
                    message: "请选择该数据表应该属于什么病种",
                });
                return;
            }
            if (this.selectedOptions.length === 1 && this.selectedOptions[0] === '14') {
                console.log("开始上传文件");
                const payload = new FormData();
                const fileSize = data.file.size;

                const fileSizeInMB = (fileSize / 100000).toFixed(2)
                payload.append("file", data.file);
                payload.append("newName", this.dialogForm.tableName);
                payload.append("disease", "多疾病");
                payload.append("user", sessionStorage.getItem("username"));
                payload.append("uid", sessionStorage.getItem("userid"));
                payload.append("parentId", this.selectedOptions[0]);
                payload.append("parentType", "多疾病");
                payload.append("status", "2");
                payload.append(
                    "size",
                    fileSizeInMB
                );
                payload.append("is_upload", "1");
                payload.append("is_filter", "0");
                payload.append("uid_list", "");
                this.options = {
                    method: "post",
                    data: payload,
                    url: "api/dataTable/parseAndUpload",
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                };
                this.$axios(this.options).then((res) => {
                    console.log(this.options.data.get("uid"));
                    // 返回表头信息
                    this.loading = false;
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
                        this.featuresVision = true;
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
            }
            else {
                console.log("开始上传文件");

                const fileSize = data.file.size;

                const fileSizeInMB = (fileSize / 100000).toFixed(2)
                console.log("fileSize", fileSize, fileSizeInMB);

                const payload = new FormData();
                payload.append("file", data.file);
                payload.append("pid", this.pid);
                payload.append("tableName", this.dialogForm.tableName);
                payload.append("userName", sessionStorage.getItem("username"));

                payload.append("ids", this.selectedOptions)

                payload.append("uid", sessionStorage.getItem("userid"));
                payload.append("tableStatus", "2");
                payload.append("tableSize", fileSizeInMB);
                payload.append("current_uid", sessionStorage.getItem("userid"));

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
            }
        },
        uploadFile() {
            if (this.selectedOptions.length < 1) {
                this.$message({
                    type: "warning",
                    message: "请选择该数据表应该属于什么病种",
                });
                return;
            }
            // if (this.dialogForm.dataDisease2 === ''){
            //     this.$message({
            //         type: "warning",
            //         message: "请选择该数据表应该在什么二级病种",
            //     });
            //     return;
            // }
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
            }
        },
        deleteAdminDataManage(id, uid, tableId, tableSize, tableName) {
            console.log("delete:", this.adminDataManageList)
            getRequest(`/api/deleteByTableName`, {
                id: id,
                uid: uid,
                tableId: tableId,
                tableSize: tableSize,
                tableName: tableName,
                current_uid: sessionStorage.getItem("userid") - 0
            }).then(res => {
                if (res.code == 200) {
                    this.$message.success("删除数据表成功")
                    this.getAllAdminDataTable();
                } else {
                    this.$message.error("删除数据表失败");
                    this.getAllAdminDataTable();
                }
            })
        },

        getEditDataById(id, tableName, tableStatus) {
            this.oldTableName = tableName;
            this.is_cancel = tableStatus
            getRequest(`/api/selectDataById`, {
                id: id
            }).then(res => {
                if (res.code == 200) {
                    this.editAdminDataManageVisible = true;
                    this.adminDataManageForm = res.data.object;
                    this.selectedOptions2 = res.data.ids;
                } else {
                    this.$message.error("获取用户信息失败")
                    this.getAllAdminDataTable();

                }
            })
        },
        async confirmEditAdminDataManage() {
            if (this.selectedOptions2.length < 1) {
                this.$message({
                    type: "warning",
                    message: "请选择该数据表应该属于什么病种",
                });
                return;
            }
            this.adminDataManageForm.tableStatus = this.is_cancel;
            console.log("edit", this.adminDataManageForm.tableStatus, this.selectedOptions2);

            const payload = new FormData();
            payload.append("id", this.adminDataManageForm.id);
            payload.append("tableid", this.adminDataManageForm.tableId);
            payload.append("oldTableName", this.oldTableName);
            payload.append("tableName", this.adminDataManageForm.tableName);
            payload.append("tableStatus", this.adminDataManageForm.tableStatus)
            payload.append("pids", this.selectedOptions2);
            payload.append("current_uid", sessionStorage.getItem("userid") - 0);

            this.options = {
                method: "post",
                data: payload,
                url: "/api/updateAdminDataManage",
                headers: {

                },
            };
            await this.$axios(this.options).then((res) => {
                // 返回表头信息
                console.log(res);
                if (res?.code == "200") {
                    this.$message({
                        showClose: true,
                        type: "success",
                        message: "更改成功",

                    });

                } else {
                    this.$message({
                        showClose: true,
                        type: "error",
                        message: "更改失败",
                    });

                }
            });
            this.getAllAdminDataTable();
            this.editAdminDataManageVisible = false;
        },
        checkInfos(usernames){
            // 确保 usernames 是字符串
   
            if (typeof usernames !== 'string') {

                return "";
            }
            if (usernames==null || usernames.trim().length === 0){
                return "";
            }
            console.log("usernames", usernames)
            let infos = usernames.split(",");
            return infos.length;
        },
        
        selectTableByid(){
            this.selectTableLoading=true;
            getTableData("/api/getTableData", this.tid, this.tname)
                .then((res) => {
                    if (res.code == 200) {
                        this.selectTableVisible = true;
                        this.tableData = res.data;
                        console.log("tableData:", res.data)  
                        this.selectTableLoading=false;             
                    } else {
                        this.$message.error("获取表信息失败")                   
                    }                
                })
                .catch((error) => {
                    console.log(error);
                });            
        },

        getCheckDataById(id, tableName) { 
            this.tid=id;
            this.tname=tableName;
            getRequest(`/api/selectUsernamesById`, {
                id: id
            }).then(res => {
                if (res.code == 501){ // 自定义状态码
                    this.$message({
                        type: "warning",
                        message: "该数据集现在没有用户申请下载",
                    });
                    this.checkAdminDataManageVisible = false;
                    return;
                }

                if (res.code == 200) {
                    this.checkAdminDataManageVisible = true;
                    this.checkDataManageForm = res.data;
                    console.log("res.data:", res.data)               
                } else {
                    this.$message.error("获取用户信息失败")
                    this.getAllAdminDataTable();

                }
            })
        },

        updateCheckApprove(username, type){
            getRequest(`/api/updateCheckApprove`, {
                id: this.tid,
                username: username,
                type: type
            }).then(res => {
                if (res.code == 200) {                    
                    console.log("res.data:", res.data)       
                    this.getCheckDataById(this.tid, this.tname);    
                    this.getAllAdminDataTable();    
                } else {
                    this.$message.error("获取用户信息失败")
                    this.getAllAdminDataTable();
                }
            })
        },
        confirmUsenames(type) {
        if (this.multipleSelection.length < 1) {
            // 自定义状态码
            this.$message({
            type: "warning",
            message: "请选择至少一个用户进行审批",
            });
            return;
        }
        this.multipleLoding = true;

        let usernames = [];
        this.multipleSelection.forEach((selection) =>
            usernames.push(selection.username)
        );

        getRequest(`/api/updateCheckApproves`, {
            id: this.tid,
            multipleSelection: usernames.join(","),
            type: type,
        }).then((res) => {
            if (res.code == 200) {
            console.log("res.data:", res.data);
            this.getCheckDataById(this.tid, this.tname);
            this.getAllAdminDataTable();
            } else {
            this.$message.error("获取用户信息失败");
            this.getAllAdminDataTable();
            }
        });
        this.multipleLoding = false;
    },
        toggleSelection(rows) {
            if (rows) {
            rows.forEach(row => {
                this.$refs.multipleTable.toggleRowSelection(row);
            });
            } else {
            this.$refs.multipleTable.clearSelection();
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
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

.el-badge ::v-deep .el-badge__content{
        margin-top:8px
}
</style>