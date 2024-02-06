<template>
  <div class="user-profile-page">
    <van-nav-bar
      left-arrow
      @click-left="$router.back()"
      title="个人信息"
    ></van-nav-bar>
    <van-cell-group>
      <van-cell is-link title="头像" center @click="showPhoto = true">
        <van-image
          slot="default"
          fit="cover"
          round
          src="https://img01.yzcdn.cn/vant/cat.jpeg"
        />
      </van-cell>
      <van-cell
        is-link
        title="昵称"
        @click="openNamePopup()"
        :value="user.name || '未填写'"
      />
    </van-cell-group>
    <van-cell-group style="margin-top:12px">
      <van-cell
        is-link
        title="性别"
        @click="showGender = true"
        :value="user.gender === 0 ? '男' : '女'"
      />
      <van-cell
        is-link
        title="生日"
        @click="openBirthdayPopup"
        :value="user.birthday || '未填写'"
      />
    </van-cell-group>
    <div class="logout">
      <span @click="logout">退出登录</span>
    </div>
    <!-- 修改头像-弹出层 -->
    <van-action-sheet
      v-model="showPhoto"
      :actions="[
        { name: '拍照', value: 0 },
        { name: '本地选择', value: 1 }
      ]"
      @select="onPhotoSelect"
      cancel-text="取消"
    />
    <input @change="updatePhoto" type="file" ref="file" style="display:none" />
    <!-- 修改昵称 -->
    <van-popup class="my-popup" v-model="showName" position="right">
      <van-nav-bar
        left-arrow
        @click-left="showName = false"
        @click-right="saveName()"
        right-text="保存"
        title="修改昵称"
      />
      <van-field v-model="name"></van-field>
    </van-popup>
    <!-- 修改性别 -->
    <van-action-sheet
      v-model="showGender"
      :actions="[
        { name: '男', value: 0 },
        { name: '女', value: 1 }
      ]"
      @select="saveGender"
      cancel-text="取消"
    />
    <!-- 修改生日 -->
    <van-popup v-model="showBirthday" position="bottom">
      <van-datetime-picker
        v-model="birthday"
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="showBirthday = false"
        @confirm="saveBirthday"
      />
    </van-popup>
  </div>
</template>
<script>
import { getUserProfile, updateUserPhoto, updateUserProfile } from '@/api/user'
import dayjs from 'dayjs'
export default {
  name: 'UserProfilePage',
  data () {
    return {
      user: {},
      // 修改头像相关数据
      showPhoto: false,
      // 修改用户名称
      showName: false,
      name: '',
      // 修改用户性别
      showGender: false,
      // 修改生日
      showBirthday: false,
      birthday: new Date(),
      minDate: new Date('1960-01-01'),
      maxDate: new Date()
    }
  },
  created () {
    this.getUserProfile()
  },
  methods: {
    async getUserProfile () {
      const [, res] = await getUserProfile()
      this.user = res.data.data
    },
    logout () {
      this.$dialog
        .confirm({
          title: '温馨提示',
          message: '您确认退出极客园吗？',
          theme: 'round-button'
        })
        .then(() => {
          this.$store.commit('user/setToken', '')
          this.$router.push('/')
          this.$toast.success('退出登录')
        })
        .catch(() => {})
    },
    // 选择修改头像-动作面板选项
    onPhotoSelect (item) {
      if (item.value === 1) {
        // 本地选择
        this.$refs.file.click()
        this.showPhoto = false
      }
    },
    // 修改头像
    async updatePhoto () {
      // 选择图片后的文件信息对象
      const file = this.$refs.file.files[0]
      // 打开资源管理器，不选选图片，点击取消 file 是空的
      if (file) {
        // 上传图片
        // 1. 包装一个formData对象，字段名字photo指向的是选择的图片
        const formData = new FormData()
        formData.append('photo', file)
        // 2. 调用API接口
        const [err, res] = await updateUserPhoto(formData)
        if (err) return this.$toast.fail('修改失败')
        // 3. 显示上传成功的头像，成功提示
        this.user.photo = res.data.data.photo
        this.$toast.success('修改成功')
      }
    },
    // 打开修改名称弹出框
    openNamePopup () {
      this.showName = true
      this.name = this.user.name
    },
    // 保存昵称
    async saveName () {
      if (!this.name) return this.$toast('请输入昵称')
      const [err] = await updateUserProfile({ name: this.name })
      if (err) return this.$toast.fail('更新失败')
      // 更新单元格中的昵称
      this.user.name = this.name
      this.showName = false
      this.$toast.success('更新成功')
    },
    // 修改用户性别
    async saveGender (item) {
      const [err] = await updateUserProfile({ gender: item.value })
      if (err) return this.$toast.fail('更新失败')
      this.user.gender = item.value
      this.showGender = false
      this.$toast.success('更新成功')
    },
    // 打开日期选择器
    openBirthdayPopup () {
      this.showBirthday = true
      // 给日期控件赋值，当前用户的生日
      this.birthday = new Date(this.user.birthday)
    },
    // 修改用户生日
    async saveBirthday () {
      // 转换格式
      const date = dayjs(this.birthday).format('YYYY-MM-DD')
      const [err] = await updateUserProfile({ birthday: date })
      if (err) return this.$toast.fail('更新失败')
      this.user.birthday = date
      this.showBirthday = false
      this.$toast.success('更新成功')
    }
  }
}
</script>
<style lang="less" scoped>
.my-popup {
  width: 100%;
  height: 100%;
  /deep/ .van-nav-bar__text {
    color: @geek-color;
  }
  /deep/ .van-field__control {
    background: @geek-gray-color;
    padding: 10px;
    border-radius: 4px;
  }
}
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
