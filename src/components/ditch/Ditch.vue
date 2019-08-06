<template>
  <div class="merchenttop">
    <el-form
      class="merchenttop-from"
      ref="form"
      :model="merchenFrom"
      size="mini"
      label-width="85px"
    >
      <el-form-item class="werchent-item" prop="input1" label="渠道简称">
        <el-input class="merchent-inpout" placeholder="请输入内容（必填）" v-model="merchenFrom.input1"></el-input>
      </el-form-item>
      <el-form-item class="werchent-item" prop="input2" label="渠道ID">
        <el-input class="merchent-inpout" placeholder="请输入内容（必填）" v-model="merchenFrom.input2"></el-input>
      </el-form-item>
      <el-form-item class="werchent-item" prop="input3" label="公司信息">
        <el-input class="merchent-inpout" placeholder="请输入内容" v-model="merchenFrom.input3"></el-input>
      </el-form-item>
      <el-form-item class="werchent-item" prop="input4" label="地址">
        <el-input class="merchent-inpout" placeholder="请输入内容" v-model="merchenFrom.input4"></el-input>
      </el-form-item>
      <el-form-item class="werchent-item" prop="input5" label="手机号">
        <el-input class="merchent-inpout" placeholder="请输入内容" v-model="merchenFrom.input5"></el-input>
      </el-form-item>
      <el-form-item class="werchent-item" prop="input6" label="座机号">
        <el-input class="merchent-inpout" placeholder="请输入内容" v-model="merchenFrom.input6"></el-input>
      </el-form-item>
      <el-form-item class="werchent-item" prop="input7" label="邮箱">
        <el-input class="merchent-inpout" placeholder="请输入内容" v-model="merchenFrom.input7"></el-input>
      </el-form-item>
      <el-form-item class="werchent-item" prop="input8" label="联系人">
        <el-input class="merchent-inpout" placeholder="请输入内容" v-model="merchenFrom.input8"></el-input>
      </el-form-item>
      <el-form-item class="werchent-item" prop="input9" label="职位">
        <el-input class="merchent-inpout" placeholder="请输入内容" v-model="merchenFrom.input9"></el-input>
      </el-form-item>
      <el-form-item size="large" class="werchent-item">
        <el-button
          class="btnbtn2"
          type="primary"
          v-loading.fullscreen.lock="fullscreenLoading"
          @click.native="onSubmitto"
        >添加</el-button>
        <el-button class="btnbtn2" @click.native="resetform">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="tbotton-botn" style="width:80%;height:60px;overflow: hidden; margin:0 auto;margin-top: 30%;" >
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
      merchenFrom: {
        input1: "",
        input2: "",
        input3: "",
        input4: "",
        input5: "",
        input6: "",
        input7: "",
        input8: "",
        input9: ""
      }
    };
  },
  methods: {
    resetform() {
      this.$refs.form.resetFields();
    },
    onSubmitto() {
      var merFrom = this.merchenFrom;
      // console.log(merFrom)
      var that = this;
      if (
        merFrom.input1 !== "" &&
        merFrom.input2 !== ""
        // &&
        // merFrom.input3 !== '' &&
        // merFrom.input4 !== '' &&
        // merFrom.input5 !== '' &&
        // merFrom.input6 !== '' &&
        // merFrom.input7 !== '' &&
        // merFrom.input8 !== '' &&
        // merFrom.input9 !== ''
      ) {
        that.fullscreenLoading = true;
        var params = new URLSearchParams();
        var channelInfo = JSON.stringify({
          channel: merFrom.input1,
          channelId: merFrom.input2,
          companyInfo: merFrom.input3,
          addr: merFrom.input4,
          phone: merFrom.input5,
          telephone: merFrom.input6,
          email: merFrom.input7,
          linkman: merFrom.input8,
          job: merFrom.input9
        });
        params.append("channelInfo",channelInfo);
        this.$axios
          .post("/backstage/channel/addChannel", params, {})
          .then(resp => {
            that.fullscreenLoading = false;
            if(resp.data.code == 200){
              that.$refs.form.resetFields();
              Message.success("录入成功");
            }else{
              Message.error(resp.data.message);
            }
            
          })
          .catch(function(error) {
            that.fullscreenLoading = false;
            Message.error("录入失败");
          });
      } else {
        Message.error("渠道简称和渠道ID不能为空！");
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
