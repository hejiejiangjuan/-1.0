<template>
  <div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="phone" placeholder="手机号或订单编号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="startDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择起始日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="endDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择结束日期"
        ></el-date-picker>
      </el-form-item>
      <!-- <el-form-item>
        <el-input v-model="channel_id" placeholder="渠道ID"></el-input>
      </el-form-item>-->
      <!-- <el-form-item>
        <el-input v-model="order_no" placeholder="商品编码"></el-input>
      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
      <el-table :data="orderList" border style="width: 100%">
        <el-table-column prop="orderId" label="订单编号" min-width="10%"></el-table-column>
        <el-table-column prop="amount" label="购买数量" min-width="10%"></el-table-column>
        <el-table-column prop="phone" label="手机号" min-width="10%"></el-table-column>
        <el-table-column prop="ticketType" label="票务类型" :formatter="formatType" min-width="10%"></el-table-column>
        <el-table-column prop="payDate" label="购买时间" min-width="20%"></el-table-column>
        <el-table-column prop="code" label="验证码" min-width="10%"></el-table-column>
        <el-table-column prop="status" label="状态" :formatter="formatStatus" min-width="10%"></el-table-column>
        <el-table-column prop="operation" label="操作" min-width="20%">
          <template slot-scope="scope">
            <div>
              <el-button @click="handleClick(scope.row)" type="danger" size="small" v-if="adminName=='admin'">删除</el-button>
              <el-button @click="sendSms(scope.row)" type="primary" size="small">重发</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
      <el-pagination
        @current-change="handleCurrentChange"
        background
        layout="total,prev, pager, next, jumper"
        :current-page="currentPage"
        :page-size="pagesize">
      </el-pagination>
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
import { MessageBox } from "element-ui";
export default {
  data() {
    return {
      adminName:localStorage.getItem("username"),
      phone: "",
      startDate: "",
      endDate: "",
      channel_id: "",
      order_no: "",
      currentPage: 1, //初始页
      pagesize: 10, //    每页的数据
      orderList: [],
      formInline: {
        user: "",
        region: ""
      },
      startDate: "",
      endDate: ""
    };
  },
  created() {
    this.handleUserList();
    this.getList();
  },
  methods: {
    select() {},
    sendSms(id) {
      var that = this;
      this.$MessageBox
        .confirm("是否重发验证码?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          var params = new URLSearchParams();
          params.append("id", id.id);
          that.$axios.post(that.$baseUrl + "sms/anewSms", params).then(
            res => {},
            err => {
              console.log(err);
            }
          );
        })
        .catch(() => {});
    },
    handleClick(id) {
      var that = this;
      this.$MessageBox
        .confirm("此操作将删除该记录, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          var params = new URLSearchParams();
          params.append("id", id.id);
          var that = this;
          that.$axios.post(that.$baseUrl + "sms/deleteRecord", params).then(
            res => {
              that.currentPage = 1;
              that.getList();
            },
            err => {
              console.log(err);
            }
          );
        })
        .catch(() => {});
    },
    handleSizeChange: function(size) {
      this.pagesize = size;
      console.log(this.pagesize); //每页下拉显示数据
    },
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      this.getList();
    },
    handleUserList() {
      // this.$http.get("http://localhost:3000/userList").then(res => {
      //   //这是从本地请求的数据接口，
      //   this.userList = res.body;
      // });
    },
    getList() {
      var that = this;
      var params = new URLSearchParams();
      params.append("pageNum", that.currentPage);
      params.append("pageSize", that.pagesize);
      if (that.phone != "") {
        params.append("phone", that.phone);
      }
      if (that.startDate != "" && that.startDate != "") {
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

      that.$axios.post("/backstage/sms/getSmsList", params).then(
        res => {
          that.orderList = res.data.datas;
        },
        err => {
          console.log(err);
        }
      );
    },
    onSubmit() {
      var that = this;
      that.currentPage = 1;
      that.getList();
    },
    formatStatus(row, column) {
      return row.status == 1 ? "成功" : "失败";
    },
    formatType(row, column) {
      return row.ticketType == 1 ? "门票" : "酒店";
    }
  }
};
</script>

<style>
</style>
