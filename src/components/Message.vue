<template>
<div style="height:100%;width:100%;">
  <el-form :inline="true" :model="formInline" class="demo-form-inline classtoe">
    <div class="form-item">
      <!-- <div class="div-phone2"> 
        <el-input v-model="tell" placeholder="手机号"></el-input>
      </div>-->
      <div class="div-phone">
        <el-input  v-model="verificationCode" placeholder="验证码"></el-input>
      </div>

      <div class="div-phone1">
        <el-button type="primary" @click="verification">验证</el-button>
      </div>
    </div>
    <el-form-item>
      <el-input v-model="phone" placeholder="手机号或订单编号"></el-input>
    </el-form-item>
    <el-form-item>
      <el-input v-model="order_no" placeholder="商品编码"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="getOrderList">搜索</el-button>
    </el-form-item>
    <el-table :data="orderList" border style="width: 100%" v-loading="loading" element-loading-text="数据加载中">
      <el-table-column prop="orderId" label="订单编号" width="180"></el-table-column>
      <el-table-column prop="payNum" label="购买数量" width="180"></el-table-column>
      <el-table-column prop="phone" label="手机号"></el-table-column>
      <el-table-column prop="type" label="票务类型"></el-table-column>
      <el-table-column prop="payDate" label="购买时间"></el-table-column>
      <el-table-column prop="createDate" label="验证时间"></el-table-column>
      <el-table-column prop="code" label="验证码"></el-table-column>
      <el-table-column prop="status" label="状态"></el-table-column>
    </el-table>
    <div class="orderSumCount"> 当前订单的门票总数为:{{orederSum}}</div>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="Page"
      :page-size="pageSize"
      layout="total,prev, pager, next, jumper"
      :total="count"
    ></el-pagination>
  </el-form>
  <div class="tbotton-botn" style="width:80%;height:60px;overflow: hidden; margin:0 auto;margin-top: 40%;" >
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
export default {
  data() {
    return {
      orderList: [],
      formInline: {
        user: "",
        region: ""
      },
      orederSum:0,
      dialogVisible: false,
      startDate: "",
      endDate: "",
      channel_id: "",
      order_no: "",
      phone: "",
      verificationCode: "",
      message: "",
      datas: "",
      tell: "",
      Page: 1,
      count: 0,
      pageSize: 10,
      status:2,
      loading:true,
    };
  },
  mounted: function() {
    this.select();
    this.selectCount();
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.Page = val;
      this.select();
    },
    getOrderList(){
    this.Page=1;
    this.select();
    this.selectCount();
    },
    selectCount() {
      var params = new URLSearchParams();
      var that = this;
      params.append("userName", localStorage.getItem("username"));
      if (that.phone != "") {
        params.delete("status");
        params.append("phone", that.phone);
      }
      if (that.order_no != "") {
        params.delete("status");
        params.append("order_no", that.order_no);
      }
      params.append("status", that.status);
      this.$axios
        .post("/backstage/order/getCount", params, {})
        .then(response => {
          console.log(response);
          this.count = response.data.datas.count;
          this.orederSum = response.data.datas.sum;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    select() {
      var params = new URLSearchParams();
      var that = this;
      params.append("pageNum", this.Page);
      params.append("pageSize", this.pageSize);
      params.append("userName",localStorage.getItem('username'));
      params.append("status",that.status);
      debugger
      if (that.phone != "") {
        params.delete("status");
        params.append("phone", that.phone);
      }
      if (that.order_no != "") {
        params.delete("status");
        params.append("order_no", that.order_no);
      }
      that.loading=true;
      this.$axios
        .post("/backstage/order/getOrderList", params, {})
        .then(response => {
          this.orderList = response.data.datas.orderList;
          that.loading=false;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    verification() {
      var params = new URLSearchParams();
      var that = this;
      params.append("code", this.verificationCode);
      params.append("userName",localStorage.getItem('username'));
      // params.append("phone", this.tell);
      this.$axios
        .post("/backstage/order/updateOrder", params, {})
        .then(response => {
          console.log(response);
          that.message = response.data.message;
          that.datas = response.data.datas;
          this.open();
          that.select();
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
    open() {
      // this.$MessageBox.alert(this.message, this.datas, {
      //   confirmButtonText: "确定",
      //   callback: action => {
      //     // this.$message({
      //     //   type: "info",
      //     //   message: `action: ${action}`
      //     // });
      //   }
      // });

      this.$MessageBox.alert(this.message, this.datas, {
          dangerouslyUseHTMLString: true
        });
    },
    handleClick(id) {}
  }
};
</script>

<style>
.stornod{
  margin:20px 0; 
  display: block;
  text-align: center;
  font-size: 20px;
}
.number-top{
  font-size: 60px;
  color: red;
}
.noding-botn{
  width: 400px;
  height: 400px;
  position: absolute;
  top: 27%;
  left: 38%;
  z-index: 999;
  background: #ffffff;
  border: 1PX solid red;
}
.aa-bton{
  width: 100%;
  height: 20%;
  position: absolute;
  bottom: 0;
  background: red;
  color: #ffffff;
  font-size: 50px;
  padding: 1% 36%;
}
.form-item {
  width: 100%;
  display: flex;
  margin-bottom: 3%;
}

.loding-yz{
  height: 50%;
}
.div-span{
  display:block;
  width: 100%;
  height: 15%;
  background-color: red;
}
.div-phone div input {
  height: 100px;
  margin-right: 5px;
  text-align: center;
  line-height: 100px;
  font-size: 50px;
  margin-left: 5px;
  margin-bottom: 10px;
}
.dialog-footer222{
  height: 10%;
  width: 100%;
}

.noding-b{
  position: absolute;
  top: 50%;
  color: red;
  font-size: 45px;
}
.div-phone1 button {
  height: 100px;
  text-align: center;
  background-color: red;
  border-color: red;
  margin-left: 15px;
}
.div-phone1 button span {
  font-size: 30px;
}
.el-dialog{
  position: relative;
}
.roding-span{
  display: block;
  height: 80px;
}
.div-phone {
  width: 50%;
}
.div-phone {
  height: 60px;
}
.orderSumCount {
  display: block;
  float: right;
  font-size: 16px;
  color: red;
}
</style>
