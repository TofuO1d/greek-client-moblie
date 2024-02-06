import request from '@/utils/request'

/**
 * 登录
 * @param {String} mobile - 手机号
 * @param {String} code - 验证码
 * @returns Promise
 */
export const userLogin = ({ mobile, code }) => {
  return request({
    url: 'v1_0/authorizations',
    method: 'post',
    data: { mobile, code }
  })
}
/**
 * 发送短信验证码
 * @param {String} mobile - 手机号
 * @returns Promise
 */
export const sendMessage = mobile => {
  return request({
    url: `/v1_0/sms/codes/${mobile}`
  })
}
/**
 * 关注 和 取消关注
 * @param {*} authorId - 作者ID
 * @param {*} isFollow - 是否关注
 * @returns Promise
 */
export const followAuthor = (authorId, isFollow) => {
  if (isFollow) {
    return request({
      url: '/v1_0/user/followings',
      method: 'post',
      data: { target: authorId }
    })
  } else {
    return request({
      url: '/v1_0/user/followings/' + authorId,
      method: 'delete'
    })
  }
}
/**
 * 获取当前用户的信息（资料和统计）
 */
export const getUserInfo = () => {
  return request({ url: '/v1_0/user' })
}
