export default {
  data() {
    return {
      Rnow: new Date().getTime(),
      Rinterval: 10,
      Rorder: [
        {i: 1, axe: '+', after: [255,255,0]},
        {i: 0, axe: '-', after: [0,255,0]},
        {i: 2, axe: '+', after: [0,255,255]},
        {i: 1, axe: '-', after: [0,0,255]},
        {i: 0, axe: '+', after: [255,0,255]},
        {i: 2, axe: '-', after: [255,0,0]}
      ],
    }
  },
  mounted () {
    setInterval(this.updateDate, 10)
  },
  methods: {
    updateDate() {
      this.Rnow = new Date().getTime()
    }
  },
  computed: {
    rainbow() {
      const steps = 1530
      const index = (this.Rnow % (steps * this.Rinterval)) / this.Rinterval
      const transition = this.Rorder[Math.floor(index/255)]
      const last = Math.floor(index % 255)
      const base = transition.after
      if(transition.axe == '-'){
        base[transition.i] = 255 - last
      }else{
        base[transition.i] = last
      }
      return `rgb(${base[0]},${base[1]},${base[2]})`
    }
  }
}
