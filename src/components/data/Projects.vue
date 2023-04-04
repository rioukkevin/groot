<template>
  <div class="tiles" ref="tiles">
    <div class="search" :style="{width:searchWidth}">
      <v-text-field solo v-cursor="'text'" v-model="projectFilter" placeholder="Rechercher dans les projets" style="width: 100%" class="search-input"/>
    </div>
    <div class="tilescontent">
      <k-project v-for="(p) in projectData" :key="p.id" :data="p" :color="p.colors[0]"/>
    </div>
  </div>
</template>

<script>
import animation from '@mixins/projectlist.animation'
import data from '@mixins/projectlist.data'

export default {
  mixins: [animation, data],
  computed: {
    searchWidth(){
      if(!this.isMobile){
        const num = Math.floor(this.$vssWidth / 600)
        const res = (num * 600) - 40
        return res + 'px'
      }else{
        return '100%'
      }
    }
  }
}
</script>

<style lang="scss">
  @keyframes tiles {
    from{
      opacity: 0
    }
    to{
      opacity: 1;
    }
  }

  .k-mobile{
    .tiles{
      .search{
        cursor: none !important;
        margin-bottom: 40px;
        margin-top: 40px;
        width: calc(100% - 50px);

        input{
          width: 100%;
          height: 60px;
          border-color: white !important;
          border-width: 2px;
          padding: 0 50px;
          border-radius: 0;
          font-size: 20px;
          background-color: transparent;
          cursor: none !important;
        }

        svg{
          width: 20px;
          height: 20px;
          margin-right: 50px;
        }
      }
    }
  }

  .tiles{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .search{
      cursor: none !important;
      margin-bottom: 40px;
      margin-top: 40px;

      .v-input__slot{
        height: 60px;
        border-color: white !important;
        border-width: 2px;
        padding: 0 50px;
        border-radius: 0;
        font-size: 20px;
        background-color: transparent;
        cursor: none !important;
      }

      svg{
        width: 20px;
        height: 20px;
        margin-right: 50px;
      }

      &:hover{
        .v-input__slot{
          background-color: white;
          border: 2px solid #F8F301 !important;
        }
      }
    }

    .tilescontent{
      min-height: 700px; 
      width: 100vw;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      align-items: center;

      .k-tile{
        animation: backwards tiles 500ms;
      }
    }
  }
</style>