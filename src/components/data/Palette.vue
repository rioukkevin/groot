<template>
  <div class="k-palette" :class="{'k-mobile': isMobile}">
    <div class="color" v-for="c in colours" :key="c" :style="{'--col':c}">
      <span class="text">{{ c }}</span>
    </div>
  </div>
</template>

<script>
import isMobileMixin from '@mixins/mobile'

export default {
  mixins: [isMobileMixin],
  name: 'k-palette',
  props: {
    colours: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="scss">
  .k-palette{
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;

    .color{
      width: 100px;
      height: 100px;
      display: flex;
      position: relative;
      background-color: var(--col);
      margin: 30px;
      transition-duration: 300ms;
      border-radius: 0px;

      &:hover{
        box-shadow: 3px 3px 0px 25px var(--col);
        transform: rotate(5deg);

        .text{
          color: white;
        }
      }

      .text{
        transition-duration: 300ms;
        text-align: center;
        display: block;
        position: absolute;
        width: 100%;
        top: -25px;
        font-size: 25px;
        color: var(--col);
      }
    }

    &.k-mobile{
      .color{
        width: 70px;
        height: 70px;
        margin: 20px;

        .text{
          top: -15px;
          font-size: 15px;
        }
      }
    }
  }
</style>