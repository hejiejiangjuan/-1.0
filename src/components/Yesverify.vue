<template>
  <div class="yesver-center" style="height:20px;">
    <div class="yesver-center2">
      <el-form ref="form" label-width="80px" size="mini">
        <el-form-item label="选择类别" prop="shopName">
          <div>
            <el-select v-model="type" placeholder="选择类别" style="width:40%;" @change="getShopName">
              <el-option
                v-for="item in types"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <span style="color:red;">注：门票或酒店必须其一</span>
          </div>
          <div style="width:100%;position: relative;">
            <el-select
              v-model="shopName"
              placeholder="选择商户"
              style="width:40%; margin-top:20px;position: relative;"
              @change="orderNameList"
            >
              <el-option
                v-for="item in shopNames"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <span style="position: absolute;left:-68px;top:20px;color:#606266;">选择商户</span>

            <el-input style="width:20%;" v-model="shopName" placeholder="店铺编号" :disabled="true"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="订单编号" prop="orderId">
          <el-input style="width:80%;" v-model="orderId" placeholder="请输入订单编号"></el-input>
        </el-form-item>

        <el-form-item label="商品编码" prop="orderNo">
          <el-select v-model="orderNo" filterable placeholder="请选择" style="width:20%;">
            <el-option
              v-for="item in orderNos"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-input style="width:20%;" v-model="orderNo" placeholder="商品编码" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input style="width:80%;" v-model="phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="idCard">
          <el-input style="width:80%;" v-model="idCard" placeholder="请输入身份证号"></el-input>
        </el-form-item>
        <el-form-item label="购买数量" prop="payNum">
          <el-input style="width:80%;" v-model="payNum" placeholder="请输入购买数量"></el-input>
        </el-form-item>
        <el-form-item label="支付金额" prop="payment">
          <el-input style="width:80%;" v-model="payment" placeholder="请输入支付金额"></el-input>
        </el-form-item>
        <!-- <el-form-item label="已使用" prop="useNum">
          <el-input style="width:80%;" v-model="useNum" placeholder="请输入已使用券码"></el-input>
          <div style="color:red;">注：酒店订单必须填写</div>
        </el-form-item> -->
        <el-form-item label="渠道商" prop="channel">
          <el-select v-model="channelId" filterable placeholder="请选择渠道商" style="width:20%;">
            <el-option
              v-for="item in channelIds"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-input style="width:20%;" v-model="channelId" placeholder="渠道商Id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="购买日期">
          <div class="block">
            <el-date-picker
              v-model="payDate"
              type="datetime"
              style="width:80%;"
              placeholder="选择日期时间"
            ></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item size="large">
          <el-button
            style="width:30%; margin-left:8%;"
            type="primary"
            v-loading.fullscreen.lock="fullscreenLoading"
            @click="tijiao"
          >立即创建</el-button>
          <el-button style="width:20%;" @click="reset">重置</el-button>
        </el-form-item>
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
import { Message } from "element-ui";
export default {
  name: "yesverify",
  data() {
    return {
      fullscreenLoading: false,
      istwd: false,
      activeName: "second",
      aaaa: "",
      type: "",
      phone: "",
      orderLable: "",
      types: [
        {
          value: "1",
          label: "门票"
        },
        {
          value: "2",
          label: "酒店"
        }
      ],
      shopName: "",
      shopNames: [],
      orderNos: [],
      shopNo: "",
      orderNo: "",
      channelIds: [],
      orderId: "",
      type: "",

      idCard: "",
      payNum: "",
      payment: "",
      channel: "",
      channelId: "",
      payDate: "",
      useNum: ""
    };
  },

  mounted: function() {
    this.getChannelList();
  },

  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    getChannelList() {
      var value = "";
      var label = "";
      var that = this;
      var no = "";
      that.shopNames = [];
      this.$axios
        .get("/backstage/channel/getChannelList", {})
        .then(response => {
          console.log(response.data.datas);
          for (let index = 0; index < response.data.datas.length; index++) {
            value = response.data.datas[index].channelId;
            label = response.data.datas[index].channel;
            var s = { value: value, label: label };
            that.channelIds.push(s);
          }
        })
        .catch(error => {
          this.$data.fullscreenLoading = false;
          Message.error("录入失败");
        });
    },
    reset() {
      this.$refs.form.resetFields();
    },
    tijiao() {
      if (this.type == 1) {
        this.onSubmit();
      } else {
        this.setSubmit();
      }
    },
    setSubmit() {
      var params = new URLSearchParams();
      let order = JSON.stringify({
        orderNo: this.orderId,
        comNo: this.orderNo,
        idCard: this.idCard,
        comNum: this.payNum,
        payManay: this.payment,
        ChanelId: this.channelId,
        phone: this.phone,
        bugDate: this.payDate.getTime(),
        createDate: new Date(),
        createAdmin: localStorage.getItem("username"),
        useNum: this.useNum
      });
      params.append("order", order);
      this.$axios
        .post("/backstage/hotelOrder/save", params, {})
        .then(resp => {
          this.$nextTick(() => {
            this.$data.fullscreenLoading = false;
            this.$refs.form.resetFields();
		    Message.success(resp.data.message);
          });
          
        })
        .catch(error => {
          this.$data.fullscreenLoading = false;
          Message.error("录入失败");
        });
    },
    onSubmit() {
      var params = new URLSearchParams();
      let order = JSON.stringify({
        orderId: this.orderId,
        shopNo: this.shopName,
        orderNo: this.orderNo,
        type: this.type,
        idCard: this.idCard,
        payNum: this.payNum,
        payment: this.payment,
        channelId: this.channelId,
        phone: this.phone,
        payDate: this.payDate.getTime()
      });
      params.append("order", order);
      debugger
      this.$axios
        .post("/backstage/order/settOrder", params, {})
        .then(resp => {
          this.$nextTick(() => {
            this.$data.fullscreenLoading = false;
            this.$refs.form.resetFields();
          Message.success(resp.data.message);
          });
        })
        .catch(error => {
          this.$data.fullscreenLoading = false;
          Message.error("录入失败");
        });
    },
    getShopName() {
      var value = "";
      var label = "";
      var that = this;
      var no = "";
      that.shopNames = [];
      that.orderNos = [];
      var params = new URLSearchParams();
      params.append("userName", localStorage.getItem("username"));
      this.$axios
        .post("/backstage/hotelCommodity/getMerchantList", params, {})
        .then(response => {debugger
          for (let index = 0; index < response.data.datas.length; index++) {
            value = response.data.datas[index].merchantNo;
            label = response.data.datas[index].companyName;
            // no= response.data.datas[index].hotelName;
            var s = { value: value, label: label };
            that.shopNames.push(s);
          }
        })
        .catch(error => {
          this.$data.fullscreenLoading = false;
        });
    },
    orderNameList(){
      var value = "";
      var label = "";
      var that=this;
        var params = new URLSearchParams();
        params.append("merchantId",that.shopName);
      if (that.type == 1) {
        this.$axios
          .post("/backstage/hotelCommodity/cComNo",params, {})
          .then(response => {debugger
            that.orderNos=[];
            that.orderNo="";
            for (let index = 0; index < response.data.datas.length; index++) {
              value = response.data.datas[index].orderNo;
              label = response.data.datas[index].orderName;
              var s = { value: value, label: label };
              that.orderNos.push(s);
            }
            console.log(that.orderNos);
          })
          .catch(error => {
            this.$data.fullscreenLoading = false;
          });
      } else {
        this.$axios
          .post("/backstage/hotelCommodity/getComNo",params, {})
          .then(response => {
            console.log(response.data.datas);
            that.orderNos=[];
            that.orderNo="";
            for (let index = 0; index < response.data.datas.length; index++) {
              value = response.data.datas[index].comNo;
              label = response.data.datas[index].comNo;
              var s = { value: value, label: label };
              that.orderNos.push(s);
            }
            console.log(that.shopNames);
          })
          .catch(error => {
            this.$data.fullscreenLoading = false;
          });
      }
    }
  }
};
</script>

<style>
.yesver-center {
  width: 100%;
  height: 100%;
}
.yesver-center2 {
  width: 60%;
  margin: 0 auto;
}
</style>
