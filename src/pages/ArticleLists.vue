<template>
  <div class="ade-top">
    <div class="ar-top">
      <div class="fx">
        <h4>验证分析</h4>
        <h3>验证数量</h3>
      </div>
      <p class="ccc">本页根据今日门票验证数据来计算</p>
      <div class="zhibiao">
        <div class="zhibiaotop">今日核心指标</div>
        <div class="nuber">
          <ul class="ul">
            <li class="li">
              成功票数
              <span class="nuber-span">{{oneData.success_num}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <el-table :data="tableData" border style="width: 100%; margin-top: 200px;">
      <el-table-column prop="date" label="时间"></el-table-column>
      <el-table-column prop="success_num" label="成功"></el-table-column>
      <el-table-column prop="order_no" label="商品编码"></el-table-column>
      <el-table-column prop="order_name" label="商品名称"></el-table-column>
    </el-table>
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
import { Table, TableColumn } from "element-ui";
Vue.use(Table);
Vue.use(TableColumn);

export default {
  data() {
    return {
      tableData: [],
      oneData: {
        verify_num: 0,
        success_num: 0,
        total_num: 0
      }
    };
  },
  created() {
    this.getCurrentDay();
  },
  methods: {
    getCurrentDay() {
      var that = this;
      that.$axios.post("/backstage/Statistisc/getCurrentDay").then(
        res => {
          that.tableData = res.data.datas;
          if (that.tableData.length > 0) {
            that.oneData = that.tableData[0];
          }
          console.log(res);
        },
        err => {
          console.log(err);
        }
      );
    }
  }
};
</script>

<style>
.ade-top {
  width: 100%;
  height: 100%;
}
.ar-top {
  width: 100%;
  height: 100px;
}
.fx {
  width: 100%;
  height: 60px;
}
h4 {
  width: 100%;
  height: 50%;
  padding-left: 10px;
  padding-top: 5px;
  color: #727272;
}
h3 {
  padding: 5px 0;
  padding-left: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e0e0e0;
}
.ccc {
  width: 100%;
  height: 60px;
  line-height: 60px;
  margin-left: 50px;
}
.zhibiao {
  width: 100%;
  height: 150px;
  border: 1px solid #cccccc;
}
.zhibiaotop {
  width: 100%;
  height: 40px;
  line-height: 40px;
  padding-left: 10px;
  background: #cccccc;
  font-weight: 600;
}
.ul {
  list-style: none;
  display: flex;
  width: 100%;
  height: 100px;
  margin: 20px auto;
}
.li {
  width: 100%;
  height: 60px;
  text-align: center;
  line-height: 30px;
  border-left: 1px solid #cccccc;
}
.ul-li1 {
  border: none;
}
.nuber-span {
  display: block;
  font-weight: 700;
}
</style>