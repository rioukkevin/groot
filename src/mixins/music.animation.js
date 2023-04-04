import anime from 'animejs/lib/anime.es.js';

export default {
  methods: {
    async animation_next(){
      let album = [this.$refs.album, this.$refs.albumb]
      let song = this.$refs.song
      this.$refs.album.style.transitionDuration = "0ms"
      anime({
        targets: song,
        opacity: 0,
        duration: 300,
        easing: 'easeOutExpo'
      })
      anime({
        targets: album,
        opacity: '0',
        duration: 300,
        easing: 'easeOutExpo',
        complete: async () => {
          let t = await this.data_next()
          this.dat = t
          this.current = this.dat.id
          anime({
            targets: album,
            opacity: '0',
            duration: 1,
            easing: 'linear',
            complete: () => {
              anime({
                targets: song,
                opacity: 1,
                duration: 300,
                easing: 'easeInExpo'
              })
              anime({
                targets: album,
                opacity: '1',
                duration: 300,
                easing: 'easeInExpo',
                complete: () => {
                  this.$refs.album.style.transitionDuration = "300ms"
                }
              })
            }
          })
          
        }
      })
    },
    async animation_previous(){
      let album = [this.$refs.album, this.$refs.albumb]
      let song = this.$refs.song
      this.$refs.album.style.transitionDuration = "0ms"
      anime({
        targets: song,
        opacity: 0,
        duration: 300,
        easing: 'easeOutExpo'
      })
      anime({
        targets: album,
        opacity: '0',
        duration: 300,
        easing: 'easeOutExpo',
        complete: async () => {
          let t = await this.data_previous()
          this.dat = t
          this.current = this.dat.id
          anime({
            targets: album,
            opacity: '0',
            duration: 1,
            easing: 'linear',
            complete: () => {
              anime({
                targets: song,
                opacity: 1,
                duration: 300,
                easing: 'easeInExpo'
              })
              anime({
                targets: album,
                opacity: '1',
                duration: 300,
                easing: 'easeInExpo',
                complete: () => {
                  this.$refs.album.style.transitionDuration = "300ms"
                }
              })
            }
          })
        }
      })
    }
  },
};