import request from '@/utils/request'

/**
 * 根据频道获取频道
 * @param {Number} channelId - 频道ID
 * @param {Number} timestamp - 时间戳
 * @returns
 */
export const getArticlesByChannel = (channelId, timestamp) => {
  return request({
    url: '/v1_0/articles',
    method: 'get',
    params: {
      channel_id: channelId,
      timestamp
    }
  })
}

export const getArticle = id => {
  return request({
    url: `/v1_0/articles/${id}`,
    method: 'get'
  })
}
/**
 * 获取文章评论
 * @param {String} articleId - 文章ID
 * @param {String} offset - 上一页数据最后一个ID，做为下一页请求的偏移量
 */
export const getCommentsByArticle = (articleId, offset) => {
  return request({
    url: '/v1_0/comments',
    params: { type: 'a', source: articleId, offset }
  })
}
/**
 * 点赞文章，取消点赞
 * @param {String} articleId - 文章ID
 * @param {Boolean} isLike - 是否点赞
 */
export const likeArticle = (articleId, isLike) => {
  if (isLike) {
    return request({
      url: '/v1_0/article/likings',
      method: 'post',
      data: { target: articleId }
    })
  } else {
    return request({
      url: '/v1_0/article/likings/' + articleId,
      method: 'delete'
    })
  }
}
/**
 * 收藏文章，取消收藏
 * @param {String} articleId - 文章ID
 * @param {Boolean} isCollect - 是否收藏
 */
export const collectArticle = (articleId, isCollect) => {
  if (isCollect) {
    return request({
      url: '/v1_0/article/collections',
      method: 'post',
      data: { target: articleId }
    })
  } else {
    return request({
      url: '/v1_0/article/collections/' + articleId,
      method: 'delete'
    })
  }
}
/**
 * 获取评论回复
 * @param {String} commentId - 评论ID
 * @param {String} offset - 上一页数据最后一个ID，做为下一页请求的偏移量
 */
export const getReplysByComment = (commentId, offset) => {
  return request({
    url: '/v1_0/comments',
    params: { type: 'c', source: commentId, offset }
  })
}
/**
 * 对文章进行评论，对评论进行回复
 * @param {*} target - 评论：文章ID，回复：评论ID
 * @param {*} content - 内容
 * @param {*} articleId - 回复：文章ID
 * @returns
 */
export const commentOrReply = (target, content, articleId = null) => {
  return request({
    url: '/v1_0/comments',
    method: 'post',
    data: { target, content, art_id: articleId }
  })
}
