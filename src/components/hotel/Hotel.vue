<template>
  <div class="yesver-center">
    <div class="yesver-center2">
      <el-form ref="form" :model="hotelForm" label-width="80px" size="mini">
        <el-form-item label="商品名称" prop="name">
          <el-input style="width:80%;" v-model="hotelForm.name" placeholder="请输入商品名称"></el-input>
        </el-form-item>
        <el-form-item label="有效日期">
          <div class="block">
            <el-date-picker
              v-model="value4"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width:80%;"
              @blur="placeholder"
            ></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="购买金额" prop="payment">
          <el-input style="width:80%;" v-model="hotelForm.payment" placeholder="输入购买金额"></el-input>
        </el-form-item>
        <el-form-item label="商品编码" prop="comNo">
          <el-input style="width:80%;" v-model="hotelForm.comNo" placeholder="请输入商品编码"></el-input>
        </el-form-item>
        <!-- <el-form-item label="购买限制" prop="appointLimit">
          <el-input style="width:80%;" v-model="hotelForm.appointLimit" placeholder="购买限制"></el-input>
        </el-form-item>-->
        <el-form-item label="客服电话" prop="phone">
          <el-input style="width:80%;" v-model="hotelForm.phone" placeholder="请输入客服电话"></el-input>
        </el-form-item>

        <el-form-item label="售卖时间">
          <div class="block">
            <el-date-picker
              v-model="buyDate"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width:80%;"
            ></el-date-picker>
          </div>
        </el-form-item>

        <el-form-item label="预约日期">
          <div class="block">
            <el-date-picker
              v-model="appointDate"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width:80%;"
            ></el-date-picker>
          </div>
        </el-form-item>

        <el-form-item label="预约时段">
          <el-time-select
            placeholder="起始时间"
            v-model="startTime"
            :picker-options="{
              start: '06:00',
              step: '00:10',
              end: '21:30'
            }"
          ></el-time-select>
          <el-time-select
            placeholder="结束时间"
            v-model="endTime"
            :picker-options="{
                start: '06:00',
              step: '00:10',
              end: '21:30',
              minTime: startTime
            }"
          ></el-time-select>
          <div style="color:red;">注：默认预约时段为早上09：00到晚上19：00</div>
        </el-form-item>

        <el-form-item label="注意事项" prop="appointLimit">
          <el-input
            type="textarea"
            style="width:80%;"
            autosize
            v-model="hotelForm.appointLimit"
            placeholder="请输入注意事项"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品设置" prop="channelId">
          <el-select v-model="goodType" style="width:23%;">
            <el-option
              v-for="item in type"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select v-model="merchantId" @change="getHotel" style="width:23%;">
            <el-option
              v-for="item in merchant"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              placeholder="请选择商户"
            ></el-option>
          </el-select>

          <el-select
            v-model="hotel"
            multiple
            collapse-tags
            style="margin-left: 6px; width:30%;"
            placeholder="请选择"
          >
            <el-option
              v-for="item in hotels"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="加价设置" prop="channelId">
          <div class="block">
            <el-date-picker
              v-model="priceDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期时间"
              style="width:30%"
            ></el-date-picker>
            <el-radio style="margin-right:10px;" v-model="radio" label="1">加价</el-radio>
            <el-radio style="margin-right:10px;" v-model="radio" label="2">减价</el-radio>
            <el-input style="width:15%" v-model="price" placeholder="价格"></el-input>
            <el-button @click="indexJajia($event,index)">添加</el-button>
            <div style="color:red;">注：点击添加新增加价，相同日期以最后一次添加为准</div>
          </div>
        </el-form-item>
        <el-form-item label="设置显示">
          <div class="divshow">
            <span class="shanshitop" v-for="(item,index) in jiajia1" :key="index">
              <b class="jiajiadata">{{item.date}}</b>
              <b class="jiaone" v-if="item.type == 1">加价</b>
              <b class="jiaone" v-if="item.type == 2">减价</b>
              <b class="jianumber">{{item.payment}}</b>
              <span class="spjiaa" @click="jiashow($event,index)">x</span>
            </span>
          </div>
        </el-form-item>
        <el-form-item label="限购数量" prop="limitNum">
          <el-input-number v-model="limitNum" @change="handleChange" :min="1" :max="20" label="数量"></el-input-number>
        </el-form-item>

        <el-form-item label="酒店图片" prop="channel">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl()"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item size="large">
          <el-button
            style="width:30%; margin-left:8%;"
            type="primary"
            v-loading.fullscreen.lock="fullscreenLoading"
            @click="onSubmit"
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
  data() {
    return {
      dates: [],
      goodType: "",
      midType: "",
      priceDate: "",
      limitNum: "",
      radio: 0,
      price: "",
      startTime:"09:00",
      endTime:"19:00",
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
      merchantId: "",
      merchant: [
        {
          value: "",
          label: "请选择商户"
        }
      ],
      hotel: "",
      hotels: [
        {
          value: "",
          label: "请选择酒店"
        }
      ],
      value10: [],
      value4: [new Date(), new Date()],
      appointDate: [new Date(), new Date()],
      buyDate: [new Date(), new Date()],
      num1: 1,
      index: "",
      radio: "1",
      imageUrl: "",
      fullscreenLoading: false,
      istwd: false,
      hotelForm: {
        orderId: "",
        shopNo: "",
        shopName: "",
        orderNo: "",
        phone: "",
        idCard: "",
        payNum: "",
        payment: "",
        channel: "",
        comNo: "",
        channelId: "",
        name: "",
        appointLimit: ""
      },
      payDate: "",
      options: [],
      value: "",
      options1: [],
      value1: "",
      startPlaceholder: "",
      endPlaceholder: "",
      jiajia1: [],
      newValLimit: ""
    };
  },
  watch: {
    hotelForm: {
      deep: true,
      handler: function(newVal) {
        // console.log("newValue", newVal.appointLimit);
        function Trim(str) {
          //str表示要转换的字符串.appointLimit
          return str.replace(/\n|\r\n/g, "<br/>");
        }
        this.newValLimit = Trim(newVal.appointLimit);
      }
    }
  },
  mounted: function() {
    this.getshanghu();
  },
  methods: {
    ceshi() {
      alert(this.hotelForm.appointLimit);
    },
    jiashow(event, index) {
      this.$data.jiajia1.splice(index, 1);
      console.log(this.$data.jiajia1);
    },
    indexJajia(vm) {
      if (
        this.$data.price !== "" &&
        this.$data.price !== "" &&
        this.$data.priceDate !== ""
      ) {
        var jiajia = {
          date: this.$data.priceDate,
          type: this.$data.radio,
          payManay: this.$data.price
        };
        for (var i = 0; i < this.jiajia1.length; i++) {
          debugger;
          if (this.jiajia1[i].date == this.$data.priceDate) {
            this.jiajia1.splice(i, 1);
          }
        }
        this.jiajia1.push(jiajia);
        console.log(this.jiajia1);
      } else {
        Message.error("数据不能为空！");
      }
    },
    pickerOptions1(vm) {
      let thit = this;
      var time = thit.priceDate;
      thit.dates.push(time);
      console.log(thit.data, "99999");
    },
    uploadUrl() {
      return "/backstage/file/upload";
    },
    placeholder() {
      this.startPlaceholder = this.value4[0];
      this.endPlaceholder = this.value4[1];
      // this.priceDate=[this.value4[0],this.value4[1]];
    },
    saveDate() {},
    handleChange(value) {
      console.log(value);
    },
    handleAvatarSuccess(res) {
      debugger;
      this.imageUrl = this.$baseUrl + res;
      //this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    reset() {
      this.$refs.form.resetFields();
    },
    onSubmit() {
      var data = this.$data.hotelForm;
      console.log(this.$data);
      // if (
      //   data.orderId !== "" &&
      //   data.shopNo !== "" &&
      //   data.shopName !== "" &&
      //   data.orderNo !== "" &&
      //   data.phone !== "" &&
      //   data.idCard !== "" &&
      //   data.phone !== "" &&
      //   data.payment !== "" &&
      //   data.channel !== "" &&
      //   data.channelId !== ""
      // ) {
      // this.$data.fullscreenLoading = true;
      var that = this;
      var params = new URLSearchParams();
      let time = JSON.stringify({
        starttime: this.startTime,
        endtime: this.endTime
      });
      let good = JSON.stringify({
        name: this.$data.hotelForm.name,
        picAddr: this.imageUrl,
        endDate: this.value4[1].getTime(),
        startDate: this.value4[0].getTime(),
        payManay: this.$data.hotelForm.payment,
        comNo: this.$data.hotelForm.comNo,
        limitNum: this.limitNum,
        appointStart: this.appointDate[0].getTime(),
        appointEnd: this.appointDate[1].getTime(),
        buyStart: this.buyDate[0].getTime(),
        buyEnd: this.buyDate[1].getTime(),
        phone: this.$data.hotelForm.phone,
        merchantId: this.merchantId,
        type: this.goodType,
        appointLimit: this.newValLimit
      });
      params.append("ccommodity", good);
      params.append("changePrice", JSON.stringify(that.jiajia1));
      params.append("hotelId", JSON.stringify(this.hotel));
      params.append("times", time);
      // console.log(this.$axios)
      this.$axios
        .post("/backstage/hotelCommodity/insertCcommodity", params, {})
        .then(resp => {
          this.$nextTick(() => {
            this.$data.fullscreenLoading = false;
            this.$refs.form.resetFields();
          });
          Message.success("提交成功");
        })
        .catch(error => {
          this.$data.fullscreenLoading = false;
          Message.error("提交失败");
        });
      // } else {
      //   Message.error("数据不能为空！");
      // }
    },
    getHotel() {
      this.hotels = [];

      var that = this;
      var value = "";
      var label = "";
      var params = new URLSearchParams();
      params.append("userName", this.merchantId);
      this.$axios
        .post("/backstage/hotelCommodity/getHotelNameList", params, {})
        .then(response => {
          console.log(response.data.datas);
          for (let index = 0; index < response.data.datas.length; index++) {
            value = response.data.datas[index].id;
            label = response.data.datas[index].hotelName;
            var s = { value: value, label: label };
            that.hotels.push(s);
          }
          console.log(that.merchant);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    getshanghu() {
      var that = this;
      var value = "";
      var label = "";
      var params = new URLSearchParams();
      params.append("userName", localStorage.getItem("username"));
      this.$axios
        .post("/backstage/hotelCommodity/getMerchantList", params, {})
        .then(response => {
          console.log(response.data.datas);
          for (let index = 0; index < response.data.datas.length; index++) {
            value = response.data.datas[index].id;
            label = response.data.datas[index].companyName;
            var s = { value: value, label: label };
            that.merchant.push(s);
          }
          console.log(that.merchant);
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>

<style>
/* <b class="jiajiadata">uuu334123412uuu</b>
                <b class="jiaone">加价</b>
                <b class="jianumber" >654654</b> */

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
  color: #ffffff;
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
.divshow {
  width: 80%;
  min-height: 30px;
  background: #ffffff;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.yesver-center {
  width: 100%;
  height: 100%;
}
.yesver-center2 {
  width: 60%;
  margin: 0 auto;
}
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
</style>
