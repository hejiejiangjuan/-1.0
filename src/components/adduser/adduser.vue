<template>
  <div class="adduser">
    <div class="adduser-all">
      <el-form :label-position="labelPosition" label-width="100px" :model="formLabelAlign">
        <el-form-item label="用户姓名">
          <el-input v-model="formLabelAlign.userName"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="formLabelAlign.userPhone"></el-input>
        </el-form-item>

        <el-form-item label="用户性别">
          <el-select style="width:100%;" v-model="userSexvalue" placeholder="请选择性别">
            <el-option
              v-for="item in userSex"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户角色">
          <el-select style="width:100%;" filterable v-model="userRolevalue" placeholder="请选择用户角色">
            <el-option
            
              v-for="item in userRole"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户类型">
          <el-select style="width:100%;" v-model="userTypevalue" placeholder="用户类型" @change="focusselas">
            <el-option
              v-for="item in userType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="渠道和商户">
          <el-select
            style="width:100%;"
            v-if="isadmin"
            v-model="formLabelAlign.userId"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-input v-model="localSt" disabled v-else></el-input>
        </el-form-item>
        <el-form-item label="用户昵称">
          <el-input v-model="userNickName"></el-input>
        </el-form-item>
        <el-form-item label="登录账号">
          <el-input v-model="formLabelAlign.userCode"></el-input>
        </el-form-item>
      </el-form>
      <div class="btnuser">
        <el-button type="primary" @click="formBtn">添加</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Message } from "element-ui";
export default {
  data() {
    return {
      isadmin: false,
      labelPosition: "right",
      formLabelAlign: {
        userName: "",
        userPhone: "",
        userCode: "",
        userId: ""
      },
      userNickName: "",
      options: [],
      userRole: [],
      userSex: [
        {
          value: "1",
          label: "男"
        },
        {
          value: "2",
          label: "女"
        }
      ],
      userType: [],
      userSexvalue: "",
      userTypevalue: "",
      userRolevalue: "",
      localSt: ""
    };
  },
  mounted: function() {
    //进入页面加载所有角色
    this.getRoleList();
    this.userTypeList();
    this.localSt = localStorage.getItem("username");
    if (localStorage.getItem("username") == "admin") {
      return (this.isadmin = true);
    }
  },
  methods: {
    getRoleList() {
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
    userTypeList() {
      var that = this;
      this.$axios.post("/backstage/userInfo/getUserType").then(
        res => {
          if (res.data.code == 200) {
            that.userType = res.data.datas;
          }
        },
        err => {
          console.log(err);
        }
      );
    },
    // 渠道或商户
    focusselas() {
      var that = this;
      that.options=[];
      that.formLabelAlign.userId="";
      if(that.userTypevalue == '1'){
        var ortion={};
        ortion.value="admin";
        ortion.label="admin";
        that.options.push(ortion);
        return;
      }
      var params = new URLSearchParams();
      params.append("type", that.userTypevalue);
      this.$axios.post("/backstage/userInfo/getUserId",params).then(
        res => {
          if (res.data.code == 200) {
            that.options = res.data.datas;
          }
        },
        err => {
          console.log(err);
        }
      );
    },
    formBtn() {
      if (this.formLabelAlign.userName == "") {
        Message.error("值不能为空");
      } else if (this.formLabelAlign.userPhone == "") {
        Message.error("值不能为空");
      } else if (this.userSexvalue == "") {
        Message.error("值不能为空");
      } else if (this.userTypevalue == "") {
        Message.error("值不能为空");
      } else if (this.userNickName == "") {
        Message.error("值不能为空");
      } else if (this.formLabelAlign.userCode == "") {
        Message.error("值不能为空");
      } else if (this.formLabelAlign.userId == "") {
        this.formLabelAlign.userId=localStorage.getItem("username");
      } else if (this.userRolevalue == "") {
        Message.error("值不能为空");
      } else {
        var params = new URLSearchParams();
        let userInfo = JSON.stringify({
          userName: this.formLabelAlign.userName,
          userPhone: this.formLabelAlign.userPhone,
          userSex: this.userSexvalue,
          userType: this.userTypevalue,
          userNickname: this.userNickName,
          userCode: this.formLabelAlign.userCode,
          userId: this.formLabelAlign.userId
        });
        console.log(userInfo);
        params.append("userInfo", userInfo);
        params.append("roleId", this.userRolevalue);
        this.$axios.post("/backstage/userInfo/addUser", params).then(
          res => {
            if (res.data.code == 200) {
              console.log(202020);
              this.$router.push("/home/adduserList")
            } else {
            }
          },
          err => {
            console.log(err);
          }
        );
      }
    }
  }
};
</script>

<style>
.adduser {
  width: 100%;
  height: 100%;
}
.adduser-all {
  width: 60%;
  height: 100%;
  margin: 10px auto;
}
.btnuser {
  width: 100%;
  text-align: center;
}
</style>
