<template>
  <van-tabbar :border="false" route>
    <van-tabbar-item to="/">
      <span>首页</span>
      <template #icon="props">
        <geek-icon :name="props.active ? 'home-sel' : 'home'" />
      </template>
    </van-tabbar-item>
    <van-tabbar-item to="/question">
      <span>问答</span>
      <template #icon="props">
        <geek-icon :name="props.active ? 'qa-sel' : 'qa'" />
      </template>
    </van-tabbar-item>
    <van-tabbar-item to="/video">
      <span>视频</span>
      <template #icon="props">
        <geek-icon :name="props.active ? 'video-sel' : 'video'" />
      </template>
    </van-tabbar-item>
    <van-tabbar-item to="/user">
      <span>我的</span>
      <template #icon="props">
        <geek-icon :name="props.active ? 'mine-sel' : 'mine'" />
      </template>
    </van-tabbar-item>
  </van-tabbar>
</template>
<script>
export default {
  name: 'GeekTabbar'
}
</script>
<style scoped lang="less">
.van-tabbar {
  background-color: @geek-gray-color;
  position: static;
}
/deep/ .van-tabbar-item--active {
  color: @geek-color;
  background-color: @geek-gray-color;
}
/deep/ .van-tabbar-item__icon {
  font-size: 20px;
}
/deep/ .van-tabbar-item__text {
  font-size: 10px;
}
</style>
