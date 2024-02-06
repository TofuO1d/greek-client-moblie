<template>
  <div class="user-profile-page">
    <van-nav-bar
      left-arrow
      @click-left="$router.back()"
      title="个人信息"
    ></van-nav-bar>
    <van-cell-group>
      <van-cell is-link title="头像" center>
        <van-image
          slot="default"
          fit="cover"
          round
          src="https://img01.yzcdn.cn/vant/cat.jpeg"
        />
      </van-cell>
      <van-cell is-link title="昵称" value="清风徐来" />
    </van-cell-group>
    <van-cell-group style="margin-top:12px">
      <van-cell is-link title="性别" value="男" />
      <van-cell is-link title="生日" value="2020-10-10" />
    </van-cell-group>
    <div class="logout">
      <span>退出登录</span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'UserProfilePage'
}
</script>
<style lang="less" scoped>
.user-profile-page {
  background: #f8f8f8;
  .van-image {
    display: block;
    float: right;
    width: 30px;
    height: 30px;
  }
  .van-cell__title {
    width: 50px;
    flex: none;
  }
}
.logout {
  text-align: center;
  position: absolute;
  left: 0;
  bottom: 30px;
  width: 100%;
  color: @geek-color;
}
</style>
