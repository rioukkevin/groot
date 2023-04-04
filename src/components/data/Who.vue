<template>
  <div class="k-who">
    <v-navigation-drawer
      temporary
      fixed
      width="500"
      v-model="vcard"
      class="k-vcard"
    >
      <img src="/assets/vcard.svg" width="300px" id="k-qr" />
      <v-btn
        dark
        class="k-button k-vcard-button"
        v-cursor="'download'"
        @click="download"
        >Télécharger</v-btn
      >
      <v-btn
        dark
        class="k-button k-vcard-button"
        v-cursor="'close'"
        @click="vcard = false"
        >Fermer</v-btn
      >
    </v-navigation-drawer>
    <k-logo :size="[50, 50]" :fill="rainbow" :r="2" :k="2" />
    <div ref="name" class="k-name-container">RIOU KEVIN</div>
    <h2 class="k-job" v-title>Développeur web en freelance</h2>
    <p class="k-description">
      Salut, moi c'est Kévin, je suis un jeune étudiant à MyDigitalSchool
      travaillant en alternance dans l'entreprise Alpha8 et en Freelance à mon
      compte. N'hésitez pas à vous balader sur mon site pour voir quelques
      réalisations que j'ai faites.
      <v-btn
        id="addContact"
        class="k-button"
        v-cursor="'contact'"
        @click="getContact"
      >
        Ajouter aux contacts
      </v-btn>
    </p>
    <span class="k-punchline">Have a nice day and be happy</span>
    <k-img
      src="/assets/me/head000.webp"
      src-placeholder="/assets/me/head000.lazy.webp"
      class="k-me"
      :style="{ right: scroll / 12 + 'px' }"
    />
    <div class="k-social">
      <a href="mailto:riou.kkevin@gmail.com" v-cursor="'email'">Email</a>
      <a href="tel:+33618260849" v-cursor="'tel'">Tèl</a>
      <a
        target="_blank"
        href="https://www.instagram.com/riou.pro/"
        v-cursor="'instagram'"
        >Instagram</a
      >
      <a
        target="_blank"
        href="https://www.linkedin.com/in/k%C3%A9vinriou/"
        v-cursor="'linkedin'"
        >Linkedin</a
      >
      <a
        target="_blank"
        href="https://github.com/rioukkevin"
        v-cursor="'github'"
        >Git</a
      >
    </div>
  </div>
</template>

<script>
import mixinRainbow from "@mixins/rainbow.animation";
import animation from "@mixins/who.animation";
import isMobileMixin from "@mixins/mobile";

export default {
  mixins: [mixinRainbow, animation, isMobileMixin],
  props: {
    scroll: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      vcard: false,
    };
  },
  methods: {
    getContact() {
      this.vcard = true;
    },
    download() {
      let a = document.createElement("a");
      a.href = "/assets/kevin.vcf";
      a.download = "RIOU-kevin.vcf";
      document.body.append(a);
      a.click();
      a.remove();
    },
  },
  mounted() {
    if (!this.isMobile) {
      let name = this.$refs.name.textContent;
      let container_letter = this.$refs.name;
      this.$refs.name.innerHTML = "";
      const number = 5;
      for (let ind = 0; ind < name.length; ind++) {
        const l = name[ind];
        const color = "rgb(toto,toto,toto)";
        const line = document.createElement("div");
        line.classList.add("line_letter");
        line.innerHTML =
          '<span class="l" style="color:' +
          color.replace(/toto/g, "255") +
          ";z-index:" +
          (number + 1) +
          '">' +
          l +
          "</span>";
        for (let index = 0; index < number - 1; index++) {
          let col = 151 - (100 / (number - 2)) * index;
          line.insertAdjacentHTML(
            "beforeend",
            '<span class="l" style="color:' +
              color.replace(/toto/g, col) +
              ";z-index:" +
              (number - index) +
              '">' +
              l +
              "</span>"
          );
          line.insertAdjacentHTML(
            "afterbegin",
            '<span class="l" style="color:' +
              color.replace(/toto/g, col) +
              ";z-index:" +
              (number - index) +
              '">' +
              l +
              "</span>"
          );
        }
        const space = this.isMobile ? 35 : 100;
        container_letter.insertAdjacentHTML(
          "beforeend",
          '<div class="k-name-line" style="margin-left:' +
            Math.random() * space +
            'px">' +
            line.innerHTML +
            "</div>"
        );
      }
    }
  },
};
</script>

<style lang="scss">
@import "../../styles/variable.scss";

.k-mobile {
  .k-who {
    .k-logo {
      left: inherit;
      top: 25vh;
      right: 0;
      width: 55vh;
      height: 55vh;
      z-index: 3;
      position: absolute;
    }
    .k-me {
      position: relative;
      height: 65vh;
    }

    .k-social {
      right: 15px;
      flex-direction: column;
      text-align: right;

      a {
        padding: 10px;

        &:hover {
          filter: blur(3px);
        }
      }
    }

    .k-name-container {
      top: 25px;
      left: 25px;
      font-size: 35px;
      font-weight: 700;
    }

    .k-job {
      top: 70px;
      white-space: nowrap;
      left: 25px;
      font-weight: 400;
      font-size: 40px;
    }

    .k-description {
      max-width: 70vw;
      right: 10vw;
      top: inherit;
      bottom: 25vh;
      font-size: 16px;

      #addContact {
        right: 0;
        bottom: -10vh;
        border-radius: 0px !important;
        height: 50px !important;
        cursor: none !important;

        &:hover {
          span {
            filter: blur(3px);
          }
        }
      }
    }
  }
}

.k-who {
  text-align: left;
  color: white;
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 100vw;

  .k-vcard {
    .v-navigation-drawer__content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: relative;

      .k-vcard-button {
        margin: 15px 30px;
        height: 40px !important;
        background-color: #000 !important;
      }
    }
  }

  .k-logo {
    position: fixed;
    top: 30px;
    left: 30px;
    z-index: 999;
    filter: grayscale(1) brightness(300%);
    transition-duration: filter 300ms;

    &:hover {
      filter: grayscale(0) brightness(100%);
    }
  }

  .k-name-container {
    position: absolute;
    left: 0;
    display: flex;
    flex-direction: column;
    animation: inFade 500ms forwards;

    .k-name-line {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0;
      transition-duration: 300ms;
      will-change: margin;

      &:hover {
        margin-top: 20px;
        margin-bottom: 20px;
      }

      .l {
        width: 40px;
        height: 80px;
        font-size: 100px;
        font-weight: 700;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #000;
        box-shadow: 0 0 60px 30px #000;
        transition-duration: 250ms;
        opacity: 0.75;
      }
    }
  }

  .k-job {
    font-size: 35px;
    font-weight: 100;
    color: inherit;
    z-index: 20;
    animation: inScale 500ms forwards;
    position: absolute;
    top: calc(50% - 20px);
    right: 300px;
    font-weight: 700;
    text-shadow: 0px 0px 20px #000;
  }

  .k-description {
    max-width: 600px;
    font-size: 18px;
    font-weight: 100;
    color: inherit;
    z-index: 20;
    position: absolute;
    right: 300px;
    top: calc(50% + 50px);
    text-align: right;
    text-shadow: 0px 0px 20px #000000;
    animation: inScale 500ms forwards;

    #addContact {
      position: absolute;
      right: 0;
      bottom: -70px;
    }
  }

  .k-punchline {
    font-size: 16px;
    line-height: 18px;
    font-weight: 100;
    color: white;
    z-index: 15;
    animation: inScale 500ms forwards;
    position: absolute;
    right: 50px;
    bottom: 50px;
  }
  .k-me {
    position: absolute;
    animation: inFade 1000ms forwards;
    right: 20px;
    bottom: 0px;
    height: calc(100vh - 50px);
    z-index: 5;
  }
  .k-social {
    position: absolute;
    right: 60px;
    top: 30px;
    z-index: 22;
    display: flex;

    a {
      color: white;
      text-decoration: none;
      text-transform: uppercase;
      padding: 20px;
      transition-duration: 300ms;
      cursor: none;

      &:hover {
        filter: blur(3px);
      }
    }
  }
}

@keyframes inFade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes inScale {
  from {
    transform: scale(0);
  }
  95% {
    transform: scale(1.05);
  }
  to {
    transform: scale(1);
  }
}
</style>