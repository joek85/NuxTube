<template>
  <v-card class="transparent" flat>
    <v-container>
      <v-row>
        <v-col
          cols="12"
          class="pa-0 pb-2"
          v-for="related in relatedVideos"
          :key="related.id"
        >
          <media-card
            v-if="related.type === 'video'"
            :videoId="related.id"
            :title="related.title"
            :thumbnail="related.thumbnail"
            :channelId="related.channelId"
            :authorThumbnail="related.authorThumbnail"
            :authorName="related.authorName"
            :playCounts="related.playCounts"
            :published="related.published"
            :duration="related.duration"
            :isLive="related.isLive"
          ></media-card>
          <playlist-card
            v-else-if="related.type === 'playlist'"
            :playlistId="related.id"
            :title="related.title"
            :subtitle="related.subtitle"
            :published="related.published"
            :thumbnail="related.thumbnail"
            :videoCounts="related.count"
          ></playlist-card>
        </v-col>
        <v-col cols="12">
          <div class="text-center pa-1" v-if="$fetchState.pending">
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>
<script>
import MediaCard from "../Cards/MediaCardRelated.vue";
import PlaylistCard from "../Cards/PlaylistCard.vue";
export default {
  components: {
    MediaCard,
    PlaylistCard,
  },
  props: {
    id: '',
  },
  watch: {
    id() {
      this.continuation = '';
      this.ctp = '';
      this.relatedVideos = [];
      this.$fetch();
    },
  },
  data() {
    return {
      continuation: '',
      ctp: '',
      relatedVideos: [],
      fetched: false,
    };
  },
  async fetch() {
    this.fetched = false;
    const related = await this.$axios.$get("/api/player/related", {
      params: {
        id: this.id,
        continuation: this.continuation,
        ctp: this.ctp,
      },
    });
    this.continuation = related.continuation;
    this.relatedVideos.push(...related.relatedVideos);
    this.fetched = true;
  },
  fetchOnServer: false,
  methods: {
    loadMore(continuation) {
      if (continuation) {
        this.continuation = continuation.Token;
        this.ctp = continuation.ctp;
        this.$fetch();
      }
    },
    handleScroll() {
      let bottomOfWindow =
        Math.max(
          window.pageYOffset,
          document.documentElement.scrollTop,
          document.body.scrollTop
        ) +
          window.innerHeight ===
        document.documentElement.offsetHeight;
      if (bottomOfWindow && this.fetched) {
        setTimeout(this.loadMore(this.continuation), 1000);
      }
    },
    getCardType(type) {
      switch (type) {
        case "video":
          return "MediaCard";
        case "playlist":
          return "PlaylistCard";
      }
    },
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
};
</script>
