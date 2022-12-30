<template>
  <v-row class="">
    <v-col
      cols="12" sm="4" md="3" xl="2"
      class="pa-1"
      v-for="video in channelVideos.videos"
      :key="video.videoId"
    >
      <media-card :videoId="video.videoId"
        :thumbnail="video.thumbnails"
        :title="video.title"
        :duration="video.duration"
        :published="video.published"
        :playCounts="video.views"
        :sizeMode="`channel`"
      ></media-card>
    </v-col>
    <v-col cols="12">
      <div class="text-center pa-1">
        <v-progress-circular
          v-if="$fetchState.pending"
          indeterminate
          color="primary"
        ></v-progress-circular>
      </div>
    </v-col>
  </v-row>
</template>
<script>
import MediaCard from "../components/Cards/MediaCardRelated.vue";
export default {
  components: {
    MediaCard,
  },
  props: {
    data: [],
  },
  data() {
    return {
      fetched: false,
      channelVideos: { continuation: "", videos: [] },
    };
  },
  mounted() {
    // console.log(this.$props.data[0])
  },
  async fetch() {
    this.fetched = false;
    const videos = await this.$axios.$get("/api/channel/videos", {
      params: {
        channelId: this.$props.data[0].browseId,
        clickTrackingParams: this.$props.data[0].clickTrackingParams,
        params: this.$props.data[0].params,
      },
    });
    console.log(videos);
    this.channelVideos.videos = videos.videos;
    this.channelVideos.continuation = videos.continuation;
    this.fetched = true;
  },
  fetchOnServer: false,
  methods: {
    getCardType(type) {
      // switch (type){
      //   case 'shelf':
      //     return 'ShelfCard';
      //   case 'channelVideo':
      //     return 'ChannelCard';
      //   case 'channelFeaturedVideos':
      //     return 'ChannelFeaturedCard'
      // }
      return type;
    },
  },
};
</script>
