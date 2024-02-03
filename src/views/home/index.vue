<template>
  <div class="home-page">
    首页
    <geek-icon style="font-size:50px;color:green" name="weixin"></geek-icon>
  </div>
</template>
<script>
import GeekIcon from '@/components/geek-icon'
import { getAllChannels } from '@/api/channel'
export default {
  name: 'HomePage',
  components: { GeekIcon },
  async created () {
    const [, res] = await getAllChannels()
    console.log(res.data)
  }
}
</script>
<style scoped lang="less"></style>
