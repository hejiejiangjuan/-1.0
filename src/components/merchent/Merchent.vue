<template>
  <div class="merchenttop">
    <el-form
      class="merchenttop-from"
      ref="form"
      :model="merFrom"
      size="mini"
      label-width="85px"
    >
      <el-form-item class="werchent-item" prop="int1" label="商户名">
        <el-input
          class="merchent-inpout"
          placeholder="请输入内容（必填）"
          v-model="merFrom.int1"
        ></el-input>
      </el-form-item>
      <el-form-item class="werchent-item" prop="int2" label="编号">
        <el-input
          class="merchent-inpout"
          placeholder="请输入内容（必填）"
          v-model="merFrom.int2"
        ></el-input>
      </el-form-item>
      <el-form-item class="werchent-item" prop="int3" label="公司名">
        <el-input
          class="merchent-inpout"
          placeholder="请输入内容"
          v-model="merFrom.int3"
        ></el-input>
      </el-form-item>
      <el-form-item class="werchent-item" prop="int4" label="地址">
        <el-input
          class="merchent-inpout"
          placeholder="请输入内容"
          v-model="merFrom.int4"
        ></el-input>
      </el-form-item>
      <el-form-item class="werchent-item" prop="int5" label="手机号">
        <el-input
          class="merchent-inpout"
          placeholder="请输入内容"
          v-model="merFrom.int5"
        ></el-input>
      </el-form-item>
      <el-form-item class="werchent-item" prop="int6" label="座机号">
        <el-input
          class="merchent-inpout"
          placeholder="请输入内容"
          v-model="merFrom.int6"
        ></el-input>
      </el-form-item>
      <el-form-item class="werchent-item" prop="int7" label="邮箱">
        <el-input
          class="merchent-inpout"
          placeholder="请输入内容"
          v-model="merFrom.int7"
        ></el-input>
      </el-form-item>
      <el-form-item class="werchent-item" prop="int8" label="联系人">
        <el-input
          class="merchent-inpout"
          placeholder="请输入内容"
          v-model="merFrom.int8"
        ></el-input>
      </el-form-item>
      <el-form-item class="werchent-item" prop="int9" label="职位">
        <el-input
          class="merchent-inpout"
          placeholder="请输入内容"
          v-model="merFrom.int9"
        ></el-input>
      </el-form-item>
      <el-form-item size="large" class="werchent-item">
        <el-button
          class="btnbtn2"
          type="primary"
          v-loading.fullscreen.lock="fullscreenLoading"
          @click.native="shanhuForm"
        >添加</el-button>
        <el-button class="btnbtn2" @click.native="reform2">重置</el-button>
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
      fullscreenLoading: false,
      merFrom: {
        int1: "",
        int2: "",
        int3: "",
        int4: "",
        int5: "",
        int6: "",
        int7: "",
        int8: "",
        int9: ""
      }
    };
  },
  methods: {
    reform2() {
      this.$refs.form.resetFields();
    },
    shanhuForm() {
      var shFrom = this.merFrom;
      if(
        shFrom.int1 !== '' &&
        shFrom.int2 !== '' 
        // &&
        // shFrom.int3 !== '' &&
        // shFrom.int4 !== '' &&
        // shFrom.int5 !== '' &&
        // shFrom.int6 !== '' &&
        // shFrom.int7 !== '' &&
        // shFrom.int8 !== '' 
      ){
        this.fullscreenLoading = true;
        var params = new URLSearchParams();
        let meichant = JSON.stringify({
          abbreviation: shFrom.int1,
          merchantNo: shFrom.int2,
          companyName: shFrom.int3,
          companyAddr: shFrom.int4,
          phone: shFrom.type,
          telephone: shFrom.int6,
          email: shFrom.int7,
          linkman: shFrom.int8,
          job: shFrom.int9
        });
        params.append("meichant", meichant);
        this.$axios
        .post("/backstage/merchant/addMerchant", params, {})
        .then((resp) => {debugger
          this.fullscreenLoading = false;
          if(resp.data.code == 200){
            this.$refs.form.resetFields();
            Message.success("录入成功");
          }else{
            Message.error(resp.data.message);
          }
        })
        .catch(function(error) {
          this.fullscreenLoading = false;
          Message.error("录入失败");
        });
      } else{
        Message.error("商户名和编号不能为空！");
      }
    }
  }
};
</script>

<style>
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
  width: 50%;
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
