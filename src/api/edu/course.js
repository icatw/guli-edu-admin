import request from '@/utils/request'

const api_name = '/eduservice/course'
export default {
  saveCourseInfo(courseInfo) {
    return request({
      url: `${api_name}/addCourseInfo`,
      method: 'post',
      data: courseInfo
    })
  },
  // 2 查询所有讲师
  getListTeacher() {
    return request({
      url: '/eduservice/teacher',
      method: 'get'
    })
  }

}
