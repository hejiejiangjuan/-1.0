<template>
  <div class="merchenttop">
    <el-form
      class="merchenttop-from"
      ref="form"
      :model="merchenFrom"
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
      </el-form-item>
      <el-form-item class="werchent-item" prop="hotelName" label="酒店名称">
        <el-input
          class="merchent-inpout"
          style="width:60%;"
          placeholder="请输入内容"
          v-model="merchenFrom.hotelName"
        ></el-input>
      </el-form-item>
      <el-form-item label="开放库存时间段">
        <div class="block">
          <el-date-picker
            align="center"
            format="yyyy-MM-dd"
            v-model="sddate"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width:60%;"
          ></el-date-picker>
        </div>
      </el-form-item>
      <el-form-item class="werchent-item" label="关闭库存日期">
        <div class="block">
          <el-date-picker
            type="date"
            v-model="disableClickVal"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            @blur="pickerOptions1"
            style="width:60%;"
          ></el-date-picker>
        </div>
      </el-form-item>
      <el-form-item class="werchent-item" prop="disableClickVal" label>
        <p class="topppp">
          <span class="spanto" v-for="(item,index) in disableDate" :key="index">
            {{item}}
            <b class="click-i" @click="vshow($event,index)">x</b>
          </span>
        </p>
      </el-form-item>
      <el-form-item label="标准间库存数量" prop="roomNum">
        <el-input-number v-model="merchenFrom.roomNum" :min="1" label="数量"></el-input-number>
      </el-form-item>
      <el-form-item label="库存变化设置" prop="channelId">
          <div class="block">
            <el-date-picker
              v-model="changeDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期时间"
              style="width:30%"
            ></el-date-picker>
            <el-radio style="margin-right:10px;" v-model="changeType" label="1">增加</el-radio>
            <el-radio style="margin-right:10px;" v-model="changeType" label="2">减少</el-radio>
            <el-input-number v-model="changeNum" :min="1" label="数量"></el-input-number>
            <el-button @click="indexJajia($event,index)">添加</el-button>
            <div style="color:red;">注：如果需要添加多个库存变化则点击添加</div>
          </div>
        </el-form-item>
        <el-form-item label="">
          <div class="divshow" style="width:60%;">
            <span class="shanshitop" v-for="(item,index) in changeArr" :key="index">
                <b class="jiajiadata">{{item.changeDate}}</b>
                <b class="jiaone" v-if="item.changeType == 1">增加</b>
                <b class="jiaone"  v-if="item.changeType == 2">减少</b>
                <b class="jianumber" >{{item.changeNum}}</b>
                <span class="spjiaa"  @click="jiashow11($event,index)">x</span>
            </span>
          </div>
        </el-form-item>
      

      <el-form-item size="large" class="werchent-item">
        <el-button
          class="btnbtn2"
          type="primary"
          v-loading.fullscreen.lock="fullscreenLoading"
          @click.native="onSubmitto"
        >创建</el-button>
      </el-form-item>
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
import Vue from "vue";
import { Message } from "element-ui";
export default {
  name: "merchent",
  data() {
    return {
      changeDate: "",
      changeType: "1",
      changeNum:1,
      changeArr: [],
      index:"",
      isAdmin: false,
      merchants: [],
      value: "",
      disableClickVal: "",
      sddate: "",
      fullscreenLoading: false,
      merchenFrom: {
        hotelName: "",
        roomNum: ""
      },
      // value10: [],
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
    jiashow11(event, index) {
      this.$data.changeArr.splice(index, 1);
      console.log(this.$data.changeArr);
    },
    indexJajia(vm) {
      if (this.$data.changeDate !== "" && this.$data.changeType !== "" && this.$data.changeNum !== "") {
        var jiajia = {
          changeDate: this.$data.changeDate,
          changeType: this.$data.changeType,
          changeNum: this.$data.changeNum
        };
        this.changeArr.push(jiajia);
        console.log(this.changeArr)
      } else {
        Message.error("数据不能为空！");
      }
    },
    getMerchant() {
      var that = this;
      this.$axios
        .get("/backstage/repertory/getAllMerchant", null, {
          headers: {
            "Content-Type": "application/json;charset=UTF-8"
          }
        })
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
        });
    },
    vshow(event, index) {
      this.disableDate.splice(index, 1);
    },
    pickerOptions1(vm) {
      let thit = this;
      var time = thit.disableClickVal;
      if (thit.disableDate.indexOf(time) < 0) {
        thit.disableDate.push(time);
      }
    },
    resetform() {
      this.$refs.form.resetFields();
      this.disableDate = [];
    },

    onSubmitto() {
      var that = this;
      var userName = "";
      if (this.isAdmin) {
        userName = this.value;
      } else {
        userName = localStorage.getItem("username");
      }
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
      if (this.merchenFrom.hotelName !== "") {
        that.fullscreenLoading = true;
        var params = new URLSearchParams();
        let repertoryVo = JSON.stringify({
          hotelName: this.merchenFrom.hotelName,
          number: this.merchenFrom.roomNum,
          disableDate: disableFormat,
          startDate: startDate,
          endDate: endDate,
          merchantId: userName
        });
        params.append("repertory",repertoryVo);debugger
        params.append("changeArr",JSON.stringify(this.changeArr));
        this.$axios
          .post("/backstage/repertory/addRepertory", params, {})
          .then(resp => {
            that.fullscreenLoading = false;
            if (resp.data.code == 200) {
              this.$refs.form.resetFields();
              this.disableDate = [];
              that.changeArr = [];
              Message.success("录入成功");
            } else {
              Message.error(resp.data.message);
            }
          })
          .catch(function(error) {
            that.fullscreenLoading = false;
            Message.error("录入失败");
          });
      } else {
        Message.error("酒店名称不能为空！");
      }
    }
  }
};
</script>

<style>
.spjiaa{
  width: 15px;
  height: 15px;
  position: absolute;
  top: 8px;
  right:8px;
  background: #8c939d;
  text-align: center;
  line-height: 15px;
  text-align: center;
  border-radius: 50%;
  color: #ffffff;
}
.jiaone{
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
  width: 25%;
  min-height: 30px;
  background: #ffffff;
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
