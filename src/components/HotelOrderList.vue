<template>
  <div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item class="elitme-width">
        <el-input v-model="phone" placeholder="手机号或订单编号"></el-input>
      </el-form-item>
      <el-form-item class="elitme-width">
        <el-input v-model="order_no" placeholder="商品编码"></el-input>
      </el-form-item>
      <el-form-item class="enter">
        <el-button type="primary" icon="el-icon-search" @click="getOrderList">搜索</el-button>
      </el-form-item>
      <el-table :data="orderList" border style="width: 100%"  v-loading="loading"
    element-loading-text="数据加载中">
        <el-table-column prop="orderNo" label="订单编号" min-width="10%" align="center"></el-table-column>
        <el-table-column prop="comNum" label="购买数量" min-width="5%" align="center"></el-table-column>
        <el-table-column prop="phone" label="手机号" min-width="10%" align="center"></el-table-column>
        <el-table-column prop="bugDate" label="购买时间" min-width="15%" align="center"></el-table-column>
        <el-table-column prop="comNo" label="商品编码" min-width="10%" align="center"></el-table-column>
        <el-table-column prop="idCard" label="状态" min-width="5%" align="center" v-if="adminName=='admin'"></el-table-column>
        <el-table-column prop="operation" label="操作" min-width="30%" align="center" v-if="adminName=='admin'">
          <template slot-scope="scope">
            <el-button @click="open(scope.row)" type="danger" size="small">删除</el-button>
            <el-button @click="formVisible(scope.row)" type="primary" size="small">修改手机号</el-button>
            <el-dialog
              top="15%"
              title="修改"
              :modal-append-to-body="false"
              :visible.sync="centerDialogVisible"
              width="30%"
              center
            >
              <div class="login-poto">
                <h3 class="h3-modoe">手机号：</h3>
                <div class="block">
                  <el-input
                    class="merchent-inpout"
                    placeholder="请输入手机号"
                    v-model="newPhone"
                    style="width:100%"
                  ></el-input>
                </div>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button @click="formVisibles">取 消</el-button>
                <el-button @click="update" type="primary">确 定</el-button>
              </span>
            </el-dialog>
            <el-button @click="resendOrder(scope.row)" type="primary" size="small">重发短信</el-button>
            <el-button @click="crateUrl(scope.row)" type="primary" size="small">生成链接</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="orderSumCount">当前所有订单的酒店总数为:{{orederSum}}</div>
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
import { Message } from "element-ui";
import { MessageBox } from "element-ui";
export default {
  data() {
    return {
      orderList: [],
      loading:false,
      adminName:localStorage.getItem("username"),
      options: [
        {
          value: "",
          label: "请选择类型"
        }
      ],
      formInline: {
        user: "",
        region: ""
      },
      orederSum: 0,
      centerDialogVisible: false,
      startDate: "",
      msg: "",
      dateNew: "",
      newPhone: "",
      newDate: "",
      phoneNew: "",
      endDate: "",
      channel_id: "",
      order_no: "",
      phone: "",
      status: "",
      dialogTableVisible: false,
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      Page: 1,
      count: 0,
      formLabelWidth: "120px",
      orderId: "",
      orderNo: "",
      pageSize: 10,
      id: "",
      flag: false,
      tableRow: ""
    };
  },
  mounted: function() {
    if (localStorage.getItem("username") == "admin") {
      this.flag = true;
    } else {
      this.flag = false;
    }
    this.select();
    this.selectStatus();
  },

  methods: {
    open(row) {
      this.$MessageBox.confirm("此操作将永久删除该订单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteOrder(row);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    crateUrl(row) {
      var url = this.$baseUrl+"order.html?code=" + row.orderCode;
      this.$MessageBox.alert(url, "生成链接成功", {
        type: "success",
        confirmButtonText: "确定",
        callback: action => {}
      });
    },
    formVisible(row) {
      this.tableRow = row;
      this.dateNew = row.payDate;
      this.phoneNew = row.phone;
      this.orderId = row.id;
      this.orderNo = row.orderId;
      this.centerDialogVisible = true;
    },

    formVisibles() {
      this.newPhone = "";
      this.centerDialogVisible = false;
    },
    resendOrder(row) {
      var parm = new URLSearchParams();
      parm.append("orderId", row.id);
      this.$axios
        .post("/backstage/hotelOrder/resendMsg", parm, {})
        .then(response => {
          debugger;
          if (response.data.code == 200) {
            Message.success("短信发送成功");
          }
        })
        .catch(function(error) {
          console.log(error);
          Message.error("重发失败");
        });
    },
    deleteOrder(row) {
      var params = new URLSearchParams();
      params.append("id", row.id);
      this.$axios
        .post("/backstage/hotelOrder/deleteOrder", params, {})
        .then(response => {
          this.select();
          Message.success("删除成功");
          this.select();
        })
        .catch(function(error) {
          console.log(error);
          Message.error("删除失败");
        });
    },
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
    },
    update() {
      var params = new URLSearchParams();
      var that = this;
      params.append("phone", this.newPhone);
      params.append("id", this.orderId);
      this.$axios
        .post("/backstage/hotelOrder/updatePhone", params, {})
        .then(response => {
          this.select();
          this.centerDialogVisible = false;
          Message.success("修改成功");
          this.newPhone = "";
          this.resendOrder(this.tableRow);
        })
        .catch(function(error) {
          console.log(error);
          Message.error("修改失败");
        });
    },
    select() {
      var params = new URLSearchParams();
      var that = this;
      params.append("curPage", this.Page);
      params.append("pageSize", this.pageSize);
      params.append("merchantNo", localStorage.getItem("username"));
      if (that.phone != "") {
        params.append("phone", this.phone);
      }
      if (that.order_no != "") {
        params.append("comNo", this.order_no);
      }
      that.loading=true;
      this.$axios
        .post("/backstage/hotelOrder/searchOrderList", params, {})
        .then(response => {debugger
          debugger;
          console.log(response);
          this.orderList = response.data.datas.list;
          for (let i = 0; i < this.orderList.length; i++) {
            if (this.orderList[i].useNum == 0) {
              this.orderList[i].idCard = "未使用";
            } else if (this.orderList[i].useNum == this.orderList[i].comNum) {
              this.orderList[i].idCard = "已使用";
            } else {
              this.orderList[i].idCard = "使用中";
            }
          }
          this.count = response.data.datas.count;
          this.orederSum = response.data.datas.sum;
          that.loading=false;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    selectStatus() {
      var value = "";
      var label = "";
      var select = "";
      var that = this;
      this.$axios
        .post("/backstage/order/selectStatus", {})
        .then(response => {
          select = response.data.datas;
          for (let index = 0; index < select.length; index++) {
            value = select[index].status;
            if (value == 1) {
              label = "未验证";
            } else if (value == 2) {
              label = "已验证";
            } else if (value == 3) {
              label = "已删除";
            }
            var s = { value: value, label: label };
            that.options.push(s);
          }
          console.log(that.options);
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>

<style>
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
.orderSumCount {
  display: block;
  float: right;
  font-size: 16px;
  color: red;
}
</style>
