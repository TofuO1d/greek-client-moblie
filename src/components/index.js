import GeekIcon from '@/components/geek-icon'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')
dayjs.extend(relativeTime)
export default {
  install (Vue) {
    // 在这里扩展Vue功能
    Vue.component(GeekIcon.name, GeekIcon)
    // 全局注册过滤器
    Vue.filter('relativeTime', value => {
      return dayjs(value).toNow()
    })
  }
}
