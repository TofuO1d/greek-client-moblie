import request from '@/utils/request'
/**
 * 获取所有频道
 */
export const getAllChannels = () => {
  return request({ url: 'v1_0/channels' })
}
/**
 * 获取我的频道（未登录会返回默认的一些频道）
 */
export const getMyChannels = async token => {
  if (!token) {
    const localData = JSON.parse(localStorage.getItem('KEY') || '[]')
    if (localData.length) {
      // 保持和res一样的结构，使用这个API的地方就无需修改
      return localData
    } else {
      // 获取数据本地缓存
      const [, res] = await request({ url: 'v1_0/user/channels' })
      // 只存数组
      localStorage.setItem('KEY', JSON.stringify(res.data.data.channels))
      return res.data.data.channels
    }
  } else {
    const [, res] = await request({ url: 'v1_0/user/channels' })
    return res.data.data.channels
  }
}
/**
 * 添加频道
 * @param {Array<object>} myChannels - 我的频道集合
 * @param {Number} myChannels.id - 频道ID
 * @param {String} myChannels.name - 频道名称
 * @param {Number} myChannels.seq - 频道名称
 */
export const addChannel = async (myChannels, token) => {
  if (!token) {
    // 1. 获取本地
    const localData = JSON.parse(localStorage.getItem('KEY') || '[]')
    // 2. 最后一项就是需要更新的
    const { id, name } = myChannels[myChannels.length - 1]
    // 3. 追加新频道
    localData.push({ id, name })
    // 4. 存储本地
    localStorage.setItem('KEY', JSON.stringify(localData))
  } else {
    await request({
      url: '/v1_0/user/channels',
      method: 'put',
      data: { channels: myChannels }
    })
  }
}
/**
 * 删除频道
 * @param {Number} id - 频道ID
 */
export const delChannel = async (id, token) => {
  if (!token) {
    // 1. 获取本地
    const localData = JSON.parse(localStorage.getItem('KEY') || '[]')
    // 2. 删除频道
    const index = localData.findIndex(item => item.id === id)
    localData.splice(index, 1)
    // 3. 存储本地
    localStorage.setItem('KEY', JSON.stringify(localData))
  } else {
    await request({
      url: '/v1_0/user/channels/' + id,
      method: 'delete'
    })
  }
}
