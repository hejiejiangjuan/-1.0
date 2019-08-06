<template>
  <div class="merchenttop">
    <el-form
      class="merchenttop-from"
      ref="form"
      size="mini"
      label-width="85px"
    >
      <el-form-item class="werchent-item" prop="merchant" label="所属商户" v-if="isAdmin">
        <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="item in merchants"
            :key="item.merchantNo"
            :label="item.abbreviation"
            :value="item.merchantNo"
          ></el-option>
        </el-select>
        <el-input style="width:20%;" v-model="value"  :disabled="true"></el-input>
      </el-form-item>
      <el-form-item class="werchent-item" prop="hotelName" label="商品名称">
        <el-input
          class="merchent-inpout"
          style="width:60%;"
          placeholder="请输入商品名称"
          v-model="hotelName"
        ></el-input>
      </el-form-item>

  <el-form-item class="werchent-item" prop="hotelNo" label="商品编码">
        <el-input
          class="merchent-inpout"
          style="width:60%;"
          placeholder="请输入商品编码"
          v-model="hotelNo"
        ></el-input>
      </el-form-item>

      <el-form-item label="开放日期">
        <div class="block">
          <el-date-picker
            align="center"
            v-model="sddate"
            type="datetimerange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width:60%;"
          ></el-date-picker>
        </div>
      </el-form-item>

      <el-form-item size="large" class="werchent-item">
        <el-button
          class="btnbtn2"
          type="primary"
          v-loading.fullscreen.lock="fullscreenLoading"
          @click.native="onSubmitto"
        >添加</el-button>
      </el-form-item>
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
import Vue from "vue";
import { Message } from "element-ui";
export default {
  name: "merchent",
  data() {
    return {
      isAdmin: false,
      merchants: [],
      value: "",
      sddate: [new Date(),new Date()],
      fullscreenLoading: false,
        hotelName: "",
        hotelNo:"",
      disableDate: []
    };
  },
  mounted: function() {
    if (localStorage.getItem("username") == "admin") {
      this.isAdmin = true;
      this.getMerchant();
    }
  },
  methods: {
    getMerchant() {
      var that = this;
      var value = "";
      var label = "";
      var params = new URLSearchParams();
      params.append("userName", localStorage.getItem("username"));
      this.$axios
        .post("/backstage/hotelCommodity/getMerchantList", params, {})
        .then(resp => {
          if (resp.data.code == 200) {
            that.merchants = resp.data.datas;
            if (that.merchants && that.merchants.length > 0) {
              that.value = that.merchants[0].merchantNo;
            }
          } else {
            console.log(resp);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    onSubmitto() {
        var params = new URLSearchParams();
        let repertoryVo = JSON.stringify({
          orderName: this.hotelName,
          orderNo: this.hotelNo,
          beginDate: new Date(this.sddate[0]).getTime(),
          endDate: new Date(this.sddate[1]).getTime(),
          shopNo: this.value
        });
        params.append("commodityStr", repertoryVo);
        this.$axios
          .post("/backstage/commodity/addCommodity", params, {})
          .then(resp => {
            this.fullscreenLoading = false;
            if (resp.data.code == 200) {
              this.disableDate = [];
              Message.success("录入成功");
            } else {
              Message.error(resp.data.message);
            }
          })
          .catch(function(error) {
            this.fullscreenLoading = false;
            Message.error("录入失败");
          });
      
    }
  }
};
</script>

<style>
.topppp {
  width: 60%;
  min-height: 40px;
  background: #ffffff;
}
.spanto {
  display: inline-block;
  background: #cccccc;
  padding: 2px 5px;
  padding-right: 20px;
  border-radius: 5px;
  margin: 2px 3px;
  position: relative;
}
.click-i {
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
.btnbtn1 {
  width: 20%;
  height: 40px;
  text-align: center;
  margin-left: 4%;
}
.btnbtn2 {
  width: 20%;
  height: 40px;
}
.btnbtn2 span {
  text-align: center;
  margin-left: 0;
}
.merchenttop {
  width: 100%;
  height: 100%;
  margin: 30px auto;
}
.merchenttop-from {
  width: 80%;
  height: 100%;
  margin: 0 auto;
}
.merchent-inpout {
  width: 60%;
  height: 40px;
}
.merchent-inpout input {
  height: 40px !important;
}
.merchenttop-from div label {
  height: 40px !important;
  text-align: center;
}
</style>
