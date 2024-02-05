<template>
  <van-popup
    :value="value"
    @click-close-icon="$emit('input', false)"
    closeable
    position="left"
    @closed="isEdit = false"
  >
    <div class="article-channel">
      <div class="head">
        <h3>我的频道<small>点击进入频道</small></h3>
        <a
          class="edit"
          @click="isEdit = !isEdit"
          href="javascript:;"
          :class="{ active: isEdit }"
        >
          {{ isEdit ? '完成' : '编辑' }}
        </a>
      </div>
      <div class="body">
        <a
          href="javascript:;"
          :class="{ active: activeIndex === i }"
          v-for="(item, i) in myChannels"
          :key="item.id"
          @click="enterChannel(i)"
        >
          {{ item.name }}
          <geek-icon
            v-show="isEdit && i !== 0 && i !== activeIndex"
            name="tag-close"
            @click.native.stop="delChannel(item.id)"
          ></geek-icon>
        </a>
      </div>
      <div class="head" style="margin-top:12px">
        <h3>频道推荐</h3>
      </div>
      <div class="body">
        <a
          @click="addChannel(item)"
          href="javascript:;"
          v-for="item in optionalChannels"
          :key="item.id"
          >+ {{ item.name }}</a
        >
      </div>
    </div>
  </van-popup>
</template>
<script>
import { getAllChannels, addChannel, delChannel } from '@/api/channel'
export default {
  name: 'ArticleChannel',
  data () {
    return {
      allChannels: [],
      // 是否编辑
      isEdit: false
    }
  },
  created () {
    this.getAllChannels()
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    myChannels: {
      type: Array,
      default: () => []
    },
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  methods: {
    async getAllChannels () {
      const [, res] = await getAllChannels()
      this.allChannels = res.data.data.channels
    },
    enterChannel (index) {
      this.$emit('input', false)
      this.$emit('update:activeIndex', index)
    },
    // 添加频道
    async addChannel (item) {
      // 1. 使用重置式添加频道数据，准备重置式的数据
      const newMyChannels = []
      this.myChannels.forEach((c, i) => {
        if (i !== 0) {
          newMyChannels.push({
            id: c.id,
            name: c.name,
            seq: i
          })
        }
      })
      newMyChannels.push({ ...item, seq: newMyChannels.length + 1 })
      // 2. 去做添加频道操作
      await addChannel(newMyChannels, this.$store.state.user.token)
      // 3. 成功：更新我的频道(子传父)
      this.$emit('addChannelItem', item)
    },
    // 删除频道
    async delChannel (id) {
      // 删除操作
      await delChannel(id, this.$store.state.user.token)
      // 成功：更新我的频道
      const index = this.myChannels.findIndex(item => item.id === id)
      console.log(index)
      // this.myChannels.splice(index, 1)
      this.$emit('delChannelItem', index)
    }
  },
  computed: {
    // 可选频道
    optionalChannels () {
      // 在myChannels中找不到的就是可选的
      return this.allChannels.filter(
        item => !this.myChannels.find(c => c.id === item.id)
      )
    }
  }
}
</script>
<style scoped lang="less">
.van-popup {
  width: 100%;
  height: 100%;
  ::v-deep .van-popup__close-icon {
    font-size: 20px;
    right: 12px;
    top: 12px;
  }
  .article-channel {
    margin-top: 44px;
    .head {
      padding: 0 16px;
      display: flex;
      justify-content: space-between;
      justify-items: center;
      padding-bottom: 12px;
      h3 {
        font-size: 16px;
        color: #333;
        margin: 0;
        small {
          font-size: 12px;
          color: #999;
          margin-left: 10px;
        }
      }
      .edit {
        float: right;
        height: 22px;
        width: 52px;
        line-height: 22px;
        text-align: center;
        color: #de644b;
        border-radius: 11px;
        border: 1px solid #de644b;
        font-size: 12px;
        &.active {
          color: #fff;
          background: #de644b;
        }
      }
    }
    .body {
      padding: 0 6px 0 16px;
      a {
        position: relative;
        .geek-icon {
          position: absolute;
          top: -5px;
          right: -5px;
          line-height: 1;
        }
        display: inline-block;
        padding: 0 8px;
        font-size: 14px;
        color: #3a3948;
        background: #f7f8fa;
        height: 36px;
        line-height: 36px;
        min-width: 78px;
        margin-right: 10px;
        margin-bottom: 12px;
        border-radius: 18px;
        text-align: center;
        &.active {
          color: @geek-color;
        }
      }
    }
  }
}
</style>
