<template>
  <div class="login wh100 flex flex-vcenter">
    <div class="login-page margin-center">
      <el-container>
        <el-aside width="400px">
          <div class="aside align-center">
            <img src="../assets/Logo.png" alt>
          </div>
        </el-aside>
        <el-main>
          <div class="main">
            <p class="title align-l">黑豆旅行验证管理平台</p>
            <div class="form-data">
              <el-form
                ref="loginForm"
                :rules="rules"
                label-position="left"
                label-width="80px"
                :model="formLabel"
              >
                <el-form-item label="账号" prop="account">
                  <el-input type="email" v-model="formLabel.account" placeholder="请输入账号" clearable></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="pwd">
                  <el-input
                    type="password"
                    v-model="formLabel.pwd"
                    auto-complete="off"
                    placeholder="请输入密码"
                    clearable
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button class="addloginbtn" @click="addLogin('loginForm')">登录</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-main>
      </el-container>
      <div class="tbotton-botn" style="width:80%;height:60px;overflow: hidden; margin:0 auto;margin-top: 5%;" >
      <div class="botton-ctn" style="width:100%;height:50px;margin:0 auto; ">
        <span
          style="display:block;width:200px;height:20px;margin:0 auto;text-align:center;lin-height:20px;font-size:12px;
        "
        >蜀ICP备15003730号-1</span>
        <span
          style="display:block;width:100%;height:20px;margin:0 auto;text-align: center;lin-height:20px;font-size:12px;
        "
        >@Copyright2019黑豆旅行.AllRightsReserved.</span>
      </div>
    </div>
    </div>
    
  </div>
  
</template>
<script>
import Vue from "vue";
import { Form, FormItem, Input, Button, Message } from "element-ui";
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Button);

export default {
  data() {
    //   账号自定义校验
    var account = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("账号不能为空"));
      } else {
        return callback();
      }
    };

    //   密码自定义校验
    var pwd = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("密码不能为空"));
      } else if (!/^[a-zA-Z0-9]{3,8}$/.test(value)) {
        return callback(new Error("密码为3-8位的字母或数字"));
      } else {
        return callback();
      }
    };
    return {
      formLabel: {
        account: "",
        pwd: ""
      },
      againPwdVisible: false,
      rules1: {
        account: [{ validator: account, trigger: "blur" }],
        pwd: [{ validator: pwd, trigger: "blur" }]
      },
      rules: {}
    };
  },
  methods: {
    addReg(formName) {
      if (this.againPwdVisible) {
        // 提交表单
        this.rules = this.rules2;
        this.submitForm(formName);
      } else {
        this.againPwdVisible = true;
      }
    },
    addLogin(formName) {
      this.rules = this.rules1;
      this.submitForm(formName);
    },
    submitForm(formName) {
      var that = this;
      this.$refs[formName].validate(valid => {
        console.log(valid);

        if (valid) {
          var username = that.formLabel.account;
          var password = that.formLabel.pwd;
          var params = new URLSearchParams();
          params.append("username", username);
          params.append("password", password);
          that.$axios.post("/backstage/login/dologin", params).then(
            res => {
              var data = res.data;
              if (data.code == 200) {
                localStorage.setItem("username", that.formLabel.account);
                setTimeout(() => {
                  this.$router.push({ path: "/home" });
                }, 100);
              } else {
                Message.error("登录失败");
                return false;
              }
            },
            err => {
              console.log(err);
            }
          );
          // TODO:to check login
        } else {
          Message.error("登录失败");
          return false;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.login {
  background: #f7f7f7;
}
.addloginbtn {
  padding: 10px 0;
}
.login-page {
  width: 60%;
  height: 400px;
  background: #eee;
  border: 1px solid #eaeefb;
  box-shadow: 0 0 2px #ededed;

  .aside {
    padding-top: 30%;
    height: 400px;
  }

  .title {
    padding: 20px 0 40px;
    font-size: 20px;
    color: #303133;
    font-weight: bold;
  }

  .form-data {
    width: 80%;
  }
  .el-button {
    width: 100%;
    height: 100%;
  }
}
.el-main > .main > .title .align-l {
  line-height: 0;
}
</style>


