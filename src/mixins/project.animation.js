import anime from 'animejs/lib/anime.es.js';

export default {
  methods: {
    animation_open() {
      let o = this.$refs.overlay
      let top = o.getBoundingClientRect().y;
      let left = o.getBoundingClientRect().x;
      let ew = window.innerWidth
      let eh = window.innerHeight
      o.style.transitionDuration = "0ms"
      o.classList.add("transition-start")
      let Vue = this
      this.$nextTick(() => {
        o.style.position = 'fixed'
        o.style.left = left + 'px';
        o.style.top = top + 'px';
        o.style.width ='700px';
        o.style.height = '700px';
        o.style.zIndex= "50"
        this.$nextTick(() => {
          anime({
            targets: o,
            left: 0,
            top: 0,
            width: ew + 'px',
            height: eh + 'px',
            duration: 1000,
            easing: 'easeOutExpo',
            complete: function() {
              o.classList.add("transition-end")
              Vue.$router.push({name: 'project', params: {id: Vue.data.id, color: Vue.color}})
              Vue.$cursor.type = "blank"
            }
          })
        })
      })
    }
  },
};