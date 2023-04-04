<template>
  <div class="k-xp">
    <h2 v-for="(xp,i) in xps" :key="xp.name" :style="{'--col':xp.color, transform:rdmtr(i)}" v-cursor="'experience'">
      <a target="_blank" :href="xp.url">{{xp.name}}</a>
    </h2>
  </div>
</template>

<script>
import data from '@mixins/xp.data'
import isMobileMixin from '@mixins/mobile'

export default {
  name: 'xp',
  mixins: [data, isMobileMixin],
  props: {
    data: {
      type: Object,
      default: () => {}
    },
  },
  data() {
    return {
      xps: []
    }
  },
  methods: {
    rdmtr(index) {
      let random = Math.random() * 200
      index % 2 == 0 ? random*= -1 : random *= 1
      return this.isMobile ? 'translateX(0px)' : 'translateX('+random+'px)'
    }
  },
}
</script>

<style lang="scss">
  .k-xp{
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    h2{
      margin: 20px;
      font-size: 35px;
      font-weight: bold;
      // background-color: var(--col);
      width: fit-content;

      a{
        
        color: var(--col);
          text-shadow: 0px 0 0px var(--col),
            -0px 0 0px var(--col),
            0 0px 0px var(--col),
            0 -0px 0px var(--col);
        text-decoration: none;
        text-transform: uppercase;
        letter-spacing: 0px;
        transition-duration: 500ms;
        cursor: none !important;

        &:hover{
          color: black;
          text-shadow: 2px 0 6px var(--col),
            -2px 0 6px var(--col),
            0 2px 6px var(--col),
            0 -2px 6px var(--col);
        }
      }
    }
  }
</style>