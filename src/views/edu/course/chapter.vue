<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="2" process-status="wait" align-center style="marginbottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>

    <!--    <el-button type="text" @click="openChapterDialog()">添加章节</el-button>-->

    <!-- 章节 -->
    <ul class="chanpterList">
      <li v-for="chapter in chapterVideoList" :key="chapter.id">
        <p>
          {{ chapter.title }}

          <!--          <span class="acts">-->
          <!--            <el-button style="" type="text" @click="openVideo(chapter.id)"-->
          <!--            >添加小节</el-button-->
          <!--            >-->
          <!--            <el-button style="" type="text" @click="openEditChatper(chapter.id)"-->
          <!--            >编辑</el-button-->
          <!--            >-->
          <!--            <el-button type="text" @click="removeChapter(chapter.id)"-->
          <!--            >删除</el-button-->
          <!--            >-->
          <!--          </span>-->
        </p>

        <!-- 视频 -->
        <ul class="chanpterList videoList">
          <li v-for="video in chapter.children" :key="video.id">
            <p>
              {{ video.title }}

              <!--              <span class="acts">-->
              <!--                <el-button style="" type="text">编辑</el-button>-->
              <!--                <el-button type="text" @click="removeVideo(video.id)"-->
              <!--                >删除</el-button-->
              <!--                >-->
              <!--              </span>-->
            </p>
          </li>
        </ul>
      </li>
    </ul>
    <div>
      <el-button @click="previous">上一步</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="next"
      >下一步
      </el-button
      >
    </div>

  </div>
</template>
<script>
import chapter from "@/api/edu/chapter";
import course from "@/api/edu/course";
import subject from "@/api/edu/subject";


export default {
  data() {
    return {
      saveBtnDisabled: false,// 保存按钮是否禁用
      courseId: '', // 所属课程
      chapterVideoList: [] // 章节嵌套课时列表
    }
  },
  created() {
    //获取路由id值
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id;
      //根据课程id查询章节和小节
      this.getChapterVideo();
    }
  },
  methods: {
    previous() {
      this.$router.push({path: '/edu/course/info/'+this.courseId})
    },
    next() {
      this.$router.push({path: '/edu/course/publish/'+this.courseId})
    },
    //根据课程id查询章节和小节
    getChapterVideo() {
      chapter.getAllChapterVideo(this.courseId).then((response) => {
        this.chapterVideoList = response.data.allChapterVideo;
      });
    },
    //根据课程id查询
    getInfo() {
      course.getCourseInfoId(this.courseId).then((response) => {
        //在courseInfo课程基本信息，包含 一级分类id 和 二级分类id
        this.courseInfo = response.data.courseInfoVo;
        //1 查询所有的分类，包含一级和二级
        subject.getNestedTreeList().then((response) => {
          //2 获取所有一级分类
          this.subjectOneList = response.data.list;
          //3 把所有的一级分类数组进行遍历，
          for (var i = 0; i < this.subjectOneList.length; i++) {
            //获取每个一级分类
            var oneSubject = this.subjectOneList[i];
            //比较当前courseInfo里面一级分类id和所有的一级分类id
            if (this.courseInfo.subjectParentId == oneSubject.id) {
              //获取一级分类所有的二级分类
              this.subjectTwoList = oneSubject.children;
            }
          }
        });
        //初始化所有讲师
        this.getListTeacher();
      });
    },

  }
}
</script>
<style scoped>
.chanpterList {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}

.chanpterList li {
  position: relative;
}

.chanpterList p {
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #ddd;
}

.chanpterList .acts {
  float: right;
  font-size: 14px;
}

.videoList {
  padding-left: 50px;
}

.videoList p {
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #ddd;
}
</style>
