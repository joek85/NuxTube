<template>
  <v-row>
    <v-col sm="6"
           md="4"
           lg="4"
           xl="2"
           v-for="item in results.items"
           :key="item.videoId">
      <!--<MediaCardRelated :data="item"></MediaCardRelated>-->
    </v-col>
  </v-row>
</template>
<script>
  import MediaCard from '../components/MediaCardRelated.vue'
  export default {
    components: {
      MediaCard
    },
    props: {
      channelId: '',
    },
    data() {
      return {
        results: []
      }
    },
    async fetch() {
      this.results = await this.$axios.$get('/api/channel/videos', {
        params: {
          channelId: this.channelId
        }
      });
      console.log(this.results)
    }
  }
</script>
