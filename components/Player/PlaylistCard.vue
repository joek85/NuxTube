<template>
  <v-expansion-panels class="mb-2" v-model="panel" flat>
    <v-expansion-panel>
      <v-expansion-panel-header class="text-uppercase font-weight-bold">
        Playlists
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <div class="text-center" v-if="$fetchState.pending">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </div>
        <div class="d-flex justify-space-between" v-if="!$fetchState.pending">
          <div>
            <v-card-title v-if="results.sidebar">
              {{ results.sidebar.title }}
            </v-card-title>
            <v-card-subtitle v-if="results.sidebar">
              {{ results.sidebar.videoCounts }} -
              {{ formatViews(results.sidebar.views) }} -
              {{ results.sidebar.published }}
            </v-card-subtitle>
          </div>
          <div class="d-flex align-end pa-0">
            <v-btn icon @click="addPlaylist()">
              <v-icon>mdi-playlist-plus</v-icon>
            </v-btn>
          </div>
        </div>
        <v-list max-height="400" style="overflow-y: auto">
          <v-list-item-group v-model="selected">
            <template v-for="(item, index) in results.videos">
              <v-list-item
                class=""
                :key="item.videoId"
                @click="itemClick(item.videoId, index)"
              >
                <v-list-item-icon v-if="$vuetify.breakpoint.xlOnly">
                  <v-img width="96" height="56" :src="item.thumbnails.url">
                    <template v-slot:placeholder>
                      <v-row class="fill-height">
                        <v-col cols="12">
                          <v-skeleton-loader type="image"></v-skeleton-loader>
                        </v-col>
                      </v-row>
                    </template>
                  </v-img>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-html="item.title"></v-list-item-title>
                  <v-list-item-subtitle
                    v-html="item.subtitle"
                  ></v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-list-item-action-text
                    v-text="index + 1"
                  ></v-list-item-action-text>
                  <v-list-item-action-text
                    v-text="item.duration"
                  ></v-list-item-action-text>
                </v-list-item-action>
              </v-list-item>
              <v-divider :key="index"></v-divider>
            </template>
          </v-list-item-group>
        </v-list>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
<script>
import utils from "../../utils/utils";
export default {
  props: {
    playlistId: "",
    index: 0,
  },
  data() {
    return {
      results: [],
      selected: 0,
      panel: 0,
    };
  },
  watch: {
    index(val) {
      this.selected = val;
      this.$store.commit("setPlaylistIndex", val);
    },
  },
  fetchOnServer: false,
  methods: {
    formatViews(viewCount) {
      return utils.formatNumbers(viewCount);
    },
    itemClick(id, index) {
      this.$router.push({
        name: "player",
        query: {
          id: id,
          playlistId: this.playlistId,
          index: index,
        },
      });
    },
    addPlaylist() {
      this.$root.$emit("Dialog", {playlistId: this.playlistId, playlist: this.results, type: "playlist" });
    },
  },
  mounted() {
    this.selected = Number(this.index);
    this.$store.commit("setPlaylistIndex", this.index);
    this.$root.$on("SkipPlaylist", (index) => {
      this.$router.push({
        name: "player",
        query: {
          id: this.getResults.videos[index].videoId,
          playlistId: this.playlistId,
          index: index,
        },
      });
    });
  },
  computed: {
    getResults() {
      return this.results;
    },
  },
  async fetch() {
    this.results = await this.$axios.$get("/api/playlist", {
      params: {
        playlistId: this.playlistId,
      },
    });
    this.$store.commit("setPlaylistInfo", {
      id: this.playlistId,
      PlaylistLength: this.results.videos.length,
    });
  },
};
</script>