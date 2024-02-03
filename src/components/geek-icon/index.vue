<template>
  <div class="geek-icon">
    <svg class="icon" aria-hidden="true">
      <use :xlink:href="`#icon-${name}`"></use>
    </svg>
  </div>
</template>
<script>
export default {
  name: 'GeekIcon',
  props: {
    name: {
      type: String,
      default: ''
    }
  }
}
</script>
<style scoped lang="less">
.geek-icon {
  display: inline-block;
  position: relative;
  .icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
}
</style>
