<template>
  <div>
    <el-form ref="form" class="demo-form-inline" :inline="true" :model="form">
      <el-form-item class="elitme-width">
        <el-input v-model="hotelNameSearch" placeholder="酒店名称"></el-input>
      </el-form-item>
      <el-form-item class="enter" @click.native="condiSearch">
        <el-button type="primary" icon="el-icon-search">搜索</el-button>
      </el-form-item>
      <el-table class="tabb" :data="tableData" border style="width: 100%;">
        <el-table-column align="center" fixed prop="order_name" label="商品名称"></el-table-column>
        <el-table-column align="center" prop="begin_date" label="开始日期"></el-table-column>
        <el-table-column align="center" prop="end_date" label="结束日期"></el-table-column>
        <el-table-column align="center" prop="order_no" label="商品编号"></el-table-column>
        <el-table-column align="center" prop="abbreviation" label="商户名称"></el-table-column>
        <el-table-column align="center" fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="modi(scope.row)" type="text" size="small">编辑</el-button>
            <el-dialog
              title="修改"
              :modal-append-to-body="false"
              :visible.sync="centerDialogVisible"
              width="30%"
              center
            >
              <div class="login-poto">
                <h3 class="h3-modoe">商品名称：</h3>
                <div class="block">
                  <el-input
                    class="merchent-inpout"
                    placeholder="请输入酒店名称"
                    v-model="hotelName"
                    style="width:100%"
                  ></el-input>
                </div>
                <h3 class="h3-modoe">商品编码：</h3>
                <div class="block">
                  <el-input
                    class="merchent-inpout"
                    placeholder="请输入酒店名称"
                    v-model="hotelNo"
                    style="width:100%"
                  ></el-input>
                </div>
                <h3 class="h3-modoe">开放日期：</h3>
                <div class="block">
                  <el-date-picker
                    v-model="sddate"
                    type="datetimerange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    style="width:100%"
                  ></el-date-picker>
                </div>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button @click="centerDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="sureModi">确 定</el-button>
              </span>
            </el-dialog>
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
import { MessageBox } from "element-ui";
import { Message } from "element-ui";
export default {
  data() {
    return {
      //修改数据
      id: "", //库存的id
      merchantId: "",
      sddate: [new Date(),new Date()],
      hotelId: "",
      number: 0,
      startDate: "",
      endDate: "",
      hotelName: "",
      disableClickVal: "",
      disableDate: [],
      delHotelId: "",
      form: {},
      hotelNameSearch: "",
      curPage: 1,
      pageSize: 10,
      counts: 0,
      merchantNo: "",
      centerDialogVisible: false,
      num1: 1,
      value1: "",
      value4: [new Date(), new Date()],
      value5: "",
      hotelNo:"",
      tableData: [
      ]
    };
  },
  mounted: function() {
    this.merchantNo = localStorage.getItem("username");
    this.getRepertoryList();
  },

  methods: {
    sureModi() {
      var that = this;
      var value = "";
      var label = "";
      var params = new URLSearchParams();debugger
      let repertoryVo = JSON.stringify({
          orderName: this.hotelName,
          beginDate: new Date(this.sddate[0]).getTime(),
          endDate:new Date( this.sddate[1]).getTime(),
          orderNo:this.hotelNo,
          id:this.id
        });
        params.append("commodityStr", repertoryVo);
      this.$axios
        .post("/backstage/commodity/updateCommodity", params, {})
        .then(resp => {debugger
          this.fullscreenLoading = false;
          this.centerDialogVisible=false;
          that.getRepertoryList();
          Message.success("修改成功");
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    modi(row) {
      console.log(row);
      this.disableDate = [];
      if (row.disableDate) {
        this.disableDate = row.disableDate.split(",");
      }
      this.hotelName = row.order_name;
      this.sddate =[new Date(row.begin_date),new Date(row.end_date)];
      this.id = row.id;
      this.hotelNo=row.order_no;
      this.centerDialogVisible = true;
      this.$forceUpdate();
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.curPage = val;
      this.getRepertoryList();
    },
    condiSearch() {
      this.curPage = 1;
      this.getRepertoryList();
    },
    getRepertoryList() {
      var param = JSON.stringify({
        hotelName: this.hotelNameSearch,
        curPage: this.curPage,
        pageSize: this.pageSize,
        merchantNo: this.merchantNo
      });
      var params = new URLSearchParams();
      params.append("condition",param);
      this.$axios
        .post("/backstage/commodity/getCommodities", params, {})
        .then(resp => {
          if (resp.data.code == 200) {
            this.tableData = resp.data.datas.list;
            this.counts = resp.data.datas.count;
          } else {
            console.log(resp);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    onSubmit() {
      console.log("submit!");
    },
    handleClick(row) {
      console.log(row);
    },
    removeClick(row) {
      this.delHotelId = row.hotelId;
      this.$MessageBox
        .confirm("此操作将永久删除该数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          var that = this;
          this.$axios
            .get(
              this.$baseUrl +
                "repertory/delRepertory?hotelId=" +
                this.delHotelId,
              null,
              {
                headers: {
                  "Content-Type": "application/json;charset=UTF-8"
                }
              }
            )
            .then(resp => {
              if (resp.data.code == 200) {
                that.getRepertoryList();
                that.$message({
                  type: "success",
                  message: "删除成功!"
                });
              } else {
                console.log(resp);
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        })
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // });
        });
    },
    handleChange(value) {
      console.log(value);
    }
  }
};
</script>

<style>
.topppp1 {
  width: 100%;
  min-height: 40px;
  margin-top: 10px;
  background: #ffffff;
}
.spanto1 {
  display: inline-block;
  background: #cccccc;
  padding: 2px 5px;
  padding-right: 20px;
  border-radius: 5px;
  margin: 2px 3px;
  position: relative;
}
.click-i1 {
  position: absolute;
  right: 2px;
  top: 9px;
  display: block;
  width: 12px;
  height: 12px;
  background: #595959;
  text-align: center;
  line-height: 12px;
  font-size: 12px;
  border-radius: 60%;
  color: #ffffff;
}
.from-toptop,
.toaoa,
.tabb {
  width: 100%;
  height: 100%;
}
.v-modal {
  z-index: -1;
}
.h3-modoe {
  width: 100%;
  height: 40px;
  line-height: 40px;
}
</style>
