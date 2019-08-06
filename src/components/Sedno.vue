<template>
  <div>
    <h3 class="daoruh4">门票订单导入：</h3>
    <div class="top">
      <div>
        <el-button type="warning" @click.native="downloadTemplate">下载模板</el-button>
        <span class="conspan">请下载并使用系统提供的门票订单模板</span>
      </div>
    </div>
    <div class="left">
      <el-upload
        class="upload-demo"
        ref="upload"
        :action="uploadUrl()"
        :limit="1"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :file-list="fileList"
        :auto-upload="false"
        :onError="uploadError"
        :onSuccess="uploadSuccess"
        :disabled="mpDisable"
        :before-upload="beforeMpUpload"
        accept=".xls, .xlsx"
      >
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button
          style="margin-left: 10px;"
          size="small"
          type="success"
          :disabled="mpDisable"
          @click="submitUpload"
        >上传门票订单</el-button>
        <div slot="tip" class="el-upload__tip title-zc">仅支持xls/xlsx格式的模板文件</div>
      </el-upload>
      <!-- <el-button type="text" @click="openSuccess">点击打开 Message Box</el-button> -->
      
    </div>
    <div class="top-20">
      <h3 class="daoruh3">酒店订单导入：</h3>
      <div>
        <el-button type="warning" @click.native="downloadHotelTemplate">下载模板</el-button>
        <span class="conspan">请下载并使用系统提供的酒店订单模板</span>
      </div>
    </div>
    <div class="left-20">
      <el-upload
        class="upload-demo"
        ref="hotelUpload"
        :action="uploadHotelUrl()"
        :limit="1"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :file-list="hotelFileList"
        :auto-upload="false"
        :onError="uploadError"
        :onSuccess="uploadSuccess"
        :disabled="hotelDisable"
        :before-upload="beforeHotelUpload"
        accept=".xls, .xlsx"
      >
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button
          style="margin-left: 10px;"
          size="small"
          type="success"
          :disabled="hotelDisable"
          @click="submitHotelUpload"
        >上传酒店订单</el-button>
        <div slot="tip" class="el-upload__tip title-zc">仅支持xls/xlsx格式的模板文件</div>
      </el-upload>
      <!-- <el-button type="text" @click="openSuccess">点击打开 Message Box</el-button> -->

    </div>


  <div style="margin-top: 50px;">
    <h3 class="daoruh3">生成验证码：</h3>
    <div class="top">
      <div>
        <el-button type="warning" @click.native="downloadTemplate">下载模板</el-button>
        <span class="conspan">请下载并使用系统提供的门票订单模板</span>
      </div>
    </div>
    <div class="left">
      <el-upload
        class="upload-demo"
        ref="orderUpload"
        :action="importOrderNoSmsGetCode()"
        :limit="1"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :file-list="fileList"
        :auto-upload="false"
        :onError="uploadError"
        :onSuccess="openSuccessNoSendCode"
        :disabled="mpDisable"
        :before-upload="beforeMpUpload"
        accept=".xls, .xlsx"
      >
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button
          style="margin-left: 10px;"
          size="small"
          type="success"
          :disabled="mpDisable"
          @click="submitOrderUpload"
        >上传门票订单</el-button>
        <el-button type="warning" @click.native="UserExcelDownloads">下载验证码</el-button>
        <div slot="tip" class="el-upload__tip title-zc">仅支持xls/xlsx格式的模板文件</div>
      </el-upload>
      <!-- <el-button type="text" @click="openSuccess">点击打开 Message Box</el-button> -->
    </div>
  </div>

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
export default {
  name: "sedno",
  data() {
    return {
      mpDisable:false,
      hotelDisable:false,
      fileList: [],
      hotelFileList:[]
    };
  },
  created: function() {
    // console.log(baseUrl)
  },
  methods: {
    beforeMpUpload(){
      this.mpDisable = true;
    },
    beforeHotelUpload(){
      this.hotelDisable = true;
    },
    openSuccess() {
      this.$MessageBox.alert("导入成功，并向客户发送短信", "", {
        type: "success",
        confirmButtonText: "确定",
        callback: action => {
          // this.$message({
          //   type: 'info',
          //   message: `action: ${ action }`
          // });
        }
      });
    },

    openSuccessNoSendCode() {
      this.$MessageBox.alert("导入成功，已生成验证码，点击下载验证码即可", "", {
        type: "success",
        confirmButtonText: "确定",
        callback: action => {
          // this.$message({
          //   type: 'info',
          //   message: `action: ${ action }`
          // });
        }
      });
    },
    openErro(msg) {
      if(msg){
        this.$MessageBox.alert(msg, "", {
        type: "error",
        confirmButtonText: "确定",
        callback: action => {
            // this.$message({
            //   type: 'info',
            //   message: `action: ${ action }`
            // });
          }
        });
      }else{
        this.$MessageBox.alert("导入失败，请严格按模板格式导入数据", "", {
        type: "error",
        confirmButtonText: "确定",
        callback: action => {
          // this.$message({
          //   type: 'info',
          //   message: `action: ${ action }`
          // });
          }
        });
      }
    },
    uploadSuccess(data) {
      this.mpDisable=false;
      this.hotelDisable = false;
      if (data.code == 200) {
        this.openSuccess();
      } else {
        this.openErro(data.message);
      }
    },
    uploadError(data) {
      this.mpDisable=false;
      this.hotelDisable = false;
      if (data.code == 200) {
        this.openSuccess();
      } else {
        this.openErro(data.message);
      }
    },
    importOrderNoSmsGetCode() {
      return "/backstage/order/importOrderNoSmsGetCode";
    },
    uploadUrl() {
      return "/backstage/order/importOrder";
    },
    uploadHotelUrl(){
      return "/backstage/hotelOrder/import";
    },
    UserExcelDownloads() {
      window.location.href = "/backstage/order/UserExcelDownloads";
    },
    downloadTemplate() {
      window.location.href = "/backstage/order/exportOrderTemplate";
    },
    downloadHotelTemplate(){
      window.location.href = "/backstage/hotelOrder/exportOrderTemplate";
    },
    submitUpload() {
      this.$refs.upload.submit();
    },submitOrderUpload() {
      this.$refs.orderUpload.submit();
    },
    submitHotelUpload(){
      this.$refs.hotelUpload.submit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    }
  }
};
</script>

<style>
.daoruh3 {
  width: 200px;
  height: 50px;
  text-align: left;
  line-height: 50px;
  font-size: 20px;
  /* padding: 10px 10px; */
}
.daoruh4 {
  width: 200px;
  height: 40px;
  text-align: left;
  line-height: 40px;
  font-size: 18px;
}
.top-20{
  margin-top: 20px;
}
.left-20{
  margin-top: 20px;
}
.top {
  width: 700px;
  height: 96px;
  display: flex;
}
.left {
  width: 400px;
  height: 100px;
}
.conspan {
  display: block;
  font-size: 14px;
}
.title-zc {
  font-size: 14px;
}
.daorudingdan {
  width: 100%;
}
.daoru1 {
  float: left;
  margin-left: 20px;
}
.daorudao {
  margin-left: 0;
}
</style>
