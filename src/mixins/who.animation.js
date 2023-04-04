
export default{
  created () {
    document.addEventListener('mousemove', this.animation_move)
  },
  beforeRouteLeave (to, from, next) {
    document.removeEventListener('mousemove', this.animation_move)
    next()
  },
  destroyed () {
    document.removeEventListener('mousemove', this.animation_move)
  },
  methods: {
    animation_move (el) {
      if(!this.isMobile){
        const tomovecontainer = document.getElementsByClassName('k-name-container')[0]
        tomovecontainer.style.transform = 'translateY('+((el.y - window.innerHeight / 2) * -0.1)+'px)'
      }
    }
  },
}