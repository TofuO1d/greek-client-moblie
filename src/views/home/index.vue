<template>
  <div class="home-page">
    <van-tabs animated>
      <van-tab v-for="item in allChannels" :key="item.id" :title="item.name">
        <article-list :channelId="item.id"></article-list>
      </van-tab>
      <!-- 按钮 -->
      <div class="btn-wrapper">
        <geek-icon name="search"></geek-icon>
        <geek-icon name="channel"></geek-icon>
      </div>
    </van-tabs>
  </div>
</template>
<script>
import { getAllChannels } from '@/api/channel'
import GeekIcon from '@/components/geek-icon'
import ArticleList from '@/components/article-list'
export default {
  name: 'HomePage',
  data () {
    return {
      allChannels: []
    }
  },
  components: { GeekIcon, ArticleList },
  async created () {
    const [, res] = await getAllChannels()
    this.allChannels = res.data.data.channels
  }
}
</script>
<style scoped lang="less">
::v-deep .van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  .van-tabs__line {
    background: @geek-color;
    height: 2px;
    width: 32px;
  }
  .van-tab {
    color: #9ea1ae;
  }
  .van-tab--active {
    font-size: 18px;
    color: #333;
  }
  .van-tabs__wrap {
    padding-right: 86px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  .van-tabs__content {
    flex: 1;
    overflow: hidden;
  }
  .van-tab__pane {
    height: 100%;
  }
}

.home-page {
  .btn-wrapper {
    position: absolute;
    right: 0;
    top: 0;
    width: 86px;
    height: 44px;
    background: #fff;
    display: flex;
    align-items: center;
    .geek-icon {
      flex: 1;
      text-align: center;
      font-size: 18px;
    }
    &::before {
      content: '';
      width: 20px;
      height: 44px;
      position: absolute;
      left: -20px;
      top: 0;
      background: linear-gradient(to right, rgba(255, 255, 255, 0), #fff);
    }
  }
}
</style>
