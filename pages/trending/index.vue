<template>
  <v-container>
    <v-row>
      <v-col md="4" v-for="video in results" :key="video.videoId">
        <media-card-related
          :videoId="video.videoId"
          :title="video.title"
          :thumbnail="video.thumbnail"
          :channelId="video.author.channelId"
          :authorThumbnail="video.author.thumbnail"
          :authorName="video.author.name"
          :playCounts="video.views"
          :published="video.published"
          :duration="video.duration"
          :hasMenu="true"
        ></media-card-related>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import MediaCardRelated from "../../components/Cards/MediaCardRelated.vue";
export default {
  head() {
    return {
      title: "Trending",
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
    return { results };
  },
};
</script>

<style scoped>
</style>
