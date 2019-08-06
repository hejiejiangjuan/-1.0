<template>
  <div class="adduserlist">
    <div class="adduserlist-top">
      <div class="elinput">
        <el-input v-model="usName" placeholder="用户姓名"></el-input>
      </div>
      <div class="elinput" style="margin-right:1%">
        <el-select v-model="usType" placeholder="请选择">
          <el-option
            v-for="item in opDate"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <el-button type="primary" @click="chaxunApi">查询</el-button>
    </div>
    <div class="adduser-table">
      <el-table :data="tableData" border style="width: 100%" v-loading="loading" element-loading-text="数据加载中">
        <el-table-column fixed prop="userName" label="用户姓名" ></el-table-column>
        <el-table-column prop="userSex" label="用户性别" ></el-table-column>
        <el-table-column prop="userPhone" label="手机号" ></el-table-column>
        <el-table-column prop="roleName" label="用户角色" ></el-table-column>
        <el-table-column prop="userType" label="用户类型" ></el-table-column>
        <el-table-column prop="userNickname" label="用户昵称" ></el-table-column>
        <el-table-column prop="userCode" label="登录账号" ></el-table-column>
        <el-table-column prop="userFlag" label="账号状态" ></el-table-column>
        <el-table-column label="操作"  width="150" fixed = "right">
          <template slot-scope="scope">
            <el-button
              @click="forbidden(scope.row)"
              type="text"
              size="small"
              v-if="scope.row.userFlag=='正常'"
            >禁用</el-button>
            <el-button @click="forbidden(scope.row)" type="text" size="small" v-else>启用</el-button>
            <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 弹出编辑框 -->
      <el-dialog title="修改" :visible.sync="dialogFormVisible">
        <el-form :model="form" label-width="100px">
          <el-form-item label="用户昵称" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="登录账号" :label-width="formLabelWidth">
            <el-input v-model="form.Code" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="性别" :label-width="formLabelWidth">
            <el-select v-model="userSex"  style="width:100%;" placeholder="请选择性别">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="手机号" :label-width="formLabelWidth">
            <el-input v-model="form.phone" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="用户姓名" :label-width="formLabelWidth">
            <el-input v-model="form.tiname" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="用户角色" :label-width="formLabelWidth">
            <el-select style="width:100%;" v-model="userRolevalue" placeholder="请选择用户角色">
              <el-option
                  filterable
                v-for="item in userRole"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogOk">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 弹出提示框 -->
      <el-dialog title="提示" :visible.sync="centerDialogVisible" width="30%" center>
        <span style="display:block;width:100%;margin:0 auto;color:red;">你是否要{{biddentext}}该账号？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="biddenOk">确 定</el-button>
        </span>
      </el-dialog>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pageNum"
        :page-size="pageSize"
        layout="total,prev, pager, next, jumper"
        :total="count"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { Message } from "element-ui";
export default {
  data() {
    return {
      loading: false,
      usName: "",
      usCode: "",
      usPhone: "",
      userName: "",
      pageNum: 1,
      pageSize: 8,
      count: 0,
      tableData: [],
      userRole: [],
      userRolevalue: "",
      options: [
        {
          value: "1",
          label: "男"
        },
        {
          value: "2",
          label: "女"
        },
        {
          value: "0",
          label: "未知"
        }
      ],
      opDate: [{
          value: '0',
          label: '请选择'
        }, {
          value: '1',
          label: '工作人员'
        }, {
          value: '2',
          label: '商家'
        }, {
          value: '3',
          label: '渠道'
        }],
        usType: '',
      userSex: "",
      biddentext: null,
      uesrform: null,
      centerDialogVisible: false,
      row: null,
      dialogFormVisible: false,
      form: {
        name: "",
        Code: "",
        phone: "",
        tiname: "",
        cosplay: ""
      },
      formLabelWidth: "120px"
    };
  },
  mounted: function() {
    this.getRoleList();
    this.userName = localStorage.getItem("username");
  },
  methods: {
    // 禁用
    forbidden(row) {
      console.log(row);
      this.centerDialogVisible = true;
      if (row.userFlag == "正常") {
        this.biddentext = "禁用";
      } else if (row.userFlag == "禁用") {
        this.biddentext = "启用";
      }
      this.row = row;
    },
    biddenOk() {
      var that = this;
      var params = new URLSearchParams();
      var flag = "";
      var type = "";
      if (that.row.userFlag == "正常") {
        flag = 2;
        type = "禁用";
      } else {
        flag = 1;
        type = "启用";
      }
      let userInfo = JSON.stringify({
        id: that.row.id,
        userFlag: flag
      });
      params.append("userInfo", userInfo);
      this.$axios.post("/backstage/userInfo/updateUser", params).then(
        res => {
          if (res.data.code == 200) {
            this.centerDialogVisible = false;
            this.getRoleList();
          } else {
            console.log("修改失败！");
          }
        },
        err => {
          console.log(err);
        }
      );
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getRoleList();
      console.log(`当前页: ${val}`);
    },
    // 查询
    chaxunApi() {
      var that = this;
      var params = new URLSearchParams();
      if (this.usName != "") {
        params.append("userName", this.usName);
      } else if (this.usType != "0") {
        params.append("userType", this.usType);
      }
      params.append("pageNum", this.pageNum);
      params.append("pageSize", this.pageSize);
      that.loading=true;
      this.$axios.post("/backstage/userInfo/getUserList", params).then(
        res => {
          if (res.data.code == 200) {
            console.log(res.data.datas);
            that.tableData = res.data.datas.userInfoList;
            that.count = res.data.datas.userInfoCount;
            that.loading=false;
          }
        },
        err => {
          console.log(err);
        }
      );
    },
    //初始化表格
    getRoleList() {
      debugger;
      var that = this;
      var params = new URLSearchParams();
      params.append("pageNum", this.pageNum);
      params.append("pageSize", this.pageSize);
      that.loading=true;
      this.$axios.post("/backstage/userInfo/getUserList", params).then(
        res => {
          if (res.data.code == 200) {
            console.log(res.data.datas);
            that.tableData = res.data.datas.userInfoList;
            that.count = res.data.datas.userInfoCount;
            that.loading=false;
          }
        },
        err => {
          console.log(err);
        }
      );
    },
    //编辑
    handleClick(row) {
      console.log(row);
      this.form.name = row.userNickname;
      this.form.Code = row.userCode;
      this.form.phone = row.userPhone;
      this.form.tiname = row.userName;
      this.userRolevalue = row.roleName;
      this.userSex = row.userSex;
      this.dialogFormVisible = true;
      this.uesrform = row;
      var that = this;
      this.$axios.post("/backstage/userInfo/roleList").then(
        res => {
          if (res.data.code == 200) {
            var arr = [];
            var res = res.data.datas;
            for (const i in res) {
              var str = {};
              str.value = res[i].val;
              str.label = res[i].name;
              arr.push(str);
            }
            that.userRole = arr;
          }
        },
        err => {
          console.log(err);
        }
      );
    },
    dialogOk() {
      var params = new URLSearchParams();
      let userInfo = JSON.stringify({
        id: this.uesrform.id,
        userName: this.form.tiname,
        userPhone: this.form.phone,
        userSex: this.value,
        userNickname: this.form.name,
        userCode: this.form.Code
      });
      params.append("userInfo", userInfo);
      params.append("roleId", this.userRolevalue);

      this.$axios.post("/backstage/userInfo/updateUser", params).then(
        res => {
          debugger;
          if (res.data.code == 200) {
            Message.success("修改成功！");
            this.getRoleList();
            this.dialogFormVisible = false;
          } else {
          }
        },
        err => {
          console.log(err);
        }
      );
    }
  }
};
</script>

<style>
.adduserlist {
  width: 100%;
}

.el-table {
}
.elinput {
  width: 20%;
  margin-right: 3%;
  float: left;
}
.adduser-table {
  /* width: 100%; */
  /* height: 100%; */
  margin-top: 20px;
}
</style>
