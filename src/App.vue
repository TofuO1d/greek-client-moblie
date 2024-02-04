<template>
  <div id="app">
    <keep-alive include="HomePage">
      <router-view class="body" />
    </keep-alive>
    <!-- 当一级路由组件中有tabbar定义时（都是一级路由，二级路由拆成一级路由）
          就执行下面这句代码，反之不执行，因为是命名路由出口，有时则用
    -->
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
