<template>
  <v-navigation-drawer temporary fixed right v-model="model" class="k-overlay">
    <img src="/assets/vcard.svg" id="k-qr">
    <v-btn class="vcardButton" v-cursor="'download'" @click="download">Télécharger</v-btn>
    <v-btn class="vcardButton" v-cursor="'close'" @click="close">Fermer</v-btn>
    <v-icon @click="close" class="backBtn" v-cursor="'close'">mdi-close</v-icon>
  </v-navigation-drawer>
</template>

<script>

export default {
  data() {
    return {
      model: false
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
  },
  methods: {
    async download() {
      this.$cursor.type = "blank"
      let a = document.createElement('a')
      a.href = '/assets/kevin.vcf'
      a.download = 'RIOU-kevin.vcf'
      document.body.append(a)
      a.click()
      a.remove()
    },
    async close() {
      this.model = false
      // setTimeout(() => {
      //   this.$cursor.type = "blank"
      // }, 300)
    }
  },
  watch: {
    // value(val) {
    //   this.model = val
    // },
    model(val) {
      this.$emit('input', val)
    }
  },
}
</script>

<style lang="scss">
  .k-overlay{
    z-index: 1000 !important;
    background-color: white;
    width: 500px !important;

    .v-navigation-drawer__content{
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }

    .backBtn{
      width: 150px;
      height: 150px;
      top: 0;
      right: 0;
      position: fixed;
      background-color: red;

      // i{
      //   width: 50px;
      //   height: 50px;

      //   svg{
      //     fill: black;
      //     width: 50px;
      //     height: 50px;
      //     transition-duration: 500ms;

      //     &:hover{
      //       fill: #ff2565;
      //     }
      //   }
      // }
    }

    #k-qr{
      width: 300px;
      height: 300px;
      animation: fade 300ms 600ms forwards;
      opacity: 0;
    }

    .vcardButton{
      background-color: black;
      color: white;
      border-radius: 2px;
      box-shadow: 0 0 0 1px black;
      padding: 5px 20px;
      height: auto;
      animation: fade 300ms 600ms forwards;
      opacity: 0;
      border-radius: 50px;
      margin: 30px;

      &:focus{
        border-color: grey;
      }

      &:hover{
        background-color: white;
        box-shadow: 
          0 0 0 0 black,
          inset 0 0 0 1px black;
        border-color: white;
        color: black;
      }
    }
  }

  // Animations
  @keyframes background {
    from{
      right: 50%;
      left: 50%;
    }
    to{
      left: 0;
      right: 0;
    }
  }

  @keyframes fade {
    from{
      opacity: 0;
    }
    to{
      opacity: 1;
    }
  }
</style>