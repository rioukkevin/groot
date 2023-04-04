<template>
  <div class="k-song" :class="{'k-mobile': isMobile}">
    <div class="back">
      <k-img ref="albumb" class="mini" :src="'/assets/music/'+ dat.id +'.webp'" />
    </div>
    <div class="music-content" >
      <k-img ref="album" class="mini" :src="'/assets/music/'+ dat.id +'.webp'" />
      <div class="song" ref="song">{{ dat.title }}</div>
      <v-btn dark class="listen" @click="go(dat.link)" v-cursor="'play'">Ecouter</v-btn>
      <v-btn dark class="next" @click="animation_next" v-cursor="'right'">
        <v-icon>mdi-skip-next</v-icon>
      </v-btn>
      <v-btn dark class="previous" @click="animation_previous" v-cursor="'left'">
        <v-icon>mdi-skip-previous</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import animation from '@mixins/music.animation'
import data from '@mixins/music.data'
import isMobileMixin from '@mixins/mobile'

export default {
  name: 'music',
  mixins: [animation, data, isMobileMixin],
  data() {
    return {
      current: 'billy',
      dat: {}
    }
  },
  mounted () {
    this.data_update()
  },
  methods: {
    go(link){
      window.open(link, "_blank");
    },
  },
}
</script>

<style lang="scss">
  .k-song{
    width: 100vw;
    height: 400px;
    overflow: hidden;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;

    .back,.mini{
      position: absolute;
    }

    .back{
      top: 0;
      left: 0;
      filter: blur(20px);
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;

      img{
        min-width: 100%;
        min-height: 100%;
      }
    }

    .music-content{
      position: relative;
      width: 700px;
      height: 400px;

      &:hover{
        .mini{
          transform: scale(1.2);
        }
      }

      .mini{
        width: 300px;
        height: 300px;
        top: 50px;
        left: 50px;
        transition-duration: 400ms;
      }

      .song{
        position: absolute;
        left: 250px;
        top: 70px;
        background-color: rgba(0, 0, 0, 0.534);
        line-height: 30px;
        text-align: left;
        padding: 5px 50px;
        color: white;
        letter-spacing: 1px;
      }

      .previous,.next{
        position: absolute;
        width: 40px !important;
        height: 40px !important;
        border: 0px solid red;
        background-color: #1db954 !important;
        border-radius: 0;
        transition-duration: 400ms;

        &:hover{
          transform: scale(1.2);
        }

        i{
          color: white;
        }
      }

      .previous{
        bottom: 30px;
        left: 90px;
      }
      .next{
        bottom: 30px;
        left: 250px;
      }

      .listen{
        position: absolute;
        top: 160px;
        left: 300px;
        height: 50px !important;
        width: 150px;
        border: 0px solid red;
        background-color: #1db954 !important;
        color: white;
        box-shadow: none;
        border-radius: 0;
        font-size: 17px;
        transition-duration: 400ms;

        &:hover{
          transform: scale(1.2);
          color: white;
        }
      }
    }

    &.k-mobile{
      height: 600px;

      .music-content{
        width: 100vw;
        height: 600px;

        .mini{
          top: 120px;
          left: calc(50% - 150px);
        }

        .song{
          left: 0px;
          top: inherit;
          bottom: 190px;
          height: 40px;
          width: 100%;
          text-align: center;
        }

        .previous,.next{
          position: absolute;
          width: 60px;
          height: 60px;
        }

        .previous{
          bottom: 30px;
          left: 120px;
        }
        .next{
          bottom: 30px;
          left: inherit;
          right: 120px;
        }

        .listen{
          top: inherit;
          bottom: 110px;
          left: calc(50% - 75px);
        }
      }
    }

  }
</style>