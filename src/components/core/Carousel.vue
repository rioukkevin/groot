<template>
  <div :style="style" v-if="imgs.length > 0" style="position:relative">
    <div class="k-carousel" ref="myCarousel">
      <div class="k-carousel-content">
        <div class="k-carousel-item" v-for="(img, i) in imgs" :key="i">
          <k-img :src="'/assets/project/'+img"/>
        </div>
      </div>
    </div>
    <div class="k-carousel-control">
      <div class="k-carousel-control-indicator" ref="myCarouselIndicator" />
      <div class="k-carousel-control-item" v-for="(img, i) in imgs" :key="i">
        <img :src="'/assets/project/'+img" @click="goTo(i)"/>
      </div>
    </div>
    <div class="k-carousel-overlay">
      <div class="k-carousel-overlay-relative">
        <div class="k-carousel-overlay-controls">
          <v-icon size="72" color="#FFF" @click="previous">
            mdi-skip-previous
          </v-icon>
        </div>
        <div class="k-carousel-overlay-controls">
          <v-icon size="72" color="#FFF" @click="next">
            mdi-skip-next
          </v-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      current: 0
    }
  },
  props: {
    imgs: {
      type: Array,
      default: () => []
    },
  },
  computed: {
    size() {
      return this.$vssWidth > 600 ? 500 : this.$vssWidth
    },
    margin(){
      return this.$vssWidth > 600 ? 50 : 0
    },
    style(){
      return{
        '--carousel-size': this.size + 'px',
        '--carousel-margin': this.margin + 'px',
        '--carousel-height': this.size + (2*this.margin) + 'px'
      }
    }
  },
  methods: {
    goTo(i){
      if(i >= 0 && i <= this.imgs.length - 1 ){
        this.current = i
        const inter = (this.size + (2*this.margin)) * i
        this.$refs.myCarousel.scrollTo(inter,0)
        this.$refs.myCarouselIndicator.style.transform = "translateX("+(i*70)+"px)"
      }
      
    },
    next(){
      this.goTo(this.current + 1)
    },
    previous(){
      this.goTo(this.current - 1)
    }
  },
};
</script>
<style lang="scss">

.k-carousel-control{
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  background-color: black;
  height: 70px;
  width: 100%;
  max-width: 100vw;
  margin-bottom: 50px;
  padding-right: 5px;

  ::selection{
    background-color: transparent;
  }

  .k-carousel-control-indicator{
    background-color: transparent;
    width: 70px;
    height: 70px;
    z-index: 5;
    transition-duration: 300ms;
    margin-right: -70px;
    transform: translateX(0px);
    box-shadow: inset 0 0px 0 3px #eeeeee;

    &:hover{
      box-shadow: inset 0 70px 0 0 #eeeeee;
    }
  }

  .k-carousel-control-item{
    width: 50px;
    height: 50px;
    margin: 10px;
    position: relative;

    &::before{
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      box-shadow: inset 0 0 4px 3px black;
      z-index: 2;
      pointer-events: none;
    }

    img{
      width: 100%;
      height: 100%;
    }
  }
}

.k-carousel{
  position: relative;
  width: 100%;
  max-width: 100vw;
  height: var(--carousel-height);
  background-color: black;
  overflow-x: hidden;
  overflow-y: hidden;
  margin: 50px 0 0 0;
  scroll-behavior: smooth;

  ::selection{
    background-color: transparent;
  }

  .k-carousel-content{
    display: flex;
    height: var(--carousel-height);
    width: fit-content;
    flex-wrap: nowrap;
    padding-left: calc(50% - 300px);
    padding-right: calc(50% - 300px);

    .k-carousel-item{
      width: var(--carousel-size);
      height: var(--carousel-size);
      margin: var(--carousel-margin);
      position: relative;
      // pointer-events: none;
      // border: 1px solid var(--color);
      

      &::before{
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        box-shadow: inset 0 0 40px 30px black;
        z-index: 2;
      }

      img{
        width: 100%;
        height: 100%;
        // pointer-events: all;
      }
    }
  }
}

.k-carousel-overlay{
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: 5;
  pointer-events: none;

  .k-carousel-overlay-relative{
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    justify-content: space-between;

    .k-carousel-overlay-controls{
      pointer-events: all;
      width: 15%;
      min-width: 50px;
      height: 100%;
      background-color: rgba(255,255,255,0.1);
      display: flex;
      justify-content: center;
      align-items: center;
      transition-duration: 300ms;
      will-change: background-color;
      backdrop-filter: blur(4px);

      &:hover{
        background-color: rgba(255,255,255,0.4);

      }
    }
  }
}
</style>