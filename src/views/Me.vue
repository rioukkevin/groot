<template>
  <div class="k-me-blabla" :class="{'vertical': isVertical}">
    <article>
      <h1>README.md</h1>
      <p>
        Attention, il va falloir prendre votre courage à deux mains, j'ai été inspiré, ça fait beaucoup à lire !!
      </p>
    </article>
    <article>
      <h1>Qui suis-je ?</h1>
      <p>
        Tout d'abord, je suis un jeune étudiant en alternance, j'alterne entre l'école MyDigitalSchool d'angers et un poste dans le service R&D (Recherche et développement) de l'entreprise Pasquier. Ceci n'étant pas suffisant, je fait aussi du freelance en parallèlle afin d'apprendre à travailler avec d'autres technologies que celles que j'utilise à Pasquier. 
      </p>
    </article>
    <article>
      <h1>Mon quotidien</h1>
      <p>
        Une journée classique est la suivante, je commence par un réveil en musique, un petit déjeuner, un peu de lait et des céréales et PAF! ça fait des chocapics. Ensuite un petit peu de veille, je regarde les news (Merci google qui les sélectionnent pour moi) et un petit coup d'oeil sur les réalisations de la veille du #DailyUI, si j'ai un peu de temps il y a aussi awwwards et cssdesignawards qui me donnent des sources d'inspiration. C'est bien tout ça mais il faut payer son loyer donc je prend la route pour le boulot ou les cours. Quelques heures de dev et quelques réunions plus tard je rentre chez moi. Enfin arrive la soirée, là ça change presque touts les jours, si j'ai un contrat de freelance en cours je passe ma soirée dessus pour avoir de la marge en fin de semaine et prendre un peu de temps pour "Chill". Sinon si je n'ai pas de freelance en route il y a toujours quelque chose à faire, des expériences personnelles à développer, un peu de netflix, un peu de jeu-vidéo mais mon activité préférée c'est les soirées avec les amis. Maintenant il est tard, une bonne nuit de sommeil et ça repart pour une nouvelle itération.  
      </p>
    </article>
    <article>
      <h1>Avec quelles technos je travaille principalement ?</h1>
      <p>
        Et bien du vueJS évidemment! Comme ce site le prouve. ... // TODO continuer la rédaction 
      </p>
    </article>
  </div>
</template>

<script>

export default {
  name: 'me',
  data() {
    return {

    }
  },
  metaInfo: {
    title: '😎 Accueil',
    meta: [
      {property: 'og:title', content: 'RIOU Kevin - Portfolio 😎'},
      {property: 'og:site_name', content: 'RIOU Kevin'},
      {property: 'og:type', content: 'website'},
      {property: 'og:url', content: 'https://kevin.riou.pro'},
      {property: 'og:image', content: 'https://kevin.riou.pro/assets/me/mini.png'},
      {property: 'og:description', content: 'I am Groot. Ce Site web est mon portfolio est le point d\'entrée vers mon prfil pour le freelance. Vous pouvez me contacter pour avoir un peu plus d\'informations sur moi'},

      // Twitter card
      {name: 'twitter:card', content: 'summary'},
      {name: 'twitter:site', content: 'https://kevin.riou.pro'},
      {name: 'twitter:title', content: 'RIOU Kevin - Portfolio 😎'},
      {name: 'twitter:description', content: 'I am Groot. Ce Site web est mon portfolio est le point d\'entrée vers mon prfil pour le freelance. Vous pouvez me contacter pour avoir un peu plus d\'informations sur moi'},
      {name: 'twitter:creator', content: '@RiouKevin6'},
      {name: 'twitter:image:src', content: 'https://kevin.riou.pro/assets/me/mini.png'},

      // Google / Schema.org markup:
      {itemprop: 'name', content: 'RIOU Kevin - Portfolio 😎'},
      {itemprop: 'description', content: 'I am Groot. Ce Site web est mon portfolio est le point d\'entrée vers mon prfil pour le freelance. Vous pouvez me contacter pour avoir un peu plus d\'informations sur moi'},
      {itemprop: 'image', content: 'https://kevin.riou.pro/assets/me/mini.png'}
    ]
  }
}
</script>

<style lang="scss">
  .k-me-blabla{
    background-color: white;
    min-height: 100vh;
    padding: 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    article{
      margin: 40px 0;

      h1{
        color: black;
        text-transform: uppercase;
        max-width: 90%;
        width: 550px;
        font-size: 27px;
      }

      p{
        color: black;
        max-width: 90%;
        width: 550px;
        font-size: 17px;
      }

      &:nth-child(2n){
        margin-left: 7%;
      }
      &:nth-child(2n+1){
        margin-right: 7%;
      }
    }
  }
</style>