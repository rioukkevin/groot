export default {
  created () {
    window.addEventListener('mousemove', this.moveTiles)
  },
  destroyed () {
    window.removeEventListener('mousemove', this.moveTiles)
  },
  methods: {
    moveTiles(e) {
      const cont = this.$refs.tiles
      let temp = ((e.y - (window.innerHeight/2)) * -0.07)
      cont.style.marginTop = temp + 'px'
      cont.style.marginBottom = (temp * -1) + 'px'
    }
  }
}