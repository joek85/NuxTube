<template>
  <v-card class="transparent" flat>
    <v-card-actions class="pa-0" v-if="getRelatedVideos.relatedVideos.length">
      <v-spacer></v-spacer>
      <v-switch
        class="mr-4"
        v-model="randomPlay"
        v-if="autoPlay"
        inset
        label="Random"
      ></v-switch>
      <v-switch v-model="autoPlay" inset label="Auto Play"></v-switch>
    </v-card-actions>
    <v-row>
      <v-col
        cols="12"
        class="pa-0 pb-2"
        v-for="related in getRelatedVideos.relatedVideos"
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
    </v-row>
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
    related: {},
  },
  watch: {},
  data() {
    return {
      autoPlay: false,
      randomPlay: false,
      mediaCardStyle: "youtube",
    };
  },
  fetchOnServer: false,
  methods: {
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
    getMediaCardStyle() {
      switch (this.mediaCardStyle) {
        case "default":
          return "MediaCard";
        case "youtube":
          return "MediaCard";
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
      return this.related;
    },
  },
  mounted() {
    this.$root.$on("blockVideo", (videoId) => {
      this.blockVideo(videoId);
    });
    this.$root.$on("hideVideo", (videoId) => {
      this.hideVideo(videoId);
    });
    this.$root.$on("audioEnded", () => {
      if (this.autoPlay) {
        let videoId;
        if (this.randomPlay) {
          let ids = this.relatedVideos.map((v) => {
            return v.id;
          });
          videoId = ids[Math.floor(Math.random() * ids.length)];
        } else {
          videoId = this.relatedVideos[0].id;
        }
        this.$router.push({
          name: "player",
          query: {
            id: videoId,
          },
        });
      }
    });
  },
  destroyed() {},
};
</script>
