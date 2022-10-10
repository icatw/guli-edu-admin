import request from '@/utils/request'
export default {

  //添加小节
  addVideo(video) {
    return request({
      url: '/eduservice/video/addVideo',
      method: 'post',
      data: video
    })
  },

  //获取小节信息
  getVideoInfo(id) {
    return request({
      url: '/eduservice/video/getVideoInfo/' + id,
      method: 'get',

    })
  },

  updateVideoInfo(video) {
    return request({
      url: '/eduservice/video/updateVideo',
      method: 'post',
      data: video
    })
  },

  //删除小节
  deleteVideo(id) {
    return request({
      url: '/eduservice/video/' + id,
      method: 'post'
    })
  },
}

