<template>
  <div class="app-container">
    <!--表单-->
    <el-form :inline="true" class="demo-form-inline">

      <el-form-item label="日期">
        <el-date-picker
          v-model="day"
          type="date"
          placeholder="选择要统计的日期"
          value-format="yyyy-MM-dd" />
      </el-form-item>

      <el-button
        :disabled="btnDisabled"
        type="primary"
        @click="create()">生成</el-button>
    </el-form>

  </div>
</template>
<script>
import sta from '@/api/sta'
export default {
  data() {
    return {
      day: '',
      btnDisabled: false //按钮是否禁用
    }
  },
  methods: {
    //将统计得到的数据插入统计表
    create() {
      sta.createStaData(this.day)
        .then(response => {
          //提示成功插入数据
          this.$message({
            type: 'success',
            message: '成功生成统计数据'
          })
          //跳转到图标显示页面
          this.$router.push({path:'/sta/show'})
        })
    }
  }
}
</script>

