<template>
  <div>Trending</div>

</template>

<script>
    export default {
      async asyncData({params, $axios, store}) {
        const results = await $axios.$get('/api/trending', {
          params: {

          }
        });
        console.log(results);
        return { results }
      },
    }

</script>

<style scoped>

</style>
