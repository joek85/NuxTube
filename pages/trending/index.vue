<template>
  <v-row>
    <v-col cols="4" v-for="video in results" :key="video.videoId">
      <media-card-related
      :videoId="video.videoId"
            :title="video.title"
            :thumbnail="video.videoThumbnails[0]"
            :channelId="video.authorId"
            :authorName="video.author"
            :playCounts="video.playCounts"
            :published="video.publishedText"
            :duration="video.lengthSeconds"
            
      ></media-card-related>
    </v-col>
  </v-row>
</template>

<script>
import MediaCardRelated from '../../components/Cards/MediaCardRelated.vue';
export default {
    head() {
    return {
      title: 'Trending',
    };
  },
  components: {
    MediaCardRelated,
  },
  async asyncData({ params, $axios, store }) {
    const results = await $axios.$get("/api/trending", {
      params: {
        location: "US",
        page: "music",
      },
    });
    console.log(results);
    return { results };
  },
};
</script>

<style scoped>
</style>
