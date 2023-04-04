<template>
  <div :style="styleSize" class="k-tile">
    <div class="k-tile-content" :style="{ ...styleColor, ...styleBackground}">
      <slot />
    </div>
  </div>
</template>

<script>
  import isMobileMixin from '@mixins/mobile'

  export default {
    name: 'k-tile',
    mixins: [isMobileMixin],
    props: {
      width: {
        type: Number,
        default: () => 1
      },
      height: {
        type: Number,
        default: () => 1
      },
      color: {
        type: String,
        default: () => "#DDD"
      },
      background: {
        type: String,
        default: () => "url(https://image.freepik.com/free-vector/gradient-geometric-shape-background_78532-374.jpg)"
      }
    },
    data() {
      return {
        indent: 300
      }
    },
    computed: {
      styleSize() {
        return {
          width: (this.width * this.indent) + 'px',
          height: (this.height * this.indent) + 'px'
        }
      },
      styleColor() {
        return {
          'background-color': this.color
        } 
      },
      styleBackground() {
        return {
          'background-image': this.background
        } 
      }
    },
  }
</script>

<style lang="scss">
.k-tile{
  position: relative;

  .k-tile-content{
    border-radius: 2px;
    box-shadow: 0 0 60px 0 rgba(255,255,255,0.25);
    width: calc(100% - 40px);
    height: calc(100% - 40px);
    margin: 20px;
    background-color: white;
    z-index: 5;
    transition-duration: 300ms;
    will-change: margin, width, height, box-shadow;
    background-size: auto 100%;
    background-position: center center;

    &:hover{
      width: 100%;
      height: 100%;
      margin: 0;
      box-shadow: 0 0 30px 0 rgba(255,255,255,0.25);
      background-size: auto 150%;
    }
  }
}
</style>