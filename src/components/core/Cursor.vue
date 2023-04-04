<template>
  <div class="cursor_contain" :class="cursorClass">
    <div class="follow" ref="follow" v-if="!icon.includes('no')">
      <div class="back"></div>
    </div>
    <div class="cursor" ref="cursor" v-if="!icon.includes('no')">
      <div class="pointer">
        <v-icon v-if="!icon.includes('blank')"> {{ icon }} </v-icon>
      </div>
    </div>
  </div>
</template>

<script>
import anime from 'animejs/lib/anime.es.js';

export default {
  data() {
    return {
      type: 'blank',
      class: 'blank',
      match: {
        'no': 'no',
        'blank': 'blank',
        'experience': 'mdi-flask',
        'search': 'mdi-magnify',
        'more': 'mdi-plus',
        'project':'mdi-open-in-new',
        'play':'mdi-spotify',
        'left':'mdi-skip-previous',
        'right':'mdi-skip-next',
        'instagram':'mdi-instagram',
        'linkedin':'mdi-linkedin',
        'github':'mdi-code-tags',
        'send':'mdi-send',
        'tel':'mdi-phone',
        'email':'mdi-gmail',
        'link': 'mdi-link',
        'text':'blank',
        'contact': 'mdi-account-plus',
        'close': 'mdi-close',
        'download': 'mdi-download',
      }
    }
  },
  created () {
    window.addEventListener('mousemove', this.cursorMove); 
    window.addEventListener('click', this.clickEvent);
  },
  beforeRouteEnter (to, from, next) {
    window.addEventListener('mousemove', this.cursorMove);
    next()
  },
  destroyed () {
    window.removeEventListener('mousemove', this.cursorMove);
    window.removeEventListener('click', this.clickEvent);
  },
  beforeRouteLeave (to, from, next) {
    window.removeEventListener('mousemove', this.cursorMove);
    this.$cursor.type = "blank"
    this.$cursor.class = "blank"
    next()
  },
  watch: {
    '$cursor.type': function () {
      this.type = this.$cursor.type
    },
    '$cursor.class': function () {
      this.class = this.$cursor.class
    }
  },
  computed: {
    cursorClass(){
      return ['cursor_'+this.type, 'cursor_'+this.class]
    },
    icon() {
      return this.match[this.type] 
    }
  },
  methods: {
    cursorMove (e) {
      if(!this.icon.includes('no')){
        let follow = this.$refs.follow
        setTimeout(() => {
          follow.style.left = e.x + 'px'
          follow.style.top = e.y + 'px'
        }, 70);
        anime({
          targets: follow,
          left: e.x,
          top: e.y,
          duration: 700,
          easing: 'easeOutExpo'
        })
        let cursor = this.$refs.cursor
        cursor.style.left = e.x + 'px'
        cursor.style.top = e.y + 'px'
      }
    }
  }
}
</script>

<style lang="scss">
  .follow{
    position: fixed;
    top: 50%;
    left: 50%;
    width: 100px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    pointer-events: none;
    margin: -50px;
    z-index: 1004;
    mix-blend-mode: exclusion;

    .back{
      transition-duration: 200ms;
      position: relative;
      box-shadow: inset 0 0 0 3px rgba(255,255,255,0.3);
      border-radius: 50%;
      width: 40px;
      height: 40px;
      mix-blend-mode: exclusion;
    }
  }
  .cursor{
    position: fixed;
    top: 50%;
    left: 50%;
    width: 100px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    pointer-events: none;
    margin: -50px;
    z-index: 1005;

    .pointer{
      transition-duration: 200ms;
      position: relative;
      background-color: rgba(255,255,255,0.7);
      border-radius: 50%;
      width: 10px;
      height: 10px;
      display: flex;
      justify-content: center;
      align-items: center;

      i, svg{
        width: 22px;
        height: 22px;
      }
    }
  }

  .cursor_contain{
    &.cursor_link, 
    &.cursor_project, 
    &.cursor_play, 
    &.cursor_email, 
    &.cursor_tel, 
    &.cursor_left, 
    &.cursor_right, 
    &.cursor_send, 
    &.cursor_instagram, 
    &.cursor_linkedin, 
    &.cursor_github, 
    &.cursor_more, 
    &.cursor_search, 
    &.cursor_experience, 
    &.cursor_contact,
    &.cursor_download,
    &.cursor_close{
      .pointer{
        width: 50px;
        height: 50px;
      }
      .back{
        width: 80px;
        height: 80px;
        box-shadow: inset 0 0 0 70px rgba(255,255,255,0.3);
      }
    }
    &.cursor_send{
      .pointer{
        background-color: rgba(255,117,140,0.7);
      }
      .back{
        box-shadow: inset 0 0 0 70px rgba(255,117,140,0.3);
      }
    }
    &.cursor_contact{
      .pointer{
        background-color: rgba(255,255,255,1);
      }
      .back{
        box-shadow: inset 0 0 0 70px rgba(255,255,255,1);
      }
    }
    &.cursor_black{
      .pointer{
        background-color: #222;
        
        i::before{
          color: lightgrey !important;
        }
      }
      .back{
        box-shadow: inset 0 0 0 70px rgba(40,40,40,1);
      }
    }
    &.cursor_text{
      .pointer{
        height: 30px;
        width: 2px;
        border-radius: 5px;
        background-color: black;
      }
      .back{
        width: 80px;
        height: 80px;
        box-shadow: inset 0 0 0 0 rgba(255,255,255,0.3);
      }
    }
  }
</style>