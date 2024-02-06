<template>
  <div class="article-comment">
    <!-- 全部评论 -->
    <van-sticky offset-top="11.73333vw">
      <div class="title van-hairline--bottom">
        <span>全部评论 ({{ article.comm_count }})</span>
        <span>{{ article.like_count }} 点赞</span>
      </div>
    </van-sticky>
    <!-- 评论列表 -->
    <div class="list">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有评论了"
        @load="onLoad"
      >
        <div
          class="item van-hairline--bottom"
          v-for="item in comments"
          :key="item.com_id"
        >
          <van-image round width="10vw" height="10vw" :src="item.aut_photo" />
          <div class="info">
            <p>
              <span class="name">{{ item.aut_name }}</span>
              <span class="zan"
                >{{ item.like_count }}
                <geek-icon :name="item.is_liking ? 'like-sel' : 'like2'" />
              </span>
            </p>
            <p class="cont">{{ item.content }}</p>
            <p>
              <span class="reply" @click="clickReply(item)"
                >{{ item.reply_count }}回复
                <i class="van-icon van-icon-arrow"></i
              ></span>
              <span class="time">{{ item.pubdate | relativeTime }}</span>
            </p>
          </div>
        </div>
      </van-list>
    </div>
    <!-- 底部工具 -->
    <div class="footer van-hairline--top">
      <div class="input" @click="showInput = true">
        <i class="van-icon van-icon-edit"></i>
      </div>
      <div class="btn" @click="$emit('click-comment')">
        <geek-icon name="comment"></geek-icon>
        <p>评论</p>
        <i v-if="article.comm_count">{{ article.comm_count }}</i>
      </div>
      <div class="btn" @click="likeArticle">
        <geek-icon
          :name="article.attitude === 1 ? 'like-sel' : 'like'"
        ></geek-icon>
        <p>点赞</p>
      </div>
      <div class="btn" @click="collectArticle">
        <geek-icon
          :name="article.is_collected ? 'collect-sel' : 'collect'"
        ></geek-icon>
        <p>收藏</p>
      </div>
      <div class="btn">
        <geek-icon name="share"></geek-icon>
        <p>分享</p>
      </div>
    </div>
    <!-- 回复弹层 -->
    <van-list
      :immediate-check="false"
      v-model="reply.loading"
      :finished="reply.finished"
      finished-text="没有回复了"
      @load="loadReply"
    >
      <van-popup
        v-model="reply.open"
        @closed="currComments = {}"
        position="right"
      >
        <!-- 头 -->
        <van-nav-bar
          left-arrow
          @click-left="reply.open = false"
          title="0条回复"
        />
        <div class="reply-wrapper list">
          <!-- 列表 -->
          <div
            class="item van-hairline--bottom"
            v-for="item in reply.list"
            :key="item.com_id"
          >
            <van-image round width="10vw" height="10vw" :src="item.aut_photo" />
            <div class="info">
              <p>
                <span class="name">{{ item.aut_name }}</span>
                <span class="zan"
                  >{{ item.like_count }} <geek-icon name="like2"
                /></span>
              </p>
              <p class="cont">{{ item.content }}</p>
              <p>
                <span class="time" style="margin-left:0">{{
                  item.pubdate | relativeTime
                }}</span>
              </p>
            </div>
          </div>
        </div>
        <!-- 底 -->
        <div class="footer van-hairline--top" style="position:static">
          <div class="input big" @click="showInput = true">
            <i class="van-icon van-icon-edit"></i>
          </div>
          <div class="btn">
            <geek-icon name="collect"></geek-icon>
            <p>收藏</p>
          </div>
          <div class="btn">
            <geek-icon name="share"></geek-icon>
            <p>分享</p>
          </div>
        </div>
      </van-popup>
    </van-list>
    <!-- 评论&回复 -->
    <van-popup v-model="showInput" position="bottom">
      <van-nav-bar
        left-arrow
        @click-left="showInput = false"
        :title="currComments.com_id ? '回复评论' : '评论文章'"
        right-text="发表"
        @click-right="submit()"
      />
      <van-field
        v-model="text"
        rows="3"
        autosize
        type="textarea"
        maxlength="100"
        :placeholder="
          currComments.com_id ? `@${currComments.aut_name}` : '请输入评论'
        "
        show-word-limit
      />
    </van-popup>
  </div>
</template>
<script>
import {
  getCommentsByArticle,
  likeArticle,
  collectArticle,
  getReplysByComment,
  commentOrReply
} from '@/api/article'
export default {
  name: 'ArticleComment',
  data () {
    return {
      loading: false,
      finished: false,
      offset: null,
      comments: [],
      // 回复业务需要的数据
      currComments: {},
      reply: {
        open: false,
        loading: false,
        finished: false,
        offset: null,
        list: []
      },
      // 显示输入弹窗
      showInput: false,
      // 输入框值
      text: ''
    }
  },
  props: ['article'],
  methods: {
    async onLoad () {
      // console.log(JSON.parse(JSON.stringify(this.article)))

      // 获取数据
      const [, res] = await getCommentsByArticle(
        this.article.art_id,
        this.offset
      )
      // 这次数据最后一条ID和所有数据最后一条ID相同，没有数据了
      if (res.data.data.last_id === res.data.data.end_id) {
        // 加载完毕
        this.finished = true
      } else {
        // 记录偏移量，为下次请求准备
        this.offset = res.data.data.last_id
      }
      // 追加评论数据
      this.comments.push(...res.data.data.results)
      // 结束加载状态
      this.loading = false
    },
    async likeArticle () {
      console.log('111s')
      if (this.article.attitude === 1) {
        const [err] = await likeArticle(this.article.art_id, false)
        if (err) return this.$toast.fail('操作失败')
        this.$emit('changeAtt', -1)
      } else {
        const [err] = await likeArticle(this.article.art_id, true)
        if (err) return this.$toast.fail('操作失败')
        this.$emit('changeAtt', 1)
      }
      this.$toast.success('操作成功')
    },
    async collectArticle () {
      const [err] = await collectArticle(
        this.article.art_id,
        !this.article.is_collected
      )
      if (err) return this.$toast.fail('操作失败')
      // this.article.is_collected = !this.article.is_collected
      this.$emit('toggleCollected')
      this.$toast.success('操作成功')
    },
    clickReply (item) {
      // 记录当前评论
      this.currComments = item
      // 打开评论弹窗
      this.reply.open = true
      // 加载效果
      this.reply.loading = true
      // 重置加载完毕
      this.reply.finished = false
      // 重置数据
      this.reply.list = []
      // 重置请求参数
      this.reply.offset = null
      // 开启加载
      this.loadReply()
    },
    async loadReply () {
      console.log('111')
      const [, res] = await getReplysByComment(
        this.currComments.com_id,
        this.reply.offset
      )
      this.reply.list.push(...res.data.data.results)
      if (res.data.data.end_id === res.data.data.last_id) {
        this.reply.finished = true
      } else {
        this.reply.offset = res.data.data.last_id
      }
      this.reply.loading = false
    },
    async submit () {
      if (!this.currComments.com_id) {
        // 1. 提交文章评论
        // 1.1. 校验是否输入内容
        // 1.2. 调用接口
        // 1.3. 失败提示
        // 1.4. 更新评论列表+更新评论数量+关闭对话框+清除输入内容+成功提示
        if (!this.text) return this.$toast('请输入评论')
        const [err, res] = await commentOrReply(this.article.art_id, this.text)
        if (err) return this.$toast.fail('评论失败')
        this.comments.unshift(res.data.data.new_obj)
        // this.article.comm_count++
        this.$emit('addComment')
        this.showInput = false
        this.text = ''
        this.$toast.success('评论成功')
      } else {
        // 2. 提交评论回复
        // 2.1. 校验是否输入内容
        // 2.2. 调用接口
        // 2.3. 失败提示
        // 2.4. 更新回复列表+更新评论数量+更新回复数量+关闭对话框+清除输入内容+成功提示
        if (!this.text) return this.$toast('请输入回复')
        const [err, res] = await commentOrReply(
          this.currComments.com_id,
          this.text,
          this.article.art_id
        )
        if (err) return this.$toast.fail('回复失败')
        this.reply.list.unshift(res.data.data.new_obj)
        this.$emit('addComment')
        this.currComments.reply_count++
        this.showInput = false
        this.text = ''
        this.$toast.success('回复成功')
      }
    }
  }
}
</script>
<style scoped lang="less">
.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 50px;
  background: #fff;
  display: flex;
  width: 100%;
  align-items: center;
  .input {
    margin-left: 10px;
    width: 200px;
    height: 34px;
    background: @geek-gray-color;
    border-radius: 17px;
    line-height: 36px;
    padding-left: 10px;
    .van-icon {
      color: #999;
    }
    &.big {
      width: 260px;
    }
  }
  .btn {
    flex: 1;
    text-align: center;
    position: relative;
    p {
      margin: 0;
      font-size: 10px;
    }
    .geek-icon {
      font-size: 18px;
    }
    i {
      height: 16px;
      min-width: 16px;
      padding: 0 3px;
      background: @geek-color;
      color: #fff;
      font-size: 10px;
      position: absolute;
      right: 0;
      top: -4px;
      line-height: 16px;
      border-radius: 8px;
      font-style: normal;
    }
  }
}
.article-comment {
  .title {
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
    background: #fff;
    span {
      font-size: 16px;
      &:last-child {
        color: #ccc;
        font-size: 14px;
      }
    }
  }
  .list {
    padding: 0 16px;
    .item {
      display: flex;
      padding: 10px 0;
      .info {
        padding-left: 10px;
        flex: 1;
        p {
          margin: 0;
          .name {
            font-size: 16px;
          }
          .zan {
            font-size: 14px;
            float: right;
            color: #999;
            .geek-icon {
              font-size: 12px;
              position: relative;
              top: -1px;
            }
          }
          &.cont {
            font-size: 14px;
            color: #666;
            padding: 10px 0;
            word-break: break-all;
            padding-right: 40px;
          }
          .reply {
            min-width: 60px;
            height: 24px;
            text-align: center;
            line-height: 28px;
            font-size: 12px;
            background: @geek-gray-color;
            display: inline-block;
            border-radius: 14px;
            color: #666;
            .van-icon {
              position: relative;
              top: 1px;
            }
          }
          .time {
            font-size: 12px;
            color: #999;
            margin-left: 10px;
          }
        }
      }
    }
  }
}
.van-popup {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.reply-wrapper {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
::v-deep .van-nav-bar__text {
  color: @geek-color;
}
::v-deep .van-field__control {
  background: @geek-gray-color;
  padding: 5px 10px;
  margin-bottom: 5px;
  border-radius: 4px;
}
</style>
