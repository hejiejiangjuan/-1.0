<template>
  <div>
    <el-form ref="form" class="demo-form-inline" :inline="true" :model="form">
      <el-form-item class="elitme-width">
        <el-input v-model="hotelNameSearch" placeholder="酒店名称"></el-input>
      </el-form-item>
      <!-- <el-form-item class="elitme-width" style="width:20%">
      <el-input class="inputqudao" v-model="channel_id" placeholder="时间"></el-input>
    </el-form-item>
    <el-form-item class="elitme-width" style="width:20%">
      <el-input v-model="order_no" placeholder="商品编码"></el-input>
      </el-form-item>-->
      <el-form-item class="enter" @click.native="condiSearch">
        <el-button type="primary" icon="el-icon-search">搜索</el-button>
      </el-form-item>
      <el-table class="tabb" :data="tableData" border style="width: 100%;">
        <el-table-column align="center" fixed prop="hotelName" label="酒店名称"></el-table-column>
        <el-table-column align="center" prop="startDate" label="开始日期"></el-table-column>
        <el-table-column align="center" prop="endDate" label="结束日期"></el-table-column>
        <el-table-column align="center" prop="name" label="房型名称"></el-table-column>
        <!-- <el-table-column align="center" prop="number" label="房型库存"></el-table-column> -->
        <el-table-column align="center" prop="price" label="房型加价"></el-table-column>
        <el-table-column align="center" fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button @click="modi(scope.row)" type="text" size="small">编辑</el-button>
            <!-- <el-button type="text" size="small" @click="removeClick(scope.row)">删除</el-button> -->
            <el-button @click="addRoomType(scope.row)" type="text" size="small">添加房型</el-button>
            <el-dialog
              top="3%"
              title="修改"
              :modal-append-to-body="false"
              :visible.sync="centerDialogVisible"
              width="45%"
              center
            >
              <div class="login-poto">
                <h3 class="h3-modoe">酒店名称：</h3>
                <div class="block">
                  <el-input
                    class="merchent-inpout"
                    placeholder="请输入酒店名称"
                    v-model="hotelName"
                    style="width:100%"
                  ></el-input>
                </div>
                <h3 class="h3-modoe">开放库存时间段：</h3>
                <div class="block">
                  <el-date-picker
                    format="yyyy-MM-dd"
                    v-model="sddate"
                    value-format="yyyy-MM-dd"
                    type="datetimerange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    style="width:100%"
                  ></el-date-picker>
                </div>
                <h3 class="h3-modoe">关闭库存日期：</h3>
                <div class="block">
                  <el-date-picker
                    v-model="disableClickVal"
                    value-format="yyyy-MM-dd"
                    type="date"
                    @blur="pickerOptions1"
                    placeholder="选择日期"
                    style="width:100%"
                  ></el-date-picker>
                </div>
                <p class="topppp1">
                  <span class="spanto1" v-for="(item,index) in disableDate" :key="index">
                    {{item}}
                    <b class="click-i1" @click="vshow($event,index)">x</b>
                  </span>
                </p>
                <h3 class="h3-modoe">&nbsp;&nbsp;&nbsp;&nbsp;房型：&nbsp;&nbsp;&nbsp;&nbsp;{{roomTypeName}}</h3>
                 &nbsp;&nbsp;&nbsp;&nbsp;加价：&nbsp;&nbsp;&nbsp;&nbsp;
                <el-input class="merchent-inpout" placeholder="请输入价格" v-model="price" style="width:10%"></el-input>
                <h3 class="h3-modoe">房型库存量：</h3>
                <el-input-number
                  v-model="number"
                  @change="handleChange"
                  :min="1"
                  label="库存"
                  style="width:40%"
                ></el-input-number>
                <h3 class="h3-modoe">库存变化设置：</h3>
                <el-form-item prop="channelId" style="width:100%">
                  <div class="block">
                    <div style="margin-top: 0px;">
                      <el-date-picker
                        v-model="changeDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期时间"
                        style="width:50%"
                      ></el-date-picker>

                      <el-radio style="margin-left:0px;" v-model="changeType" label="1">增加</el-radio>
                      <el-radio style="margin-left:0px;" v-model="changeType" label="2">减少</el-radio>
                    </div>
                    <div class="radio-radio">
                      <el-input-number v-model="changeNum" :min="1" label="价格" style="width: 50%;"></el-input-number>
                      <el-button style="width: 25%;" @click="indexJajia($event,index)">添加</el-button>
                      <div style="color:red;">注：如果需要添加多个多个库存变化则点击添加</div>
                    </div>
                  </div>
                </el-form-item>
                <el-form-item id="itemssss" style="width:100%;" label>
                  <div class="divshow">
                    <span class="shanshitop" v-for="(item,index) in changeArr" :key="index">
                      <b class="jiajiadata">{{item.changeDate}}</b>
                      <b class="jiaone" v-if="item.changeType == 1">增加</b>
                      <b class="jiaone" v-if="item.changeType == 2">减少</b>
                      <b class="jianumber">{{item.changeNum}}</b>
                      <span class="spjiaa" @click="jiashow($event,index)">x</span>
                    </span>
                  </div>
                </el-form-item>
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
import { MessageBox } from "element-ui";
import { Message } from "element-ui";
export default {
  data() {
    return {
      price:"",
      roomTypeName: "",
      roomType: "",
      changeDate: "",
      changeType: "1",
      changeNum: 1,
      changeArr: [],
      index: "",
      //修改数据
      id: "", //库存的id
      merchantId: "",
      sddate: [],
      hotelId: "",
      number: 0,
      startDate: "",
      endDate: "",
      hotelName: "",
      disableClickVal: "",
      disableDate: [],
      //=======
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
      tableData: [
        // disableDate: "2019-04-03,"
        // endDate: "2019-05-22"
        // hotelId: "2"
        // hotelName: "中国酒店"
        // id: "1"
        // merchantId: "1"
        // name: null
        // number: "1"
        // roomType: null
        // startDate: "2019-04-01"
      ]
    };
  },
  mounted: function() {
    this.merchantNo = localStorage.getItem("username");
    this.getRepertoryList();
  },
  methods: {
    addRoomType(row) {
      this.$router.push({
        path: "addRoomType",
        query: { hotelName: row.hotelName, hotelId: row.hotelId }
      });
    },
    jiashow(event, index) {
      this.$data.changeArr.splice(index, 1);
      // console.log(this.$data.changeArr);
    },
    indexJajia(vm) {
      if (
        this.$data.changeDate !== "" &&
        this.$data.changeType !== "" &&
        this.$data.changeNum !== ""
      ) {
        var jiajia = {
          changeDate: this.$data.changeDate,
          changeType: this.$data.changeType,
          changeNum: this.$data.changeNum
        };
        this.changeArr.push(jiajia);
        // console.log(this.jiajia1);
      } else {
        Message.error("数据不能为空！");
      }
    },
    sureModi() {
      var that = this;
      var disableFormat = "";
      if (this.disableDate && this.disableDate.length > 0) {
        for (var i = 0; i < this.disableDate.length; i++) {
          disableFormat += this.disableDate[i];
          if (i < this.disableDate.length - 1) {
            disableFormat += ",";
          }
        }
      }
      var startDate = "";
      var endDate = "";
      if (this.sddate && this.sddate.length >= 2) {
        startDate = this.sddate[0];
        endDate = this.sddate[1];
      }
      if (this.hotelName !== "") {
        let repertoryVo = JSON.stringify({
          roomType: this.roomType,
          hotelName: this.hotelName,
          number: this.number,
          disableDate: disableFormat,
          startDate: startDate,
          endDate: endDate,
          merchantId: this.merchantId,
          hotelId: this.hotelId,
          id: this.id,
          price:this.price
        });
        var params = new URLSearchParams();
        params.append("param", repertoryVo);
        params.append("changeArr", JSON.stringify(this.changeArr));
        this.$axios
          .post("/backstage/repertory/updateRepertory", params, {})
          .then(resp => {
            if (resp.data.code == 200) {
              that.getRepertoryList();
              that.centerDialogVisible = false;
              Message.success("修改成功");
            } else {
              Message.error(resp.data.message);
            }
          })
          .catch(function(error) {
            Message.error("修改失败");
          });
      } else {
        Message.error("酒店名称不能为空！");
      }
    },
    vshow(event, index) {
      this.disableDate.splice(index, 1);
    },
    modi(row) {
      console.log(row);
      this.disableDate = [];
      if (row.disableDate) {
        this.disableDate = row.disableDate.split(",");
      }
      var changeArrBefore = JSON.parse(row.repertoryChange);
      if (changeArrBefore && changeArrBefore.length > 0) {
        for (var i = 0; i < changeArrBefore.length; i++) {
          var formateDate = this.dateFormat(changeArrBefore[i].changeDate);
          changeArrBefore[i].changeDate = formateDate;
        }
      } else {
        changeArrBefore = [];
      }
      this.roomTypeName = row.name;
      this.roomType = row.roomType;
      this.changeArr = changeArrBefore;
      this.hotelName = row.hotelName;
      this.startDate = row.startDate;
      this.endDate = row.endDate;
      this.number = row.number;
      this.hotelId = row.hotelId;
      this.price=row.price;
      this.$set(this.sddate, 0, row.startDate);
      this.$set(this.sddate, 1, row.endDate);
      // this.sddate[0] = row.startDate;
      // this.sddate[1] = row.endDate;
      this.merchantId = row.merchantId;
      this.id = row.id;
      this.centerDialogVisible = true;
      this.$forceUpdate();
    },
    pickerOptions1(vm) {
      let thit = this;
      var time = thit.disableClickVal;
      if (thit.disableDate.indexOf(time) < 0) {
        thit.disableDate.push(time);
      }
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
      var that = this;
      var param = JSON.stringify({
        hotelName: this.hotelNameSearch,
        curPage: this.curPage,
        pageSize: this.pageSize,
        merchantNo: this.merchantNo
      });
      var params = new URLSearchParams();
      params.append("param", param);
      this.$axios
        .post("/backstage/repertory/getRepertoryList", params, {})
        .then(resp => {
          if (resp.data.code == 200) {
            that.tableData = resp.data.datas.list;
            that.counts = resp.data.datas.counts;
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
              "/backstage/repertory/delRepertory?hotelId=" + this.delHotelId,
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
    },
    dateFormat: function(time) {
      var date = new Date(time);
      var year = date.getFullYear();
      /* 在日期格式中，月份是从0开始的，因此要加0
       * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
       * */
      var month =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      // var hours=date.getHours()<10 ? "0"+date.getHours() : date.getHours();
      // var minutes=date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes();
      // var seconds=date.getSeconds()<10 ? "0"+date.getSeconds() : date.getSeconds();
      // 拼接
      // return year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds;
      return year + "-" + month + "-" + day;
    }
  }
};
</script>

<style>
.radio-radio {
  width: 100%;
  margin-top: 15px;
}
.spjiaa {
  width: 15px;
  height: 15px;
  position: absolute;
  top: 8px;
  right: 8px;
  background: #8c939d;
  text-align: center;
  line-height: 15px;
  text-align: center;
  border-radius: 50%;
  color: black;
}
.jiaone {
  padding: 0px 10px;
  height: 30px;
  line-height: 30px;
}
.jiajiadata {
  padding: 0px 20px;
  height: 30px;
  line-height: 30px;
}
.shanshitop {
  display: block;
  width: 100%;
  height: 30px;
  background: #dddcdc;
  color: #3b3c3d;
  margin-top: 5px;
  font-weight: normal;
  position: relative;
}
#itemssss > .el-form-item__content {
  width: 60%;
}
.divshow {
  width: 100%;
  min-height: 30px;
  background: #cccccc;
}

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
