<template>
  <div class="table_box">
    <el-form :inline="true" :model="xinxiFrom" class="demo-form-inline">
      <el-form-item class="elitme-width">
        <el-input v-model="xinxiFrom.abbreviation" placeholder="简称"></el-input>
      </el-form-item>
      <el-form-item class="elitme-width">
        <el-input class="inputqudao" v-model="xinxiFrom.merchantNo" placeholder="编号"></el-input>
      </el-form-item>
      <el-form-item class="elitme-width">
        <el-input v-model="xinxiFrom.companyName" placeholder="公司名"></el-input>
      </el-form-item>
      <el-form-item class="enter">
        <el-button type="primary" icon="el-icon-search" @click="searchMer">搜索</el-button>
      </el-form-item>
      <el-table :data="tableData" border style="width: 100%;">
        <el-table-column prop="abbreviation" label="简称" align="center" width="100">
          <template slot-scope="scope">
            <span v-if="!scope.row.isEgdit">{{scope.row.abbreviation}}</span>
            <el-input v-if="scope.row.isEgdit" v-model="scope.row.abbreviation"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="merchantNo" label="编号" align="center" width="100">
          <template slot-scope="scope">
            <span v-if="!scope.row.isEgdit">{{scope.row.merchantNo}}</span>
            <el-input v-if="scope.row.isEgdit" v-model="scope.row.merchantNo"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="companyName" label="公司名" align="center" width="100">
          <template slot-scope="scope">
            <span v-if="!scope.row.isEgdit">{{scope.row.companyName}}</span>
            <el-input v-if="scope.row.isEgdit" v-model="scope.row.companyName"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="linkman" label="联系人" align="center">
          <template slot-scope="scope">
            <span v-if="!scope.row.isEgdit">{{scope.row.linkman}}</span>
            <el-input v-if="scope.row.isEgdit" v-model="scope.row.linkman"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="job" label="职位" align="center">
          <template slot-scope="scope">
            <span v-if="!scope.row.isEgdit">{{scope.row.job}}</span>
            <el-input v-if="scope.row.isEgdit" v-model="scope.row.job"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" align="center">
          <template slot-scope="scope">
            <span v-if="!scope.row.isEgdit">{{scope.row.phone}}</span>
            <el-input v-if="scope.row.isEgdit" v-model="scope.row.phone"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="telephone" label="座机号" align="center">
          <template slot-scope="scope">
            <span v-if="!scope.row.isEgdit">{{scope.row.telephone}}</span>
            <el-input v-if="scope.row.isEgdit" v-model="scope.row.telephone"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" align="center">
          <template slot-scope="scope">
            <span v-if="!scope.row.isEgdit">{{scope.row.email}}</span>
            <el-input v-if="scope.row.isEgdit" v-model="scope.row.email"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="companyAddr" label="地址" align="center">
          <template slot-scope="scope">
            <span v-if="!scope.row.isEgdit">{{scope.row.companyAddr}}</span>
            <el-input v-if="scope.row.isEgdit" v-model="scope.row.companyAddr"></el-input>
          </template>
        </el-table-column>
        <el-table-column  label="操作" align="center" >
          <template slot-scope="scope">
            <el-button
              v-if="!scope.row.isEgdit"
              type="text"
              size="small"
              @click="edit(scope.$index,scope.row)"
              circle
            >编辑</el-button>
            <el-button
              v-if="scope.row.isEgdit"
              type="text"
              size="small"
              @click="editSuccess(scope.$index,scope.row)"
              circle
            >确定</el-button>
            <el-button
              v-if="scope.row.isEgdit"
              type="text"
              size="small"
              @click="editCancel(scope.$index,scope.row)"
              circle
            >取消</el-button>
            <!-- <el-button
              @click.native.prevent="deleteItem(scope.$index, tableData)"
              type="text"
              size="small"
              circle
            >删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="curPage"
        :page-size="pageSize"
        layout="total,prev, pager, next, jumper"
        :total="counts"
      ></el-pagination>
    </el-form>
    <div class="tbotton-botn" style="width:80%;height:60px;overflow: hidden; margin:0 auto;margin-top: 35%;" >
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
</template>

<script>
import Vue from "vue";
import { Message } from "element-ui";
export default {
  data() {
    return {
      xinxiFrom: {
        abbreviation: "",
        merchantNo: "",
        companyName: ""
      },
      tableData: [],
      curPage: 1,
      pageSize: 10,
      counts: 0, //总条数
      delIndex: -1
    };
  },
  created() {
    this.selectTablelist();
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.curPage = val;
      this.selectTablelist();
    },
    searchMer() {
      //搜索
      this.curPage = 1;
      this.selectTablelist();
    },
    //渲染页面
    selectTablelist() {
      var that = this;
      var param = JSON.stringify({
        curPage: that.curPage,
        pageSize: that.pageSize,
        abbreviation: that.xinxiFrom.abbreviation,
        merchantNo: that.xinxiFrom.merchantNo,
        companyName: that.xinxiFrom.companyName
      });
      var params = new URLSearchParams();
      params.append("param",param);
      this.$axios
        .post("/backstage/merchant/getMerchantList", params, {})
        .then(resp => {
          that.counts = resp.data.datas.counts;
          that.tableData = resp.data.datas.list;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //删除数据
    deleteItem(index, tableData) {
      this.delIndex = index;
      this.$MessageBox
        .confirm("此操作将删除该记录, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          var that = this;
          // var param = JSON.stringify({params :{ id: that.tableData.id }});
          that.$axios
            .get(
              this.$baseUrl +
                "merchant/delMerchant" +
                "?id=" +
                that.tableData[that.delIndex].id
            )
            .then(resp => {
              that.selectTablelist();
              console.log(resp);
            })
            .catch(function(error) {
              console.log(error);
            });
        })
        .catch(() => {});
    },
    //编辑数据
    edit(index, row) {
      this.$set(row, "isEgdit", true);
    },
    editCancel(index, row){
      this.$set(row, "isEgdit", false);
      this.selectTablelist();
    },
    //编辑成功
    editSuccess(index, row) {
      this.$set(row, "isEgdit", false);
      var that = this;
      var params = new URLSearchParams();
      params.append("row",JSON.stringify(row));
      this.$axios
        .post("/backstage/merchant/updateMerchant", params, {})
        .then(resp => {
          that.selectTablelist();
          if (resp.data.code == 200) {
            Message.success("修改成功");
          } else {
            Message.error(resp.data.message);
          }
        })
        .catch(function(error) {
          that.selectTablelist();
          Message.error("修改失败！");
        });
    }
  }
};
</script>
<style>
.table_box {
  height: 100%;
}
.merchenlisttop {
  width: 100%;
  height: 100%;
}
.elitme-width {
  width: 10%;
}
.elitme-width input {
  width: 100%;
}
.selectText {
  width: 10% !important;
}

.payDate {
  width: 15%;
}
.payDate div {
  width: 100% !important;
}
.payDate input {
  width: 100%;
}
.enter {
  width: 3%;
}
.enter button {
  width: 100%;
}
</style>
