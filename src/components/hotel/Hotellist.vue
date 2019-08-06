<template>
  <div class="hotelist">
    <div class="table">
      <!-- <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="用户管理" name="first">用户管理</el-tab-pane>
        <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
        <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
        <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
      </el-tabs>-->

      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item class="elitme-width">
          <el-input v-model="name" placeholder="商品名称"></el-input>
        </el-form-item>
        <el-select v-model="goodType" class="selectText">
          <el-option v-for="item in type" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-form-item class="enter">
          <el-button type="primary" icon="el-icon-search" @click="getList">搜索</el-button>
        </el-form-item>
        <el-table :data="tableData" style="width: 100%" @expand-change="aa">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="有效日期">
                  <span>{{ props.row.endDate }}</span>
                </el-form-item>
                <el-form-item label="售卖价格">
                  <span>{{ props.row.payment/100 }}</span>
                </el-form-item>
                <el-form-item label="限购数量">
                  <span>{{ props.row.limitNum }}</span>
                </el-form-item>
                <el-form-item label="预约限制">
                  <span>{{ props.row.appointLimit }}</span>
                </el-form-item>
                <el-form-item label="售卖时间">
                  <span>{{ props.row.startDate }}</span>
                </el-form-item>
                <el-form-item label="相关套餐">
                  <span>{{ props.row.type == 1 ? '普通商品':'套餐' }}</span>
                </el-form-item>
                <el-form-item label="商户信息">
                  <span>{{ props.row.abbreviation }}</span>
                </el-form-item>
                <el-form-item label="商品图片">
                  <span class="potrow-img">
                    <img class="img-top" :src="props.row.picAddr" alt="未找到相关图片...">
                  </span>
                </el-form-item>

                <el-form-item id="elform-jiajia-sez" label="加价设置">
                  <div>
                    <el-table :data="shopInfo" style="width: 100%" max-height="500">
                      <el-table-column prop="date" label="选择时间" width="270">
                        <template slot-scope="scope">
                          <el-form-item class="mItem">
                            <span v-if="!scope.row.isEgdit">{{scope.row.date}}</span>
                            <el-date-picker
                              v-if="scope.row.isEgdit"
                              :clearable="false"
                              v-model="scope.row.date"
                              value-format="yyyy-MM-dd"
                              type="date"
                              placeholder="选择日期"
                            ></el-date-picker>
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <el-table-column prop="payment" label="价格" align="center" width="100">
                        <template slot-scope="scope">
                          <span v-if="!scope.row.isEgdit">{{scope.row.payment/100}}</span>
                          <el-input v-if="scope.row.isEgdit" v-model="scope.row.payment"></el-input>
                        </template>
                      </el-table-column>
                      <el-table-column prop="type" label="加/减价" align="center">
                        <template slot-scope="scope">
                          <span v-if="!scope.row.isEgdit">{{scope.row.type}}</span>
                          <el-input v-if="scope.row.isEgdit" v-model="scope.row.type"></el-input>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </el-form-item>
                <el-form-item label="相关酒店">
                  <div>
                    <el-table :data="hotelInfo" style="width: 100%" max-height="250">
                      <el-table-column prop="city" label="酒店名称" align="center" width="100">
                        <template slot-scope="scope">
                          <span v-if="!scope.row.isEgdit">{{scope.row.hotel_name}}</span>
                          <el-input v-if="scope.row.isEgdit" v-model="scope.row.hotel_name"></el-input>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.$index,scope.row)" type="primary" size="small">编辑</el-button>
              <el-button @click="kucun(scope.row)" type="primary" size="small">生成链接</el-button>
            </template>
          </el-table-column>
          <el-table-column label="商品编码" prop="comNo"></el-table-column>
          <el-table-column label="商品名称" prop="name"></el-table-column>
          <el-table-column label="购买开始时间" prop="buyStart"></el-table-column>
          <el-table-column label="购买结束时间" prop="buyEnd"></el-table-column>
          <el-table-column label="客服电话" prop="phone"></el-table-column>
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
    </div>
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
import Vue from "vue";
import { DatePicker, Message } from "element-ui";
export default {
  name: "list",
  data() {
    return {
      value1: new Date(),
      typeprdos: "",
      shopInfo: [],
      hotelInfo: [],
      value1: "",
      value2: "",
      formInline: {
        bianma: "",
        name: "",
        phone: ""
      },
      goodType: "",
      midType: "",
      name: "",
      tableData: [],
      type: [
        {
          value: "",
          label: "请选择"
        },
        {
          value: "1",
          label: "普通商品"
        },
        {
          value: "2",
          label: "套餐"
        }
      ],
      cpType: [
        {
          value: "",
          label: "请选择"
        },
        {
          value: "1",
          label: "加价"
        },
        {
          value: "2",
          label: "减价"
        }
      ],
      Page: 1,
      count: 0,
      pageSize: 10,
      url: ""
    };
  },
  created() {
    this.hotelist();
  },
  methods: {
    //编辑数据
    edit(index, row) {
      this.$set(row, "isEgdit", true);
    },
    editCancel(index, row) {
      this.$set(row, "isEgdit", false);
    },
    //编辑成功
    editSuccess(index, row) {
      this.$set(row, "isEgdit", false);
      var that = this;
      if (that.shopInfo[index].type === "加价") {
        that.typeprdos = 1;
      } else if (that.shopInfo[index].type === "减价") {
        that.typeprdos = 2;
      }
      var oder = JSON.stringify({
        id: that.shopInfo[index].id,
        type: that.typeprdos,
        date: that.shopInfo[index].date,
        payManay: that.shopInfo[index].payment
      });
      console.log(oder);
      var params = new URLSearchParams();
      params.append("updatePrice", oder);
      this.$axios
        .post("/backstage/hotelCommodity/updatePrice", params, {})
        .then(resp => {
          if (resp.data.code == 200) {
            Message.success("修改成功");
          } else {
            Message.error(resp.data.message);
          }
        })
        .catch(function(error) {
          Message.error("修改失败！");
        });
    },
    kucun(row) {
      var hId = "";
      var params = new URLSearchParams();
      var that = this;
      params.append("id", row.id);
      this.$axios
        .post("/backstage/hotelCommodity/shopInfo", params, {})
        .then(response => {
          hId = response.data.datas.hotelInfo[0].id;
          this.url =this.$baseUrl+
            "appointHotel.html?mer_id=" +
            row.merchantId +
            "&hotel_id=" +
            hId;
          this.$MessageBox.alert(this.url, "生成链接成功", {
            type: "success",
            confirmButtonText: "确定",
            callback: action => {
              // this.$message({
              //   type: 'info',
              //   message: `action: ${ action }`
              // });
            }
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    aa(row, expandedRows) {
      var params = new URLSearchParams();
      var that = this;
      params.append("id", row.id);
      this.$axios
        .post("/backstage/hotelCommodity/shopInfo", params, {})
        .then(response => {
          console.log(response.data.datas);
          that.shopInfo = response.data.datas.shopInfo;
          that.hotelInfo = response.data.datas.hotelInfo;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //翻页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.Page = val;
      this.hotelist();
    },
    handleClick($index) {
      var com = this.$data.tableData[$index];
      var id = com.id;
      localStorage.setItem("commodity_", JSON.stringify(com));
      this.$router.push({ path: "gohotel", query: { id: id } });
    },
    //列表数据
    hotelist() {
      var params = new URLSearchParams();
      var that = this;
      params.append("pageNum", this.Page);
      params.append("pageSize", this.pageSize);
      params.append("userName", localStorage.getItem("username"));
      if (that.name != "") {
        params.append("name", that.name);
      }
      if (that.goodType != "") {
        params.append("type", that.goodType);
      }
      if (that.midType != "") {
        params.append("cpType", that.midType);
      }
      this.$axios
        .post("/backstage/hotelCommodity/getCcommodityList", params, {})
        .then(response => {
          console.log(response.data.datas.goodeList);
          that.tableData = response.data.datas.goodeList;
          that.count = response.data.datas.count;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    getList() {
      this.hotelist();
    },
    onSousuot() {
      console.log(this.tableData);
    }
  }
};
</script>

<style>
#elform-jiajia-sez > .el-form-item__content {
  width: 100%;
}
.ivu-tabs-tab {
  width: 100px !important;
}
.img-top {
  width: 100%;
  height: 100%;
}
.potrow-img {
  display: block;
  width: 100px;
  height: 100px;
  font-size: 12px;
}
.elitme-width {
  width: 10%;
}
.elitme-width input {
  width: 100%;
}
.payDate {
  width: 15%;
}
.selectDate {
  width: 20%;
}
.payDate div {
  width: 100% !important;
}
.payDate input {
  width: 100%;
}

.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
