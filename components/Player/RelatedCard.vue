<template>
  <v-card class="transparent" flat>
    <v-card-actions class="pa-0">
      <v-spacer></v-spacer>
      <v-switch class="mr-4" v-if="autoPlay" inset label="Random"></v-switch>
      <v-switch v-model="autoPlay" inset label="Auto Play"></v-switch>
    </v-card-actions>
    <v-container>
      <v-row>
        <v-col
          cols="12"
          class="pa-0 pb-2"
          v-for="related in getRelatedVideos"
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
            :hasMenu="true"
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
          <mix-card v-else-if="related.type === 'mix'" :data="related">
          </mix-card>
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
import MixCard from "../Cards/MixRelatedCard.vue";
export default {
  components: {
    MediaCard,
    PlaylistCard,
    MixCard,
  },
  props: {
    id: "",
  },
  watch: {
    id() {
      this.continuation = "";
      this.ctp = "";
      this.relatedVideos = [];
      this.$fetch();
    },
  },
  data() {
    return {
      continuation: "",
      ctp: "",
      relatedVideos: [],
      fetched: false,
      autoPlay: false,
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
        case "mix":
          return "MixCard";
      }
    },
    blockVideo(videoId) {
      this.$axios
        .$get("/api/player/block", {
          params: {
            videoId: videoId,
          },
        })
        .then((res) => {
          this.hideVideo(videoId);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    hideVideo(videoId) {
      let index = this.relatedVideos.findIndex((item) => {
        return item.id == videoId;
      });
      this.relatedVideos.splice(index, 1);
    },
  },
  computed: {
    getRelatedVideos() {
      return this.relatedVideos;
    },
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
    this.$root.$on("blockVideo", (videoId) => {
      this.blockVideo(videoId);
    });
    this.$root.$on("hideVideo", (videoId) => {
      this.hideVideo(videoId);
    });
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
};
</script>
