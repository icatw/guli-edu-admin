import request from '@/utils/request'

export default {
  //查询所有的课程分类
  getNestedTreeList() {
    return request({
      url: `/eduservice/subject/getAllSubject`,
      method: 'get'
    })
  }
}
