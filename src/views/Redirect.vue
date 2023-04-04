<template>
  <div />
</template>

<script>
export default {
  name: 'redirect',
  mounted () {
    this.$router.replace({name: this.$route.params.name, params: this.$route.params.p})
  }
}
</script>