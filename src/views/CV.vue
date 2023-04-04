<template>
  <div class="k-cv-container">
    <v-snackbar dark v-model="snackbar" :timeout="100000" left top>
      Pour télécharger une version pdf de mon CV cliquez sur le bouton suivant
      <template v-slot:action="{ attrs }">
        <v-btn
          style="margin: 0 20px"
          color="white"
          text
          v-bind="attrs"
          @click="download"
        >
          Télécharger
        </v-btn>
      </template>
    </v-snackbar>
    <div class="k-cv">
      <p class="k-cv-punchline" v-title>Have a nice day and be happy</p>
      <div class="k-cv-me">
        <div class="k-cv-logo">
          <k-logo :r="1.5" :k="0" fill="#F8F301" class="k-cv-r" />
          <k-logo :r="0" :k="1.5" fill="#F8F301" class="k-cv-k" />
          <img class="k-cv-head" src="/assets/me/head000.webp" />
        </div>
        <div class="k-cv-header">
          <p class="k-cv-name">RIOU Kevin</p>
          <p class="k-cv-titre" v-title>
            <span>Développeur</span> <span>&nbsp;Web</span>
          </p>
          <a class="k-cv-link" href="https://github.com/rioukkevin"
            ><v-icon dark small>mdi-github</v-icon> rioukkevin</a
          >
          <a
            class="k-cv-link"
            href="https://www.linkedin.com/in/k%C3%A9vinriou/"
            ><v-icon dark small>mdi-linkedin</v-icon> kévinriou</a
          >
        </div>
      </div>
      <div class="k-cv-contact">
        <a href="mailto:kevin@riou.pro">kevin@riou.pro</a>
        <a href="https://kevin.riou.pro">https://kevin.riou.pro</a>
        <a href="tel:0618260849">06.18.26.08.49</a>
      </div>
      <div class="k-cv-keys">
        <v-chip small outlined color="#555" v-for="key in keys" :key="key">{{
          key
        }}</v-chip>
      </div>
      <div class="k-cv-body">
        <div class="k-cv-col">
          <h1 class="k-cv-title" v-uppercase>Mes Projets</h1>
          <div class="k-cv-projects">
            <div
              class="k-cv-project"
              :style="{ '--project-color': project.colors[0] }"
              v-for="(project, i) in projects"
              :key="i"
            >
              <img :src="'/assets/project/' + project.id + '/tile.webp'" />
              <div class="k-cv-project-content">
                <p v-title>{{ project.title }}</p>
                <p>{{ project.job }}</p>
                <a :href="'https://kevin.riou.pro/project/' + project.id"
                  >Plus de détails</a
                >
              </div>
            </div>
          </div>
        </div>
        <div class="k-cv-col">
          <h1 class="k-cv-title" v-uppercase>Mes expériences</h1>
          <div class="k-cv-xps">
            <div v-for="(xp, i) in xps" :key="i" class="k-cv-xp">
              <h4 v-title>{{ xp.name }}</h4>
              <p class="job">{{ xp.job }}</p>
              <p class="contrat">{{ xp.contrat }}</p>
              <p class="description">{{ xp.description }}</p>
            </div>
          </div>
          <h1 class="k-cv-title" v-uppercase>Mes passions</h1>
          <div class="k-cv-fun">
            <v-chip small outlined color="#f3365c"
              ><v-icon small>mdi-white-balance-sunny</v-icon> Japon</v-chip
            >
            <v-chip small outlined color="#428328"
              ><v-icon small>mdi-car</v-icon> Automobile</v-chip
            >
            <v-chip small outlined color="#008DCB"
              ><v-icon small>mdi-desktop-classic</v-icon> Technologies</v-chip
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import projects from "../services/project";

export default {
  data() {
    return {
      snackbar: true,
      keys: ["Front", "Back", "UI", "UX", "API", "Mobile", "Ops"],
      xps: [
        {
          name: "Centre de Gestion 29",
          contrat: "Alternance",
          job: "Technicien Informatique",
          description:
            "Je découvre le monde du travail (DevOps + Support + Réseau)",
        },
        {
          name: "Triskalia / Eureden",
          contrat: "Alternance",
          job: "Développeur Fullstack",
          description:
            "Je fais principalement du développement métier, je pousse à la mise en place de VueJS (Front)",
        },
        {
          name: "Brioche Pasquier",
          contrat: "Alternance",
          job: "Développeur Front R&D",
          description:
            "Je travaille sur la mise en place d'un framework interne en VueJS (Front)",
        },
      ],
      projects: [],
    };
  },
  mounted() {
    projects
      .list()
      .map((el) => this.projects.push({ id: el, ...projects.get(el) }));
    this.$cursor.type = "no";
  },
  methods: {
    download() {
      let a = document.createElement("a");
      a.href = "/assets/cv/CV_RIOU_Kevin.pdf";
      a.download = "CV_RIOU_Kevin.pdf";
      document.body.append(a);
      a.click();
      a.remove();
    },
  },
};
</script>

<style lang="scss" scoped>
.k-cv-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: default !important;

  .k-cv-title {
    font-size: 20px;
  }

  .k-cv {
    position: relative;
    transform: scale(1);
    width: 588px;
    height: 832px;
    background-color: white;
    padding: 20px;
    overflow: hidden;
    box-shadow: 10px 10px 45px 0px rgba(0, 0, 0, 0.6);

    .k-cv-punchline {
      position: absolute;
      z-index: 10;
      color: rgba(0, 0, 0, 0.8);
      bottom: 10px;
      right: 10px;
      font-weight: 700;
      font-size: 20px;
    }

    .k-cv-me {
      height: 240px;
      position: relative;
      display: flex;
      justify-content: flex-start;
      background-color: black;
      margin: -20px -20px 0 -20px;
      padding: 20px;

      .k-cv-logo {
        position: relative;
        height: 100%;
        width: 180px;
        display: flex;
        justify-content: center;
        align-items: center;

        .k-cv-r {
          position: absolute;
          z-index: 0;
          transform: scale(0.8);
          left: 15px;
          top: 5px;
        }
        .k-cv-k {
          position: absolute;
          bottom: 0;
          left: 75px;
          transform: scale(0.8);
          z-index: 2;
        }

        .k-cv-head {
          height: 100%;
          margin-top: -10px;
          z-index: 1;
        }
      }

      .k-cv-header {
        // border: 1px solid red;
        width: calc(100% - 180px);
        padding-left: 20px;

        .k-cv-name {
          font-size: 58px;
          font-weight: 700;
          color: white;
        }
        .k-cv-titre {
          span {
            font-size: 28px;
            font-weight: 700;
            background-color: #f8f301;
            padding: 0 6px;
          }
          margin-bottom: 20px;
        }
        .k-cv-link {
          display: block;
          font-size: 15px;
          color: white;
          text-decoration: none;
          margin: 7px;
        }
      }
    }

    .k-cv-contact {
      display: flex;
      justify-content: space-evenly;

      a {
        display: block;
        padding: 10px;
        color: black;
        text-decoration: none;
        position: relative;
        font-weight: 700;

        &::after {
          content: "";
          background-color: #f8f301;
          position: absolute;
          width: 100%;
          height: 2px;
          bottom: 5px;
          left: 0;
        }
      }
    }

    .k-cv-keys {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      margin: 0 10px;
      margin-bottom: 20px;
      margin-top: 10px;

      .v-chip {
        margin: 5px 10px;
        transform: scale(1.2);
        font-weight: 700;
      }
    }

    .k-cv-fun {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;

      .v-chip {
        margin: 5px 5px;

        .v-icon {
          margin-right: 10px;
        }
      }
    }

    .k-cv-body {
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
      align-items: flex-start;
      .k-cv-projects {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
        width: 286px;
        flex-direction: column;

        .k-cv-project {
          width: 266px;
          margin: 12px;
          height: calc(100px - 12px);
          position: relative;
          display: flex;
          justify-content: flex-start;

          &::before {
            content: "";
            display: block;
            position: absolute;
            background-color: var(--project-color);
            width: 5px;
            height: 100%;
            top: 0px;
            left: 78px;
          }

          .k-cv-project-content {
            width: 178px;
            height: 100%;
            display: flex;
            flex-direction: column;
            // border: #F8F301 solid 1px;
            margin-left: 5px;
            padding: 6px;
            // box-shadow: 4px 4px 8px 0 rgba(0,0,0,0.4);
            z-index: 2;

            > p:first-child {
              font-size: 21px;
              font-weight: 700;
            }
            > p:nth-child(2) {
              font-size: 14px;
              font-weight: 400;
              margin-top: 10px;
            }
            a {
              font-size: 14px;
              display: block;
              margin-top: 8px;
              color: var(--project-color);
              text-decoration: none;
              white-space: nowrap;
            }
          }

          > img {
            z-index: 1;
            margin-left: -10px;
            width: 88px;
            height: 100%;
            // box-shadow: 4px 4px 8px 0 rgba(0,0,0,0.4);
          }
        }
      }

      .k-cv-xps {
        display: flex;
        flex-wrap: wrap;
        flex-direction: column-reverse;
        width: 278px;
        // border: 1px solid green;

        .k-cv-xp {
          margin: 2px 0 3px 0;
          width: calc(100% - 12px);
          padding: 10px 0;
          // box-shadow: 1px 1px 8px 0 rgba(0,0,0,0.4);
          position: relative;

          &::after {
            content: "";
            position: absolute;
            bottom: 11px;
            left: -7px;
            background-color: #f8f301;
            width: 2px;
            height: 30px;
          }

          h4 {
            padding: 2px 5px;
            margin: 0 0 5px 0;
            font-size: 24px;
            // background-color: #F8F301;
            width: fit-content;
            position: relative;

            &::after {
              content: "";
              position: absolute;
              left: 100%;
              top: 15px;
              background-color: #f8f301;
              width: calc(258px - 100%);
              height: 2px;
            }
          }

          > p {
            font-size: 15px;

            &.description {
              font-size: 12px;
              color: rgba(0, 0, 0, 0.8);
              text-align: justify;
            }

            &.contrat {
              transform-origin: center center;
              width: 70px;
              height: 20px;
              position: absolute;
              top: 8px;
              right: 10px;
              color: darkgrey;
              font-weight: 700;
            }
          }
        }
      }
    }
  }
}

// &::before{
//             content: '';
//             display: block;
//             position: absolute;
//             background-color: #F8F301;
//             width: 100%;
//             height: 100%;
//             z-index: -1;
//             top: 9px;
//             left: 7px;
//           }
//           &::after{
//             content: '';
//             display: block;
//             position: absolute;
//             border-color: var(--cv-project-color);
//             border: 1px solid;
//             width: 100%;
//             height: 100%;
//             z-index: 1;
//             top: 4px;
//             left: 3px;
//           }
</style>