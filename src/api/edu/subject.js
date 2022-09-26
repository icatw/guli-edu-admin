import request from '@/utils/request'
const api_name = '/eduservice/subject'

export default {
  //查询所有的课程分类
  getNestedTreeList() {
    return request({
      url: `${api_name}/getAllSubject`,
      method: 'get'
    })
  }
}
