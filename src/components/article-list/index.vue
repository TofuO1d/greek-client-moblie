<template>
  <div class="article-list" ref="ArticleList" @scroll="rememberScroll">
    <van-pull-refresh
      v-model="refreshing"
      @refresh="onRefresh"
      success-text="刷新成功"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        @load="onLoad()"
        finished-text="没有更多了"
      >
        <article-item v-for="(item, i) in articles" :key="i" :article="item" />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import ArticleItem from '@/components/article-item'
import { getArticlesByChannel } from '@/api/article'
export default {
  name: 'ArticleList',
  components: { ArticleItem },
  props: {
    channelId: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      // 正在加载
      loading: false,
      // 数据全部加载完毕
      finished: false,
      // 正在刷新
      refreshing: false,
      articles: [],
      timestamp: Date.now(),
      // 阅读位置 (data中申明)
      scrollTop: 0
    }
  },
  // 激活组件
  activated () {
    this.$refs.ArticleList.scrollTop = this.scrollTop
  },
  methods: {
    // 滚动监听
    rememberScroll () {
      this.scrollTop = this.$refs.ArticleList.scrollTop
    },
    async onLoad () {
      // 上拉加载
      // 1. 获取数据
      // 2. 判断下一页是否还有数据：当前时间戳未空，也就是没有更多了
      // 2.1 如果有：记录当前的数据时间戳，下一次请求使用
      // 2.2 如没有：设置没有更多数据
      // 3. 当前列表追加数据
      // 4. 结束上拉加载操作
      const [err, res] = await getArticlesByChannel(
        this.channelId,
        this.timestamp
      )
      if (err) return this.$toast.fail('加载失败') // 加载失败
      if (res.data.data.pre_timestamp) {
        this.timestamp = res.data.data.pre_timestamp
      } else {
        this.finished = true
      }
      this.articles.push(...res.data.data.results)
      this.loading = false
    },
    async onRefresh () {
      // 下拉刷新
      // 1. 重置时间戳：回到第一页
      // 2. 获取数据
      // 3. 重置全部数据加载完成：可以再次加载更多
      // 4. 替换当前列表数据戳
      // 5. 记录下一次请求的时间
      // 6. 结束加刷新操作
      this.timestamp = Date.now()
      const [, res] = await getArticlesByChannel(this.channelId, this.timestamp)
      this.finished = false
      this.articles = res.data.data.results
      this.timestamp = res.data.data.pre_timestamp
      this.refreshing = false
    }
  }
}
</script>

<style scoped lang="less">
.article-list {
  height: 100%;
  overflow-y: auto;
  padding: 0 16px;
}
</style>
