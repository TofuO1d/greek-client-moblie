<template>
  <div class="article-page">
    <van-nav-bar left-arrow @click-left="$router.back()" fixed>
      <template #title>
        <div class="nav-author" v-show="showNavAuthor">
          <van-image round width="7vw" height="7vw" :src="article.aut_photo" />
          <span class="name">{{ article.aut_name }}</span>
          <span class="line">|</span>
          <span
            @click="followAuthor()"
            class="follow"
            :class="{ un: article.is_followed }"
          >
            {{ article.is_followed ? '取消关注' : '关注' }}
          </span>
        </div>
      </template>
      <template #right>
        <van-icon name="ellipsis" size="5.4vw"></van-icon>
      </template>
    </van-nav-bar>
    <!-- 骨架组件 -->
    <div v-if="loading" class="article-skeleton">
      <van-skeleton title :row="12" />
    </div>
    <!-- 文章主体 -->
    <div class="article-wrapper" ref="wrapper" @scroll="onScroll">
      <!-- 头部：标题 时间 作者 -->
      <div class="header" ref="header">
        <h3 class="title">{{ article.title }}</h3>
        <div class="time">
          <span>{{ article.pubdate }}</span>
          <span>|</span>
          <span>{{ article.read_count }} 阅读</span>
          <span>|</span>
          <span>{{ article.comm_count }} 评论</span>
        </div>
        <div class="author van-hairline--bottom">
          <van-image
            round
            width="10vw"
            height="10vw"
            :src="article.aut_photo"
          />
          <span class="name">{{ article.aut_name }}</span>
          <!-- <van-button round size="small" color="#FC6627">+ 关注</van-button> -->
          <van-button
            v-if="article.is_followed"
            @click="followAuthor()"
            round
            size="small"
            >取消关注</van-button
          >
          <van-button
            v-else
            @click="followAuthor()"
            round
            size="small"
            color="#FC6627"
            >+ 关注</van-button
          >
        </div>
      </div>
      <!-- 内容：文章内容 -->
      <div class="main" ref="main">
        <div class="html" v-html="article.content" v-highlight></div>
        <div class="space"></div>
      </div>
      <!-- 评论：评论组件 -->
      <article-comment
        v-if="!isEmpty"
        :article="article"
        @click-comment="srollToComment"
        @changeAtt="handlerAtt"
        @toggleCollected="handlerCollected"
        @addComment="handlerCommentCount"
      />
    </div>
  </div>
</template>
<script>
import { getArticle } from '@/api/article'
import { followAuthor } from '@/api/user'
import ArticleComment from '@/components/article-comment'
export default {
  name: 'ArticlePage',
  data () {
    return {
      article: {},
      showNavAuthor: false,
      loading: false,
      toComment: false
    }
  },
  components: { ArticleComment },
  created () {
    this.getArticle()
  },
  computed: {
    isEmpty () {
      if (this.article.art_id) {
        console.log('1')
        console.log(this.article)
        return false
      } else {
        console.log('2')
        console.log(this.article)
        return true
      }
    }
  },
  methods: {
    handlerCommentCount () {
      this.article.comm_count++
    },
    handlerCollected () {
      this.article.is_collected = !this.article.is_collected
    },
    handlerAtt (val) {
      this.article.attitude = val
    },
    async getArticle () {
      // console.log(this.$route.query.id)
      this.loading = true
      const [, res] = await getArticle(this.$route.query.id)
      this.article = res.data.data
      this.loading = false
    },
    // 监听滚动
    onScroll () {
      const scrollTop = this.$refs.wrapper.scrollTop
      const headerHeight = this.$refs.header.offsetHeight
      this.showNavAuthor = scrollTop > headerHeight
    },
    // 关注&取消关注
    async followAuthor () {
      const newStatus = !this.article.is_followed
      const [err] = await followAuthor(this.article.aut_id, newStatus)
      if (err) {
        return this.$toast.success('操作失败')
      }
      this.$toast.success(newStatus ? '关注成功' : '取消关注')
      this.article.is_followed = newStatus
    },
    // 滚动到评论
    srollToComment () {
      const headerHeight = this.$refs.header.offsetHeight
      const mainHeight = this.$refs.main.offsetHeight
      // 是否滚动到评论，切换状态
      this.toComment = !this.toComment
      // 来回切换
      if (this.toComment) {
        this.$refs.wrapper.scrollTop = headerHeight + mainHeight
      } else {
        this.$refs.wrapper.scrollTop = 0
      }
    }
  }
}
</script>
<style scoped lang="less">
.article-skeleton {
  padding-top: 60px;
}
.article-wrapper {
  height: 100%;
  overflow-y: auto;
  padding: 44px 0 50px;
  // 头部
  .header {
    padding: 0 16px;
    .title {
      font-size: 20px;
      font-weight: normal;
      padding: 10px 0;
      margin: 0;
    }
    .time {
      font-size: 12px;
      color: #999;
      span:nth-child(2n) {
        margin: 0 5px;
        color: #ccc;
        position: relative;
        top: -1px;
      }
    }
    .author {
      display: flex;
      align-items: center;
      padding: 10px 0;
      .name {
        flex: 1;
        padding-left: 10px;
        font-size: 16px;
      }
    }
  }
  // 内容
  .main {
    .space {
      height: 16px;
      background: @geek-gray-color;
    }
    .html {
      word-break: break-all;
      width: 100%;
      overflow: hidden;
      padding: 20px 16px;
      /deep/ img {
        max-width: 100%;
        background: #f9f9f9;
      }
      /deep/ pre {
        white-space: pre-wrap;
        code {
          white-space: pre;
        }
      }
    }
  }
}
/deep/ .van-nav-bar__title {
  max-width: 270px;
  width: 270px;
}
.nav-author {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  > span {
    font-size: 14px;
    padding-left: 5px;
  }
  .line {
    color: #ccc;
    position: relative;
    top: -1px;
  }
  .follow {
    color: @geek-color;
    // 不加&  .follow .un   后代选择器
    // 加上&  .follow.un    交集选择器
    &.un {
      color: #999;
    }
  }
}
</style>
