<template>
  <div class="adduserlist">
    <el-button type="info" @click="dialogFormVisible = true">绑定新店铺</el-button>
    <br>
    <br>
    <div class="adduser-table">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        v-loading="loading"
        element-loading-text="数据加载中"
      >
        <el-table-column prop="clientId" label="client_id"></el-table-column>
        <el-table-column prop="clientSecret" label="client_secret"></el-table-column>
        <el-table-column prop="shopid" label="店铺编号"></el-table-column>
        <el-table-column prop="channelId" label="渠道编号"></el-table-column>
        <el-table-column prop="channel" label="渠道名称"></el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <!---->
            <el-button @click="deleteSystem(scope.row)" type="text" size="small">解绑</el-button>
            <!--scope.row-->
            <el-button @click="updateSystem(scope.row)" type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="Page"
        :page-size="pageSize"
        layout="total,prev, pager, next, jumper"
        :total="count"
      ></el-pagination>
      <!--打开编辑框-->
      <el-dialog
        :title="title"
        :visible.sync="dialogFormVisible"
        :center="true"
        style="width:60%;margin-left:27%"
      >
        <el-input v-model="clientId" placeholder="请输入client_id"></el-input>
        <br>
        <br>
        <el-input v-model="clientSecret" placeholder="请输入client_secret"></el-input>
        <br>
        <br>
        <el-input v-model="shopid" placeholder="请输入店铺编号"></el-input>
        <br>
        <br>
        <el-select v-model="channelId" filterable placeholder="请选择渠道" @change="getChannel">
          <el-option
            v-for="item in channelIdList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-input v-model="channel" placeholder="请输入内容" style="width:50%" :disabled="true"></el-input>
        <br>
        <br>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateToken">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { Message } from "element-ui";
export default {
  data() {
    return {
      clientId: "",
      clientSecret: "",
      shopid: "",
      channelId: "",
      channel: "",
      channelIdList: [],
      tableData: [],
      loading: false,
      Page: 1,
      count: 0,
      pageSize: 10,
      dialogFormVisible: false,
      title: "绑定新店铺",
      tokenId: ""
    };
  },
  mounted: function() {
    this.getList();
    this.getChannelList();
  },
  methods: {
    //修改或新增
    updateToken() {
      var that = this;
      var url = "";
      if (that.tokenId == "") {
        url = "/backstage/token/addToken";
      } else {
        url = "/backstage/token/updateToken";
      }
      var params = new URLSearchParams();
      let token = JSON.stringify({
        clientId: that.clientId,
        clientSecret: that.clientSecret,
        shopid: that.shopid,
        channelId: that.channelId,
        channel: that.channel,
        id: that.tokenId
      });
      params.append("token", token);
      this.$axios
        .post(url, params, {})
        .then(response => {
          debugger;
          Message.success(response.data.message);
          that.dialogFormVisible = false;
          that.getList();
        })
        .catch(function(error) {
          Message.error("网络波动，请稍后重试！");
          console.log(error);
        });
    },
    //下拉框切换
    getChannel(aa) {
      var that = this;
      for (let i = 0; i < this.channelIdList.length; i++) {
        if (aa == that.channelIdList[i].value) {
          that.channel = that.channelIdList[i].label;
        }
      }
    },
    //获取渠道列表
    getChannelList() {
      var that = this;
      this.$axios
        .get("/backstage/channel/getChannelList", {})
        .then(response => {
          for (let index = 0; index < response.data.datas.length; index++) {
            var value = response.data.datas[index].channelId;
            var label = response.data.datas[index].channel;
            var s = { value: value, label: label };
            that.channelIdList.push(s);
          }
        })
        .catch(error => {
          Message.error("获取失败");
        });
    },
    //解绑
    deleteSystem(row) {
      var that = this;
      this.$MessageBox
        .confirm("此操作将永久删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          var params = new URLSearchParams();
          params.append("tokenId", row.id);
          this.$axios
            .post("/backstage/token/deleteToken", params, {})
            .then(response => {
              Message.success(response.data.message);
              that.getList();
            })
            .catch(function(error) {
              console.log(error);
            });
        })
        .catch(() => {
          Message.info("已取消解绑");
        });
    },
    //编辑
    updateSystem(row) {
      var that = this;
      that.title = "编辑店铺";
      that.tokenId = row.id;
      that.clientId = row.clientId;
      that.clientSecret = row.clientSecret;
      that.shopid = row.shopid;
      that.channelId = row.channelId;
      that.channel = row.channel;
      that.dialogFormVisible = true;
    },
    //获取列表
    getList() {
      var that = this;
      var params = new URLSearchParams();
      params.append("pageNum", this.Page);
      params.append("pageSize", this.pageSize);
      that.loading = true;
      this.$axios
        .post("/backstage/token/getList", params, {})
        .then(response => {
          console.log(response);
          that.tableData = response.data.datas.list;
          that.count = response.data.datas.count;
          that.loading = false;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    //翻页
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getList();
      console.log(`当前页: ${val}`);
    }
  }
};
</script>

<style>
</style>
