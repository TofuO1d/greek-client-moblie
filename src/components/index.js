import GeekIcon from '@/components/geek-icon'

export default {
  install (Vue) {
    // 在这里扩展Vue功能
    Vue.component(GeekIcon.name, GeekIcon)
  }
}
