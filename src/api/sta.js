import request from '@/utils/request'

export default {
  //将统计得到的数据插入统计表
  createStaData(day) {
    return request({
      url: `/staservice/sta/registerCount/${day}`,
      method: 'post'
    })
  },
  //获取统计数据以实现图标显示
  getDataSta(searchObj) {
    return request({
      url: `/staservice/sta/showData/${searchObj.type}/${searchObj.begin}/${searchObj.end}`,
      method: 'get'
    })
  }

}
