<template>
  <div
    class="k-new-project"
    v-cursor="'project'"
    :style="{
      '--background': 'url(/assets/project/' + data.id + '/tile.webp',
      '--size': size,
    }"
  >
    <div
      class="overlay"
      ref="overlay"
      :style="{ '--color': color }"
      @click="animation_open"
    >
      <h1 v-title>{{ data.title || "" }}</h1>
      <h2>{{ data.job }}</h2>
      <p v-if="!isMobile">{{ data.description || "" }}</p>
      <h3>Plus de détails ></h3>
    </div>
  </div>
</template>

<script>
import animation from "@mixins/project.animation";
import isMobileMixin from "@mixins/mobile";

export default {
  mixins: [animation, isMobileMixin],
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    color: {
      type: String,
      default: () => "white",
    },
  },
  computed: {
    size() {
      return this.isMobile ? "100vw" : "600px";
    },
  },
};
</script>

<style lang="scss">
.k-new-project {
  width: var(--size);
  height: var(--size);
  background-color: yellow;
  background-image: var(--background);
  box-shadow: inset 0 0 0 20px #000;
  transition-duration: 300ms;
  background-size: auto 100%;
  background-position: center center;
  transition-delay: 0ms;

  &:hover {
    transition-delay: 30ms;
    box-shadow: inset 0 0 0 0 #000;
    background-size: auto 150%;
    border: #eaeaea solid 2px;

    .overlay {
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background-color: var(--color);

      h2 {
        top: 40%;
        transition-delay: 0ms;
      }

      h1 {
        opacity: 1;
        top: 30%;
        &::before {
          top: -10px;
        }
      }

      p {
        opacity: 1;
        transition-delay: 200ms;
      }
    }
  }

  .overlay {
    width: calc(100% - 40px);
    height: calc(100% - 40px);
    border-radius: 2px;
    background-color: rgba(0, 0, 0, 0.2);
    position: relative;
    top: 20px;
    left: 20px;
    padding: 40px;
    transition-duration: 300ms;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    box-shadow: inset 0 0 0 2px var(--color);

    h1 {
      position: absolute;
      white-space: nowrap;
      left: 25px;
      width: calc(100% - 50px);
      max-width: calc(100% - 50px);
      top: 25px;
      font-size: 35px;
      font-weight: bold;
      color: white;
      opacity: 1;
      transition-duration: 500ms;
      text-align: left;
      z-index: 2;
      text-shadow: 0px 0px 3px #000;

      &::before {
        display: block;
        position: absolute;
        content: "";
        z-index: -1;
        top: 10px;
        left: 0;
        width: 100%;
        height: 35px;
        background-color: var(--color);
        opacity: 0.7;
        transition-duration: 500ms;
      }
    }

    h2 {
      position: absolute;
      left: 25px;
      top: 80px;
      color: white;
      transition-duration: 300ms;
      transition-delay: 200ms;
      text-shadow: 0px 0px 3px #000;
    }

    h3 {
      position: absolute;
      bottom: 25px;
      right: 25px;
      color: white;
      transition-duration: 300ms;
      text-decoration: underline;
      text-shadow: 0px 0px 2px #000;
    }

    p {
      position: absolute;
      left: 25px;
      top: 65%;
      font-size: 20px;
      width: calc(100% - 50px);
      margin: 0;
      text-align: justify;
      color: white;
      text-align: justify;
      opacity: 0;
      transition-duration: 300ms;
      transition-delay: 0;
      text-shadow: 0px 0px 2px #000;
    }

    &.transition-start {
      h1,
      h2,
      h3,
      p {
        opacity: 0;
        transition-duration: 500ms;
      }
    }
  }
}
</style>