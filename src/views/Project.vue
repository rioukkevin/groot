<template>
  <div
    class="project"
    ref="projectpage"
    :style="{ '--color': this.$route.params.color }"
    :class="{ 'k-mobile': isMobile }"
  >
    <div class="prev">
      <v-icon @click="back" class="backBtn" v-cursor="'close'">
        mdi-close
      </v-icon>
      <div
        class="projectSwitch"
        v-if="side.p"
        @click="previous"
        v-cursor="'project'"
      >
        Voir le projet {{ side.p.title }}
      </div>
    </div>
    <div class="background" ref="back">
      <div class="miniature" ref="miniature" :style="styleMiniature" />
    </div>
    <h1 class="k-title" v-uppercase>
      {{ project.title }}
    </h1>
    <v-row>
      <v-col cols="0" md="12" lg="6" style="text-align: justify">
        <div
          style="display: flex; justify-content: center; align-items: center"
        >
          <v-col :cols="0" md="0" :lg="1" v-if="!$vuetify.breakpoint.mobile" />
          <v-col :cols="0" md="12" :lg="10" style="padding: 40px">
            <h2 class="k-subtitle" v-title>Technologies</h2>
            <div class="k-tech-container">
              <v-chip
                outlined
                class="k-tech"
                v-for="(t, i) in project.technologies"
                :key="i"
                >{{ t }}</v-chip
              >
            </div>
            <h2 class="k-subtitle" v-title>Introduction</h2>
            <p>{{ project.description }}</p>
          </v-col>
          <v-col :cols="0" md="0" :lg="1" v-if="!$vuetify.breakpoint.mobile" />
        </div>
      </v-col>
      <v-col cols="0" md="12" lg="6" style="text-align: justify; padding: 40px">
        <div
          style="display: flex; justify-content: center; align-items: center"
        >
          <v-col :cols="0" md="0" :lg="1" v-if="!$vuetify.breakpoint.mobile" />
          <v-col
            :cols="0"
            md="12"
            :lg="10"
            style="padding: 40px; margin: 25px 0"
          >
            <k-palette :colours="project.colors" />
          </v-col>
          <v-col :cols="0" md="0" :lg="1" v-if="!$vuetify.breakpoint.mobile" />
        </div>
      </v-col>
      <v-col cols="12" v-if="project.imgs.length > 0">
        <k-carousel :project="projectId" :imgs="project.imgs" />
      </v-col>
      <v-col
        cols="0"
        md="12"
        lg="6"
        v-for="(det, i) in project.details"
        :key="i"
        style="text-align: justify"
      >
        <k-detail :data="det" :color="'#555'" />
      </v-col>
    </v-row>
    <div class="next">
      <div
        class="projectSwitch"
        v-if="side.n"
        @click="next"
        v-cursor="'project'"
      >
        Voir le projet {{ side.n.title }}
      </div>
    </div>
    <div class="full" ref="fullscreen"></div>
  </div>
</template>

<script>
import projects from "../services/project";
import anime from "animejs/lib/anime.es.js";
import isMobileMixin from "@mixins/mobile";

export default {
  name: "home",
  mixins: [isMobileMixin],
  data() {
    return {
      projectId: "",
      project: {
        imgs: [],
      },
      side: {
        p: null,
        n: null,
      },
      projectComponent: null,
    };
  },
  computed: {
    styleMiniature() {
      return {
        "background-image":
          "url(/assets/project/" + this.project.id + "/miniature.webp" || "",
      };
    },
  },
  mounted() {
    this.mount();
  },
  methods: {
    async mount() {
      this.projectId = this.$route.params.id;
      this.side.p = projects.previous(this.projectId);
      this.side.n = projects.next(this.projectId);
      let r = await projects.get(this.projectId);
      this.project = r;
      this.projectComponent = r.id;
      let b = this.$refs.back;
      b.scrollIntoView();
      anime({
        targets: b,
        height: "350px",
        duration: 1000,
        easing: "easeOutExpo",
        complete: () => {
          this.$refs.miniature.style.opacity = "1";
          this.$cursor.class = "black";
        },
      });
    },
    back() {
      let f = this.$refs.fullscreen;
      f.style.backgroundColor = "#000";
      f.style.left = "-102vw";
      f.style.top = "0";
      this.$cursor.class = "blank";
      anime({
        targets: f,
        left: "0",
        duration: 1000,
        easing: "easeOutExpo",
        complete: () => {
          this.$router.push({ name: "home" });
        },
      });
    },
    fullscreenTop(color) {
      let f = this.$refs.fullscreen;
      f.style.backgroundColor = color;
      anime({
        targets: f,
        top: "0",
        duration: 1000,
        easing: "easeOutExpo",
        complete: () => {
          this.$router.push({
            name: "redirect",
            params: {
              name: "project",
              p: { id: this.side.p.id, color: this.side.p.colors[0] },
            },
          });
        },
      });
    },
    fullscreenBottom(color) {
      let f = this.$refs.fullscreen;
      f.style.backgroundColor = color;
      f.style.top = "102vh";
      anime({
        targets: f,
        top: "0",
        duration: 1000,
        easing: "easeOutExpo",
        complete: () => {
          this.$router.push({
            name: "redirect",
            params: {
              name: "project",
              p: { id: this.side.n.id, color: this.side.n.colors[0] },
            },
          });
        },
      });
    },
    previous() {
      // eslint-disable-next-line no-console
      console.log(this.side);
      this.fullscreenTop(this.side.p.colors[0]);
    },
    next() {
      this.fullscreenBottom(this.side.n.colors[0]);
    },
  },
  metaInfo() {
    return {
      title: "😝 Projet",
      meta: [
        { property: "og:title", content: "RIOU Kevin - Projets 😎" },
        { property: "og:site_name", content: "RIOU Kevin" },
        { property: "og:type", content: "website" },
        {
          property: "og:url",
          content: "https://kevin.riou.pro/" + this.project.id,
        },
        {
          property: "og:image",
          content:
            "https://kevin.riou.pro/assets/project/" +
            this.project.id +
            "/miniature.png",
        },
        {
          property: "og:description",
          content:
            "I am Groot. Ce Site web est mon portfolio est le point d'entrée vers mon prfil pour le freelance. Vous pouvez me contacter pour avoir un peu plus d'informations sur moi",
        },

        // Twitter card
        { name: "twitter:card", content: "summary" },
        {
          name: "twitter:site",
          content: "https://kevin.riou.pro/" + this.project.id,
        },
        { name: "twitter:title", content: "RIOU Kevin - Projets 😎" },
        { name: "twitter:description", content: this.project.description },
        { name: "twitter:creator", content: "@RiouKevin6" },
        {
          name: "twitter:image:src",
          content:
            "https://kevin.riou.pro/assets/project/" +
            this.project.id +
            "/miniature.png",
        },

        // Google / Schema.org markup:
        { itemprop: "name", content: "RIOU Kevin - Projets 😎" },
        {
          itemprop: "description",
          content:
            "I am Groot. Ce Site web est mon portfolio est le point d'entrée vers mon prfil pour le freelance. Vous pouvez me contacter pour avoir un peu plus d'informations sur moi",
        },
        {
          itemprop: "image",
          content:
            "https://kevin.riou.pro/assets/project/" +
            this.project.id +
            "/miniature.png",
        },
      ],
    };
  },
};
</script>

<style lang="scss">
.project {
  text-align: center;
  color: #2c3e50;
  min-height: calc(100% + 300px);
  width: 100%;
  background: #eee;

  p {
    font-size: 20px;
  }

  .k-tech-container {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 35px;

    .k-tech {
      margin: 0 40px 10px 0;
    }
  }

  .k-subtitle {
    font-weight: 700;
    font-size: 45px;
  }

  .full {
    position: fixed;
    z-index: 5;
    top: -102vh;
    left: 0;
    width: 100%;
    height: 100vh;
  }
  .next {
    border-top: #afafaf solid 1px;
    margin-top: 150px;
  }

  .prev,
  .next {
    height: 150px;
    display: flex;
    justify-content: center;
    align-items: center;

    .projectSwitch {
      font-size: 20px;
      text-transform: uppercase;
      transform: scale(1);
      transition-duration: 300ms;

      &:hover {
        transform: scale(1.2);
        font-weight: bold;
        color: var(--color);
      }

      &::selection {
        color: inherit;
        background-color: transparent;
      }
    }

    .backBtn {
      width: 150px;
      height: 150px;
      top: 30;
      left: 0;
      position: absolute;

      &::before {
        font-size: 50px;

        &:hover {
          color: #ff2565;
        }
      }
    }
  }

  .background {
    background-color: var(--color);
    width: 100%;
    height: 100vh;
    margin: 0;
    padding: 0;
    overflow: hidden;

    .miniature {
      width: 100%;
      height: 100%;
      background-position: center center;
      background-size: 110% auto;
      opacity: 0;
      transition-duration: 500ms;

      &:hover {
        background-size: 100% auto;
      }
    }
  }

  .k-title {
    color: var(--color);
    font-weight: 700;
    text-align: left;
    margin: 0px 40px 20px 40px;
    font-size: 110px;
    transform-origin: left;
    display: flex;
    flex-direction: row;
    position: relative;
    z-index: 1;

    .letter {
      display: block;
      letter-spacing: -5px;
    }
  }
}

.k-mobile {
  .k-title {
    font-size: 50px;
  }

  .background {
    .miniature {
      background-size: auto 110%;

      &:hover {
        background-size: auto 100%;
      }
    }
  }

  .prev,
  .next {
    height: 70px;

    .projectSwitch {
      font-size: 13px;
    }

    .backBtn {
      width: 50px;
      height: 50px;
      top: 30;
      left: 0;
      position: absolute;

      i {
        width: 25px;
        height: 25px;

        svg {
          fill: black;
          width: 25px;
          height: 25px;
          transition-duration: 500ms;

          &:hover {
            fill: #ff2565;
          }
        }
      }
    }
  }
}

::-webkit-scrollbar {
  width: 10px !important;
  height: 0;
}
</style>