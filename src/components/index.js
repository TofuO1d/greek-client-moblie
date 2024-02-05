import GeekIcon from '@/components/geek-icon'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import hljs from 'highlight.js'
import 'highlight.js/styles/vs2015.css'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')
dayjs.extend(relativeTime)
export default {
  install (Vue) {
    // install函数 定义全局指令
    Vue.directive('highlight', el => {
      const codeList = el.querySelectorAll('pre code')
      codeList.forEach(code => {
        hljs.highlightElement(code)
      })
    })
    // 在这里扩展Vue功能
    Vue.component(GeekIcon.name, GeekIcon)
    // 全局注册过滤器
    Vue.filter('relativeTime', value => {
      return dayjs(value).toNow()
    })
  }
}
