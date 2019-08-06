<template>
  <div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item class="elitme-width">
        <el-input v-model="phone" placeholder="手机号或订单编号"></el-input>
      </el-form-item>
      <el-form-item class="elitme-width" v-if="adminName=='admin'">
        <el-input class="inputqudao" v-model="channel_id" placeholder="渠道ID"></el-input>
      </el-form-item>
      <el-form-item class="elitme-width">
        <el-input v-model="order_no" placeholder="商品编码"></el-input>
      </el-form-item>
      <el-form-item class="payDate">
        <el-date-picker class="selectDate" v-model="startDate" type="datetime" placeholder="起始日期"></el-date-picker>
      </el-form-item>
      <el-form-item class="payDate">
        <el-date-picker class="selectDate" v-model="endDate" type="datetime" placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item class="enter">
        <el-button type="primary" icon="el-icon-search" @click="getOrderList">搜索</el-button>
      </el-form-item>
      <el-table :data="orderList" border style="width: 100%" v-loading="loading" element-loading-text="数据加载中">
        <el-table-column prop="orderId" label="订单编号" width="180"></el-table-column>
        <el-table-column prop="payNum" label="购买数量" width="180"></el-table-column>
        <el-table-column prop="phone" label="手机号"></el-table-column>
        <el-table-column prop="type" label="票务类型"></el-table-column>
        <el-table-column prop="payDate" label="购买时间"></el-table-column>
        <el-table-column prop="code" label="验证码"></el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
      </el-table>
      <div class="orderSumCount">当前订单的门票总数为:{{orederSum}}</div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="Page"
        :page-size="pageSize"
        layout="total,prev, pager, next, jumper"
        :total="count"
      ></el-pagination>
    </el-form>
    <div
      class="tbotton-botn"
      style="width:80%;height:60px;overflow: hidden; margin:0 auto;margin-top: 35%;"
    >
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
      loading:false,
      adminName: localStorage.getItem("username"),
      orderList: [],
      formInline: {
        user: "",
        region: ""
      },
      startDate: "",
      endDate: "",
      channel_id: "",
      order_no: "",
      phone: "",
      Page: 1,
      count: 0,
      pageSize: 10,
      orederSum: 0
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
    getOrderList() {
      this.Page = 1;
      this.select();
      this.selectCount();
    },
    selectCount() {
      var params = new URLSearchParams();
      var that = this;
      params.append("userName", localStorage.getItem("username"));
      if (that.phone != "") {
        params.append("phone", that.phone);
      }
      if (that.startDate != "" && that.startDate != "") {
        params.append("startDate", new Date(that.startDate).getTime());
      }
      if (that.endDate != "") {
        params.append("endDate", new Date(that.endDate).getTime());
      }
      if (that.channel_id != "") {
        params.append("channel_id", that.channel_id);
      }
      if (that.order_no != "") {
        params.append("order_no", that.order_no);
      }
      params.append("status", 1);
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
      params.append("userName", localStorage.getItem("username"));
      params.append("status", 1);
      if (that.phone != "") {
        params.append("phone", that.phone);
      }
      if (that.startDate != "") {
        params.append("startDate", that.startDate);
      }
      if (that.endDate != "") {
        params.append("endDate", that.endDate);
      }
      if (that.channel_id != "") {
        params.append("channel_id", that.channel_id);
      }
      if (that.order_no != "") {
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
    handleClick(id) {}
  }
};
</script>

<style>
.elitme-width {
  width: 13%;
}
.elitme-width input {
  width: 100%;
}
.payDate {
  width: 20%;
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
.orderSumCount {
  display: block;
  float: right;
  font-size: 16px;
  color: red;
}
</style>
