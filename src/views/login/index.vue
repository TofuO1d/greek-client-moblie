<template>
  <div class="login-page">
    <div class="back">
      <!-- .native绑定组件的原生事件，属于组件根元素 -->
      <!-- $router.back() 返回上一次访问路由，forward go -->
      <geek-icon @click.native="$router.back()" name="esay-close"></geek-icon>
    </div>
    <h3 class="title">短信登录</h3>
    <!-- 表单 -->
    <van-form class="form" ref="form">
      <van-field
        name="mobile"
        placeholder="请输入手机号"
        v-model="form.mobile"
        :rules="rules.mobile"
      ></van-field>
      <van-field
        placeholder="请输入验证码"
        v-model="form.code"
        :rules="rules.code"
      >
        <template #button>
          <span class="send" @click="send">{{
            second === 0 ? '发送验证码' : `${second}秒后发送`
          }}</span>
        </template>
      </van-field>
    </van-form>
    <van-button @click="login">登录</van-button>
  </div>
</template>
<script>
import { userLogin, sendMessage } from '@/api/user'
export default {
  name: 'LoginPage',
  data () {
    return {
      // 倒计时秒数
      second: 0,
      // 定时器ID
      timer: null,
      form: {
        mobile: '',
        code: ''
      },
      rules: {
        mobile: [
          { required: true, message: '请输入手机号' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不对' }
        ],
        code: [
          { required: true, message: '请输入手机号' },
          { pattern: /^\d{6}$/, message: '验证码是6个数字' }
        ]
      }
    }
  },
  methods: {
    async login () {
      // validate()启动校验
      await this.$refs.form.validate()
      // 登录
      const [err, res] = await userLogin(this.form)
      // 失败
      if (err) return this.$toast.fail('登录失败')
      // 成功
      this.$store.commit('user/setToken', res.data.data.token)
      this.$router.push(this.$route.query.returnUrl || '/')
    },
    async send () {
      // 已发送，不做事
      if (this.second > 0) return
      // 校验
      await this.$refs.form.validate('mobile')
      // 发短信
      const [err] = await sendMessage(this.form.mobile)
      // 失败
      if (err) return this.$toast.fail('发送失败')
      // 成功 倒计时
      this.second = 60
      if (this.timer) clearInterval(this.timer)
      this.timer = setInterval(() => {
        this.second--
        if (this.second <= 0) clearInterval(this.timer)
      }, 1000)
    }
  },
  beforeDestroy () {
    if (this.timer) clearInterval(this.timer)
  }
}
</script>
<style scoped lang="less">
.send {
  font-size: 12px;
  color: #a5a6ab;
}
.login-page {
  padding: 0 32px;
  .back {
    height: 60px;
    display: flex;
    align-items: center;
    .geek-icon {
      font-size: 20px;
      color: #ccc;
      position: relative;
      left: -15px;
    }
  }
  .title {
    font-size: 22px;
    line-height: 1;
    padding: 30px 0;
  }
  .van-cell {
    padding: 20px 0;
    &::after {
      left: 0;
      right: 0;
    }
  }
  .van-button {
    width: 100%;
    margin-top: 40px;
    height: 50px;
    color: #fff;
    font-size: 16px;
    border: none;
    background: linear-gradient(to right, #ff9999, #ffa179);
  }
}
</style>
