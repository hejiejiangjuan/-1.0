<template>
  <div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline classtoe">
      <el-form-item>
        <el-input v-model="phone" placeholder="手机号或订单编号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-date-picker class="selectDate" value-format="yyyy-MM-dd HH:mm:ss" v-model="startDate" type="datetime" placeholder="起始日期"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-date-picker class="selectDate" value-format="yyyy-MM-dd HH:mm:ss" v-model="endDate" type="datetime" placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getOrderList">搜索</el-button>
      </el-form-item>
      <el-table :data="orderList" border style="width: 100%">
        <el-table-column prop="hotelOrderNo" label="订单编号" width="180"></el-table-column>
        <el-table-column prop="hotelName" label="酒店名称"></el-table-column>
        <el-table-column prop="bugDate" label="购买时间" v-if="goumaishijian"></el-table-column>
        <el-table-column prop="checkDate" label="预约入住时间"></el-table-column>
        <el-table-column prop="phone" label="手机号"></el-table-column>
        <el-table-column prop="username" label="使用人名称"></el-table-column>
        <el-table-column prop="code" label="预约券码"></el-table-column>
        <el-table-column prop="status" label="状态">
        </el-table-column>
        <el-table-column label="操作"  width="180">
        <template slot-scope="scope" >
          <el-button @click="formVisible(scope.row)" type="primary" size="small" >验证</el-button>
        </template>
      </el-table-column>
      </el-table>
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
      style="width:80%;height:60px;overflow: hidden; margin:0 auto;margin-top: 50%;"
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
      orderList: [],
      formInline: {
        user: "",
        region: ""
      },
      dialogVisible: false,
      startDate: "",
      endDate: "",
      channel_id: "",
      order_no: "",
      phone: "",
      message: "",
      datas: "",
      tell: "",
      Page: 1,
      count: 0,
      pageSize: 10,
      status: 2,
      type: 5,
      goumaishijian:false
    };
  },
  mounted: function() {
    this.select();
    this.goumai();
  },
  methods: {
    goumai(){
      var yonghu=localStorage.getItem("username");
    if(yonghu=='admin'){
      this.goumaishijian=true;
    }else{
      this.goumaishijian=false;
    }
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
    select() {
      var params = new URLSearchParams();
      var that = this;
      params.append("pageNum", this.Page);
      params.append("pageSize", this.pageSize);
      params.append("merchantNo", localStorage.getItem("username"));
      params.append("status", this.type);
      if ( that.startDate !=null && that.startDate != "") {
        params.delete("status");
        params.append("startDate", that.startDate);
      }
      if ( that.endDate !=null && that.endDate != "") {
         params.delete("status");
        params.append("endDate", that.endDate);
      }
      if (that.phone !=null && that.phone != "") {
        params.delete("status");
        params.append("phone", that.phone);
      }
      this.$axios
        .post("/backstage/hotelOrder/getOrderList", params, {})
        .then(response => {
          that.orderList = response.data.datas.orderList;
          for (var i = 0; i < that.orderList.length; i++) {
            if (that.orderList[i].status == 1) {
              that.orderList[i].status = "未使用";
             that.orderList[i].flag=false;
            } else if (that.orderList[i].status == 2) {
              that.orderList[i].status = "预约中";
              that.orderList[i].flag=false;
            } else if (that.orderList[i].status == 3) {
              that.orderList[i].status = "预约成功";
              that.orderList[i].flag=true;
            } else if(that.orderList[i].status == 4){
              that.orderList[i].status = "预约失败";
              that.orderList[i].flag=false;
            }else{
              that.orderList[i].status = "已使用";
              that.orderList[i].flag=false;
            }
          }
          console.log(that.orderList);
          this.count = response.data.datas.count;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    open() {
      this.$MessageBox.alert(this.message, this.datas, {
        dangerouslyUseHTMLString: true
      });
    },
    formVisible(row) {
      var that = this;
      if(!row.flag){
        Message.error("此订单"+row.status);
      }else{
      this.$MessageBox
        .confirm("此操作表示用户已到店入住, 是否继续?", "提示", {
          confirmButtonText: "是",
          cancelButtonText: "否",
          type: "warning"
        })
        .then(() => {
          var params = new URLSearchParams();
          var that = this;
          params.append("id", row.id);
          params.append("status", "5");
          this.$axios
            .post("/backstage/hotelOrder/updateStatus", params, {})
            .then(response => {
              that.Page = 1;
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
.stornod {
  margin: 20px 0;
  display: block;
  text-align: center;
  font-size: 20px;
}
.number-top {
  font-size: 60px;
  color: red;
}
.noding-botn {
  width: 400px;
  height: 400px;
  position: absolute;
  top: 27%;
  left: 38%;
  z-index: 999;
  background: #ffffff;
  border: 1px solid red;
}
.aa-bton {
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

.loding-yz {
  height: 50%;
}
.div-span {
  display: block;
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
.dialog-footer222 {
  height: 10%;
  width: 100%;
}

.noding-b {
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
.el-dialog {
  position: relative;
}
.roding-span {
  display: block;
  height: 80px;
}
.div-phone {
  width: 50%;
}
.div-phone {
  height: 60px;
}
</style>
