<template>
<el-container>
  <el-header>
    <h2>验证管理平台</h2>
    <div class="name">
      <!-- <div class="username"></div> -->
      <p class="p">{{username}}</p>
      <div class="toptitle">
            <i class="el-icon-setting el-ssicon-setting"></i>
            <span class="title" @click="loginOut">退出</span>
        </div>
      </div>
    </el-header>
    <el-container class="wh100">
      <el-aside width="240px">
        <el-aside width="240px" height="100%">
          <el-menu background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
            <el-submenu v-for="item in all" :key="item.pId" :index="item.pId">
            <template slot="title">
              <i :class="item.icon"></i>
              {{item.powerName}}
            </template>
            <el-menu-item-group v-for="item in item.power" :key="item.id">
              <el-menu-item :index="item.pId" @click="goArtLists(item.powerUrl)">{{item.powerName}}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          </el-menu>
        </el-aside>
      </el-aside>
      <el-main height="100%">
        <router-view>
        </router-view>
      </el-main>
      
    </el-container>
  </el-container>
</template>
<script>
import Vue from "vue";
import { Menu, Submenu, MenuItem, MenuItemGroup } from "element-ui";
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);

export default {
  data() {
    return {
      isShow: true,
      username :'',
      all: [],
    };
  },
  created(){
   this.getPowerList()
   var isTo = localStorage.getItem('username');
   this.username = isTo;
   if(isTo == 'admin'){
     this.isShow = true;
   }else{
     this.isShow = false;
   }
  },
  methods: {
    loginOut() {
      var that = this;
      that.$axios.post("/backstage/login/loginout").then(
        res => {
          var data = res.data;
          if (data.code == 200) {
            setTimeout(() => {
              this.$router.push({ path: "/login" });
            }, 100);
          } else {
            Message.error("退出失败");
            return false;
          }
        },
        err => {
          console.log(err);
        }
      );
    },

    goArtLists(url) {
      this.$router.push({ path: url });
    },
    getPowerList() {
      var that = this;
      var params = new URLSearchParams();
      params.append("roleId", 2);
      this.$axios.post("/backstage/power/getPowerByRoleId").then(
        res => {
          console.log(res);
          if (res.data.code == "200") {
            that.all = res.data.datas;
          } else if (res.data.code == "205") {
            this.$message.error("身份失效！");
          }
        },
        err => {
          console.log(err);
        }
      );
    },
  }
};
</script>

<style lang="scss" scoped>

.el-table thead{
  color: #f0f0f2;
}
.el-header {
  background: #545c64;
}
.el-aside {
  width: 240px;
  height: 100%;
  overflow-x: hidden;
}
.el-container,
.wh100 {
  height: 100%;
}
.el-table {
  height: 100%;
}
.el-menu {
  height: 100%;
  background-color: #545c64;
}
.el-main {
  position: relative;
  background: #f0f0f2;
  .pop-arr {
    position: absolute;
    top: 0;
    left: 0;

    .el-button {
      background-color: #eee;
      padding-top: 6px;
      padding-bottom: 6px;
    }
  }
}
.el-header {
  position: relative;
}
.el-form-item__content{
  line-height: 28px;
}
.header-limg {
  width: 85px;
  height: 40px;
  background: #eee;
  position: absolute;
  top: 5px;
  left: 20px;
}
h2 {
  width: 400px;
  font-size: 30px;
  padding-left: 50px;
  color: aliceblue;
  margin-top:5px;
}
.name {
  width: 200px;
  height: 50px;
  // background: #eee;
  display: flex;
  position: absolute;
  right: 20px;
  top: 5px;
  color: #eee;
}
.el-submenu__title {
  color: #eee;
}
.menu {
  color: #eee;
}
.username {
  width: 30px;
  height: 30px;
  margin-top: 10px;
  margin-left: 5px;
  background: coral;
  border-radius: 50%;
}
.p {
  width: 50px;
  height: 50px;
  text-align: center;
  line-height: 50px;
  color: #eee;
}
.toptitle {
  width: 70px;
  height: 50px;
  display: flex;
  text-align: center;
  line-height: 50px;
  margin-left: 25px;
  color: #eee;
}
.el-ssicon-setting {
  // padding: 30% 5px;
  margin-right: 5px;
  line-height: 50px;
}
.title {
  color: #eee;
}
</style>


