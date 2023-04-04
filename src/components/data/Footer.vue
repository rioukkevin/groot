<template>
  <div class="k-footer" :class="{ 'k-mobile': isMobile }">
    <div class="k-footer-column">
      <!-- I don't use ant design input cause I use netlify form handling, the name attribute is not transmit to html input when using it -->
      <h3 v-title>Pour être informé de mon statut</h3>
      <p v-twemoji>
        Vous pouvez me transmettre votre adresse email, je vous enverrai un
        email lorsque je cherche un job 😜
      </p>
      <form
        name="newsletter"
        method="POST"
        @submit.prevent="handleSubmit"
        action="/success/"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        v-if="!sended"
      >
        <p hidden>
          <label> Don’t fill this out: <input name="bot-field" /> </label>
        </p>
        <div
          style="display: flex; justify-content: center; align-items: center"
        >
          <input
            v-cursor="'text'"
            placeholder="groot@gardian.galaxy"
            type="mail"
            name="mail"
            class="k-newsletter"
            v-model="formData.mail"
            required
          />
          <button class="k-newsletter-btn" v-cursor="'send'" type="submit">
            Envoyer
          </button>
        </div>
      </form>
      <p v-else>
        {{ feedback }}
      </p>
    </div>
    <div class="k-footer-column contact">
      <h3 v-title>Contacts</h3>
      <a target="_blank" href="mailto:riou.kkevin@gmail.com" v-cursor="'email'"
        >riou.kkevin@gmail.com</a
      >
      <a target="_blank" href="tel:+33618260849" v-cursor="'tel'"
        >06.18.26.08.49</a
      >
    </div>
    <div class="k-footer-column">
      <h3 v-title>Crédits</h3>
      <a
        target="_blank"
        href="https://iconscout.com/contributors/jemismali"
        v-twemoji
        v-cursor="'link'"
        >Jemis Mali pour les icones de la barre de statut IphoneXS 😜</a
      >
      <a target="_blank" href="https://www.netlify.com/" v-cursor="'link'"
        >Site web hébergé par Netlify</a
      >
    </div>
    <div class="k-footer-column">
      <h3 v-title>Un petit coup de pouce</h3>
      <p v-twemoji>
        Pour aider au projet de référencement d'une amie, je met le lien ici 😜
      </p>
      <a
        target="_blank"
        href="https://m2c.stafe.fr/"
        v-twemoji
        v-cursor="'link'"
        >Le meilleur snack d'Angers</a
      >
    </div>
  </div>
</template>

<script>
import isMobileMixin from "@mixins/mobile";

export default {
  name: "contact",
  mixins: [isMobileMixin],
  data() {
    return {
      formData: {},
      sended: false,
      feedback: "",
    };
  },
  methods: {
    encode(data) {
      return Object.keys(data)
        .map(
          (key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key])
        )
        .join("&");
    },
    handleSubmit(e) {
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: this.encode({
          "form-name": e.target.getAttribute("name"),
          ...this.formData,
        }),
      })
        .then(() => {
          this.sended = true;
          this.feedback = "Merci, j'en tiendrais compte";
          this.$cursor.type = "blank";
        })
        .catch(() => {
          this.sended = true;
          this.feedback =
            "Hmmm, quelque chose n'a pas fonctionner, je regarderais ça, envois moi un mail à la place";
          this.$cursor.type = "blank";
        });
    },
  },
};
</script>

<style lang="scss">
.k-footer {
  width: 100%;
  height: 100vh;
  transition-duration: 500ms;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  padding: 50px;

  .k-footer-column {
    width: 550px;
    display: flex;
    flex-direction: column;
    margin: 60px;

    p {
      color: white;
      font-size: 20px;
    }

    h3 {
      color: white;
      font-size: 30px;
      white-space: nowrap;
      margin-bottom: 20px;
    }

    a {
      color: white;
      font-size: 20px;
      margin: 10px 0;
      cursor: none !important;
    }

    .k-newsletter {
      height: 60px;
      outline: transparent;
      padding: 0 20px;
      border-radius: 0;
      font-size: 20px;
      width: 300px;
      cursor: none !important;
      border: 0 solid transparent;
      background-color: white !important;
    }
    .k-newsletter-btn {
      height: 60px;
      outline: transparent;
      padding: 0 20px;
      border-radius: 0;
      font-size: 20px;
      border: 0 solid transparent;
      cursor: none !important;
      background-color: white;
      width: 100px;
    }

    &.contact {
      a {
        font-weight: 700;
      }
    }
  }

  &.k-mobile {
    padding: 20px;
    .k-footer-column {
      margin: 30px 0;
      width: 100%;

      .k-newsletter {
        width: calc(100% - 100px);
      }

      a,
      p {
        font-size: 16px;
      }
    }
  }
}
</style>