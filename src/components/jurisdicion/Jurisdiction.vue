<template>
  <div class="jurisdiction">
    <div class="jurisdiction-left">
      <ul class="jurisdiction-left-il">
        <li class="permission-ul-li" v-for="item in roleList" :key="item.val">
          <span class="permission-ul-li-span permission-ul-li-spanadmin">角色：{{item.name}}</span>
          <div class="permission-div-span">
            <span class="permission-span permission-ul-li-spanadlook" @click="lookJust(item.val)">查看</span>
            <span
              class="permission-span permission-ul-li-spanadminbianji"
              @click="editor(item.val)"
            >编辑</span>
          </div>
        </li>
      </ul>
      <div class="jurisdiction-left-jia" @click="tianjiaList">+</div>
      <div class="divbtn-ing" v-if="addshow">
        <input class="btn-ing" type="text" v-model="btnvalue" placeholder="请输入角色名称">
        <button class="okBtn" @click="okroleBtn">确定</button>
      </div>
    </div>
    <div class="jurisdiction-right">
      <!-- 查看权限 -->
      <el-tree :data="data" :props="defaultProps" v-show="islook"></el-tree>
      <!-- 编辑权限 -->
      <div class="buttons" v-show="istree" @click="subMent">提交</div>
      <el-tree
        v-show="istree"
        :data="data"
        show-checkbox
        node-key="id"
        ref="treexin"
        :default-checked-keys="datalist"
        :props="defaultProps"
      ></el-tree>
      <!-- 新添加角色 -->
      <div class="isxin" v-show="isxin">请选择角色权限！</div>
      <el-tree
        v-show="isxin"
        :data="datapron"
        show-checkbox
        node-key="id"
        ref="tree"
        :props="defaultProps"
      ></el-tree>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { Message } from "element-ui";
Vue.use(Message);
export default {
  data() {
    return {
      roleList: [],
      addshow: false,
      islook: false,
      istree: false,
      isxin: false,
      btnvalue: "",
      data: [],
      datapron: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      roleId: "",
      datalist: [],
      powerlist: []
    };
  },
  mounted: function() {
    this.allroleList();
    this.allList();
  },
  methods: {
    // 点击提交
    subMent() {
      var that = this;
      that.powerlist=[];
      var val = this.$refs.treexin.getCheckedKeys();
      //原始数据
      const tdchildren = [];
      //对比val后数据
      const tdval = [];

      for (const i in that.data) {
        for (const k in that.data[i].children) {
          tdchildren.push(that.data[i].children[k]);
        }
      }

      for (const k in tdchildren) {
        for (const n in val) {
          if (tdchildren[k].id == val[n]) {
            tdval.push(tdchildren[k].powerId);
            tdval.push(val[n]);
          }
        }
      }
      debugger;
      // 去掉重复的父节点
      var newArr = [];
      tdval.forEach(function(e) {
        if (!newArr.includes(e)) {
          newArr.push(e);
        }
      });
      for (const i in newArr) {
        var rolePower = {};
        rolePower.rId = that.roleId;
        rolePower.pId = newArr[i];
        that.powerlist.push(rolePower);
      }
      var params = new URLSearchParams();
      params.append("roleId", that.roleId);
      params.append("rolePower", JSON.stringify(that.powerlist));debugger
      that.$axios.post("/backstage/role/updateRolePower", params).then(
        res => {
          Message.success("提交成功！");
          this.istree = false;
          this.allroleList();
        },
        err => {
          Message.error("提交失败");
        }
      );
    },
    //角色初始化
    allroleList() {
      var that = this;
      var params = new URLSearchParams();
      this.$axios.post("/backstage/role/getRoleList").then(
        res => {
          console.log(res);
          that.roleList = res.data.datas;
        },
        err => {
          console.log(err);
        }
      );
    },
    //列表初始化
    allList() {
      var that = this;
      var params = new URLSearchParams();
      that.$axios.post("/backstage/power/getPowerByRoleList").then(
        res => {
          console.log(res);
          var ondata = [];
          var power = res.data.datas;
          for (var i = 0; i < power.length; i++) {
            var role = {};
            role.label = power[i].title;
            role.id = power[i].key;
            var children = [];
            for (var k = 0; k < power[i].children.length; k++) {
              var rolePower = {};
              rolePower.label = power[i].children[k].title;
              rolePower.id = power[i].children[k].key;
              rolePower.powerId = power[i].children[k].powerId;
              children.push(rolePower);
              role.children = children;
            }
            ondata.push(role);
          }
          that.data = ondata;
        },
        err => {
          console.log(err);
        }
      );
    },
    // 查看
    lookJust(val) {
      this.addshow = false;
      this.isxin = false;
      var that = this;
      var params = new URLSearchParams();
      params.append("roleId", val);
      this.$axios.post("/backstage/power/getPowerByRoleId", params).then(
        res => {
          that.islook = true;
          that.istree = false;
          var ondata = [];
          var power = res.data.datas;
          for (var i = 0; i < power.length; i++) {
            var role = {};
            role.label = power[i].powerName;
            role.id = power[i].pId;
            var children = [];
            for (var k = 0; k < power[i].power.length; k++) {
              var rolePower = {};
              rolePower.label = power[i].power[k].powerName;
              rolePower.id = power[i].power[k].pId;
              children.push(rolePower);
              role.children = children;
            }
            ondata.push(role);
          }
          that.data = ondata;
        },
        err => {
          Message.error("加载失败失败");
        }
      );
    },
    // 编辑权限
    editor(val) {
      this.islook = false;
      this.istree = true;
      this.addshow = false;
      this.isxin = false;
      this.roleId = val;
      var that = this;
      var params = new URLSearchParams();
      that.$axios.post("/backstage/power/getPowerByRoleList").then(
        res => {
          console.log(res);
          var ondata = [];
          var power = res.data.datas;
          for (var i = 0; i < power.length; i++) {
            var role = {};
            role.label = power[i].title;
            role.id = power[i].key;
            var children = [];
            for (var k = 0; k < power[i].children.length; k++) {
              var rolePower = {};
              rolePower.label = power[i].children[k].title;
              rolePower.id = power[i].children[k].key;
              rolePower.powerId = power[i].children[k].powerId;
              children.push(rolePower);
              role.children = children;
            }
            ondata.push(role);
          }
          that.data = ondata;
        },
        err => {
          console.log(err);
        }
      );
      params.append("roleId", val);
      this.$axios.post("/backstage/power/getPowerByRoleId", params).then(
        res => {
          console.log(res);
          var ondata = [];
          var power = res.data.datas;
          for (var i = 0; i < power.length; i++) {
            ondata.push(power[i].pId);
            var children = [];
            for (var k = 0; k < power[i].power.length; k++) {
              ondata.push(power[i].power[k].pId);
            }
          }
          that.datalist = ondata;
        },
        err => {
          // console.log(err);
        }
      );
    },
    // 添加角色
    tianjiaList() {
      this.addshow = true;
      this.isxin = true;
      this.istree = false;
      this.islook = false;
      var that = this;
      var params = new URLSearchParams();
      that.$axios.post("/backstage/power/getPowerByRoleList").then(
        res => {
          var ondata = [];
          var power = res.data.datas;
          for (var i = 0; i < power.length; i++) {
            var role = {};
            role.label = power[i].title;
            role.id = power[i].key;
            var children = [];
            for (var k = 0; k < power[i].children.length; k++) {
              var rolePower = {};
              rolePower.label = power[i].children[k].title;
              rolePower.id = power[i].children[k].key;
              rolePower.powerId = power[i].children[k].powerId;
              children.push(rolePower);
              role.children = children;
            }
            ondata.push(role);
          }
          that.datapron = ondata;
        },
        err => {
          console.log(err);
        }
      );
    },
    // 确定添加角色
    okroleBtn() {
      var that = this;
      var val = that.$refs.tree.getCheckedKeys();
      //原始数据
      const tdchildren = [];
      //对比val后数据
      const tdval = [];

      for (const i in that.data) {
        for (const k in that.data[i].children) {
          tdchildren.push(that.data[i].children[k]);
        }
      }
      for (const k in tdchildren) {
        for (const n in val) {
          if (tdchildren[k].id == val[n]) {
            tdval.push(tdchildren[k].powerId);
            tdval.push(val[n]);
          }
        }
      }
      // 去掉重复的父节点
      var newArr = [];
      tdval.forEach(function(e) {
        if (!newArr.includes(e)) {
          newArr.push(e);
        }
      });
      for (const i in newArr) {
        var rolePower = {};
        rolePower.pId = newArr[i];
        that.powerlist.push(rolePower);
      }
      console.log(that.powerlist);
      if (that.btnvalue != "" && that.powerlist != "") {
        var params = new URLSearchParams();
        params.append("roleName", that.btnvalue);
        params.append("rolePower", JSON.stringify(that.powerlist));
        that.$axios.post("/backstage/role/addRolePower", params).then(
          res => {
            if (res.data.code == 200) {
              this.addshow = false;
              this.isxin = false;
            } else {
            }
          },
          err => {
            Message.error("添加失败失败！");
          }
        );
      } else {
        Message.error("内容为空！");
      }
    }
  }
};
</script>

<style>
.jurisdiction {
  width: 100%;
  height: 100%;
  display: flex;
}
.jurisdiction-left {
  width: 540px;
  height: 90%;
  background: #ffffff;
  overflow-x: hidden;
}
.jurisdiction-left-jia {
  width: 50px;
  height: 50px;
  text-align: center;
  line-height: 50px;
  border: 1px solid #cccccc;
  border-radius: 50%;
  margin: 15px auto;
}
.permission-ul-li {
  width: 100%;
  padding: 10px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.permission-ul-li-span {
  display: block;
}
.permission-span {
  display: inline-block;
  width: 68px;
  height: 32px;
  border-radius: 50px;
  text-align: center;
  line-height: 32px;
  background: #cccccc;
}
.permission-ul-li-spanadminbianji {
  background: #409eff;
}
.divbtn-ing {
  width: 100%;
  height: 40px;
  margin: 10px 5px;
}
.btn-ing {
  width: 65%;
  height: 100%;
  border: 1px solid #cccccc;
  text-align: center;
}
.okBtn {
  width: 30%;
  height: 100%;
  border: none;
  background: #cccccc;
}
.jurisdiction-right {
  width: 100%;
  height: 100%;
  background: #ffffff;
  margin-left: 20px;
}
.isxin {
  font-size: 25px;
  padding: 15px 20px;
  color: red;
}
.buttons {
  width: 110px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  background: #409eff;
  margin: 15px 10px;
  color: #ffffff;
  border-radius: 20px;
}
</style>
