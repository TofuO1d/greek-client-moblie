import request, { baseURL } from '@/utils/request'
import axios from 'axios'

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
/**
 * 获取当前用户的资料
 */
export const getUserProfile = () => {
  return request({ url: '/v1_0/user/profile' })
}
/**
 * 修改头像
 * @param {Object} formData -  {photo:'文件数据'}
 */
export const updateUserPhoto = formData => {
  return request({
    url: '/v1_0/user/photo',
    method: 'patch',
    data: formData
  })
}
/**
 * 修改用户
 * @param {Object} user - 用户对象
 */
export const updateUserProfile = user => {
  return request({
    url: '/v1_0/user/profile',
    method: 'patch',
    data: user
  })
}
/**
 * 刷新token
 * @param {String} refreshToken - 保存的refresh_token
 * @returns
 */
export const refreshTokenAPI = refreshToken => {
  return axios({
    url: baseURL + 'v1_0/authorizations',
    method: 'put',
    headers: {
      Authorization: `Bearer ${refreshToken}`
    }
  })
}
