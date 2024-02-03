<template>
  <div id="app">
    <router-view class="body" />
    <router-view class="footer" name="tabbar"></router-view>
  </div>
</template>

<style lang="less" scoped>
#app {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .body {
    flex: 1;
    overflow: hidden;
  }
  .footer {
    height: 50px;
  }
}
</style>
