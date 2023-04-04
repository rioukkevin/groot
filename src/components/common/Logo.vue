<template>
  <svg style="isolation:isolate" :style="style" viewBox="0 0 100 100" width="100pt" height="100pt" class="k-logo">
    <path class="k-logo-k" d=" M 25 95 L 25 5 M 75 95 L 37 49 L 75 5" fill-rule="evenodd" fill="none" vector-effect="non-scaling-stroke" stroke-width="1.5" stroke="rgb(0,0,0)" stroke-linejoin="round" stroke-linecap="butt"/>
    <path class="k-logo-r" d=" M 25 95 L 25 5 L 43 5 C 85.5 5.25 85.313 49.125 43 49 L 37 49 L 75 95" fill="none" vector-effect="non-scaling-stroke" stroke-width="1.5" stroke="rgb(0,0,0)" stroke-linejoin="round" stroke-linecap="butt"/>
  </svg>
</template>

<script>
export default {
  props: {
    k: {
      type: Number,
      default: 1.5
    },
    r: {
      type: Number,
      default: 1.5
    },
    fill: {
      type: String,
      default: '#fff'
    },
    size: {
      type: Array,
      default: () => [100,100]
    }
  },
  computed: {
    style() {
      return {
        '--r':this.r,
        '--k':this.k,
        '--fill':this.fill,
        '--width': this.size[0] + 'px',
        '--height': this.size[1] + 'px'
      } 
    }
  },
}
</script>

<style lang="scss">
  .k-logo{
    width: var(--width);
    height: var(--height);

    .k-logo-k{
      stroke-width: var(--k);
      stroke: var(--fill);
      transition: stroke-width 300ms;
    }
    .k-logo-r{
      stroke-width: var(--r);
      stroke: var(--fill);
      transition: stroke-width 300ms;
    }
  }
</style>