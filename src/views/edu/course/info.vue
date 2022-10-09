<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="1" process-status="wait" align-center style="marginbottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>
    <el-form label-width="120px">

      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
      </el-form-item>

      <!-- 所属分类 TODO -->
      <el-form-item label="课程分类">
        <!--        <el-select-->
        <!--          v-model="courseInfo.subjectParentId"-->
        <!--          placeholder="一级分类"-->
        <!--          @change="subjectLevelOneChanged">-->

        <!--          <el-option-->
        <!--            v-for="subject in subjectOneList"-->
        <!--            :key="subject.id"-->
        <!--            :label="subject.title"-->
        <!--            :value="subject.id"/>-->

        <!--        </el-select>-->

        <!--        &lt;!&ndash; 二级分类 &ndash;&gt;-->
        <!--        <el-select v-model="courseInfo.subjectId" placeholder="二级分类">-->
        <!--          <el-option-->
        <!--            v-for="subject in subjectTwoList"-->
        <!--            :key="subject.id"-->
        <!--            :label="subject.title"-->
        <!--            :value="subject.id"/>-->
        <!--        </el-select>-->
        <el-cascader
          :props="subjectParams"
          :options="options"
          v-model="courseInfo.subjectIds"
          :clearable="true"
        />

      </el-form-item>

      <!-- 课程讲师 TODO -->
      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select
          v-model="courseInfo.teacherId"
          placeholder="请选择">

          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"/>

        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
      </el-form-item>

      <!-- 课程简介 TODO -->
      <!-- 课程简介-->
      <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description"/>
      </el-form-item>

      <!-- 课程封面 TODO -->
      <el-form-item label="课程封面">

        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API+'/eduoss/fileoss/upload'"
          class="avatar-uploader">
          <img :src="courseInfo.cover" width="200px" height="200px">
        </el-upload>

      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/>
        元
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存并下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import course from '@/api/edu/course'
import subject from '@/api/edu/subject'
import Tinymce from '@/components/Tinymce'

const defaultForm = {
  title: '',
  subjectIds: '',
  teacherId: '',
  lessonNum: 0,
  description: '',
  cover: 'http://icatw-blog.oss-cn-beijing.aliyuncs.com/config/dde3c71e642f112140ce6ec3797bbf27.jpg',
  price: 0
}
export default {
  components: {Tinymce},
  data() {
    return {
      options: [],
      subjectParams: {
        label: 'title',
        value: 'id',
        children: 'children',
        expandTrigger: 'hover',
        emitPath: false
      },
      saveBtnDisabled: false, // 保存按钮是否禁用
      courseInfo: defaultForm,
      teacherList: [],
      // subjectOneList: [], // 一级分类列表
      // subjectTwoList: [], // 二级分类列表
      BASE_API: process.env.BASE_API,// 接口API地址
      courseId: ''
    }
  },
  watch: {
    $route(to, from) {
      this.courseInfo = defaultForm
    }
  },
  created() {
    //获取路由id值
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id;
      //调用根据id查询课程的方法
      this.getInfo();
    } else {
      this.courseInfo = defaultForm
      //初始化所有讲师
      this.getListTeacher();
      //初始化一级分类
      this.initSubjectList();
    }
  },
  methods: {
    initSubjectList() {
      subject.getNestedTreeList().then(response => {
        // this.subjectOneList = response.data.list
        this.options = response.data.list
      })
    },
    // subjectLevelOneChanged(value) {
    //   for (let i = 0; i < this.subjectOneList.length; i++) {
    //     if (this.subjectOneList[i].id === value) {
    //       this.subjectTwoList = this.subjectOneList[i].children
    //       this.courseInfo.subjectId = ''
    //     }
    //   }
    // },
    getListTeacher() {
      course.getListTeacher().then(response => {
        this.teacherList = response.data.items
      })
    },
    //根据课程id查询
    getInfo() {
      course.getCourseInfoId(this.courseId).then((response) => {
        //在courseInfo课程基本信息，包含 一级分类id 和 二级分类id
        this.courseInfo = response.data.courseInfoVo;
        //1 查询所有的分类，包含一级和二级
        subject.getNestedTreeList().then((response) => {
          this.options = response.data.list
        });
        //初始化所有讲师
        this.getListTeacher();
      });
    },
    saveCourseInfo() {
      course.saveCourseInfo(this.courseInfo)
        .then(response => {
          // 提示
          this.$message({
            type: 'success',
            message: '添加课程信息成功!'
          })
          this.$router.push({path: '/edu/course/chapter/' + response.data.courseId})
        })
    },
    updateCourseInfo() {
      course.updateCourseInfo(this.courseInfo)
        .then(response => {
          // 提示
          this.$message({
            type: 'success',
            message: '修改课程信息成功!'
          })
          this.$router.push({path: '/edu/course/chapter/' + this.courseId})
        })
    },
    // 添加课程信息
    saveOrUpdate() {
      if (!this.courseId) {
        this.saveCourseInfo()
      } else {
        this.updateCourseInfo()
      }
    },
    // 上传封面成功调用的方法
    handleAvatarSuccess(res, file) {
      this.courseInfo.cover = res.data.url
    },
    // 上传之前调用的方法
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>
<style scoped>
.tinymce-container {
  line-height: 29px;
}

/*.avatar-uploader{*/
/*width: 300px;*/
/*  height:300px;*/
/*}*/

</style>
