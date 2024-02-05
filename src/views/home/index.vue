<template>
  <div class="home-page">
    <van-tabs animated v-model="activeIndex">
      <van-tab v-for="item in myChannels" :key="item.id" :title="item.name">
        <article-list :channelId="item.id"></article-list>
      </van-tab>
    </van-tabs>
    <!-- 按钮 -->
    <div class="btn-wrapper">
      <geek-icon name="search"></geek-icon>
      <geek-icon name="channel" @click.native="showChannel = true"></geek-icon>
    </div>
    <!-- 频道 -->
    <article-channel
      v-model="showChannel"
      :myChannels="myChannels"
      :activeIndex.sync="activeIndex"
      @addChannelItem="handlerAdd"
      @delChannelItem="handlerDel"
    ></article-channel>
  </div>
</template>
<script>
import { getMyChannels } from '@/api/channel'
// import store from 'vuex'
import GeekIcon from '@/components/geek-icon'
import ArticleList from '@/components/article-list'
import ArticleChannel from '@/components/article-channel'
export default {
  name: 'HomePage',
  data () {
    return {
      myChannels: [],
      // 控制频道组件显示隐藏
      showChannel: false,
      activeIndex: 0
    }
  },
  components: { GeekIcon, ArticleList, ArticleChannel },
  async created () {
    // const [, res] = await getAllChannels()
    // this.myChannels = res.data.data.channels
    // 不使用err不写err即可，但是,号需要写
    const channels = await getMyChannels(this.$store.state.user.token)
    this.myChannels = channels
  },
  watch: {
    '$store.state.user.token': async function () {
      const channels = await getMyChannels()
      this.myChannels = channels
      this.activeIndex = 0
    }
  },
  methods: {
    handlerAdd (item) {
      this.myChannels.push(item)
    },
    handlerDel (index) {
      this.myChannels.splice(index, 1)
    }
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
