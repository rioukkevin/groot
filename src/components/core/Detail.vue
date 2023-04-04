<template>
  <div class="k-detail" :style="{'--col': color}">
    <v-col :cols="0" :md="0" :lg="1" v-if="!$vuetify.breakpoint.mobile"/>
    <v-col :cols="0" :md="12" :lg="10" class="k-description" style="padding:40px">
      <slot>
        <h2 class="k-subtitle" v-title>{{data.title}}</h2>
        <p>{{ data.description}}</p>
      </slot>
    </v-col>
    <v-col :cols="0" :md="0" :lg="1" v-if="!$vuetify.breakpoint.mobile" />
  </div>
</template>

<script>
  export default {
    name: 'k-detail',
    props: {
      data: {
        type: Object,
        default: () => {}
      },
      color: {
        type: String,
        default: () => '#000'
      }
    },
    data() {
      return {
        
      }
    }
  }
</script>

<style lang="scss">
  @import '../../styles/variable.scss';

  .k-detail{
    display: flex;
    justify-content: center;
    align-items: center;

    .k-description{
      margin: 25px 0;
    }

    .k-subtitle{
      font-weight: 700;
    }
  }
</style>