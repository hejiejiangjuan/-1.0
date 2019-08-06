<template>
  <div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item class="elitme-width">
        <el-input v-model="phone" placeholder="手机号或订单编号"></el-input>
      </el-form-item>
      <el-form-item class="elitme-width" v-if="adminName=='admin'">
        <el-input class="inputqudao" v-model="channel_id" placeholder="渠道ID" ></el-input>
      </el-form-item>
      <el-form-item class="elitme-width">
        <el-input v-model="order_no" placeholder="商品编码"></el-input>
      </el-form-item>
      <el-select v-model="status" class="selectText">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
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
        <el-table-column prop="orderId" label="订单编号" min-width="10%" align="center"></el-table-column>
        <el-table-column prop="payNum" label="购买数量" min-width="5%" align="center"></el-table-column>
        <el-table-column prop="phone" label="手机号" min-width="10%" align="center"></el-table-column>
        <el-table-column prop="type" label="票务类型" min-width="10%" align="center"></el-table-column>
        <el-table-column prop="payDate" label="购买时间" min-width="20%" align="center"></el-table-column>
        <el-table-column prop="code" label="验证码" min-width="10%" align="center"></el-table-column>
        <el-table-column prop="orderNo" label="商品编码" min-width="10%" align="center"></el-table-column>
        <el-table-column prop="status" label="状态" min-width="10%" align="center" v-if="adminName=='admin'"></el-table-column>
        <el-table-column prop="operation" label="操作" min-width="20%" align="center" v-if="adminName=='admin'">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="danger" size="small" >删除</el-button>
            <el-button @click="formVisible(scope.row)" type="primary" size="small">编辑</el-button>

            <el-dialog title="修改信息" :visible.sync="dialogFormVisible">
              <el-container>
                <el-main>
                  <el-form :model="form">
                    <el-form-item label="时间" :label-width="formLabelWidth">
                      <el-date-picker
                        v-model="dateNew"
                        value-format="yyyy-MM-dd hh:mm:ss"
                        type="datetime"
                        placeholder="请选择日期"
                      ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="手机号" :label-width="formLabelWidth">
                      <el-input v-model="phoneNew" auto-complete="off"></el-input>
                    </el-form-item>
                  </el-form>
                  <el-button @click="dialogFormVisible = false">取 消</el-button>
                  <el-button type="primary" @click="update">确 定</el-button>
                </el-main>
              </el-container>
            </el-dialog>
          </template>
        </el-table-column>
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
import { Message } from "element-ui";
export default {
  data() {
    return {
      loading: false,
      orderList: [],
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
      startDate: "",
      msg: "",
      dateNew: "",
      phoneNew: "",
      endDate: "",
      channel_id: "",
      order_no: "",
      phone: "",
      status: "",
      dialogTableVisible: false,
      dialogFormVisible: false,
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
      orederSum: "",
      adminName:localStorage.getItem("username")
    };
  },
  mounted: function() {
    this.select();
    this.selectStatus();
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
    formVisible(row) {
      this.dateNew = row.payDate;
      this.phoneNew = row.phone;
      this.orderId = row.id;
      this.orderNo = row.orderId;
      this.dialogFormVisible = true;
    },
    update() {
      var params = new URLSearchParams();
      var that = this;
      params.append("date", this.dateNew);
      debugger
      params.append("phone", this.phoneNew);
      params.append("id", this.orderId);
      params.append("orderId", this.orderNo);
      debugger;
      this.$axios
        .post("/backstage/order/updateOrderByPhone", params, {})
        .then(response => {
          this.dialogFormVisible = false;
          this.select();
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    selectCount(){
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
      if (that.status != "") {
        params.append("status", that.status);
      }
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
      if (that.status != "") {
        params.append("status", that.status);
      }
      that.loading=true;
      this.$axios
        .post("/backstage/order/getOrderList", params, {})
        .then(response => {debugger
          console.log(response);
          this.orderList = response.data.datas.orderList;
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
    },
    handleClick(id) {
      var that = this;
      if (id.status == "已验证") {
        Message.error("已验证的订单不可删除！");
      } else {
        this.$MessageBox
          .confirm("此操作将删除该记录, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
            var params = new URLSearchParams();
            var that = this;
            params.append("ids", id.id);
            params.append("phone", id.phone);
            params.append("orderId", id.orderId);
            this.$axios
              .post("/backstage/order/deleOrderList", params, {})
              .then(response => {
                that.select();
              })
              .catch(function(error) {
                console.log(error);
              });
          })
          .catch(() => {});
      }
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
