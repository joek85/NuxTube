<template>
  <v-container>
    <v-card>
      <v-img max-height="200"
             :src="results.authorBanners[results.authorBanners.length - 1].url">
      </v-img>
    </v-card>
  </v-container>
</template>
<script>
  export default {
    async asyncData({params, $axios, store}) {
      const results = await $axios.$get('/api/channel', {
        params: {
          channelId: params.id
        }
      });
      console.log(results);
      return { results }
    },
  }
</script>
