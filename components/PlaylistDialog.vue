<template>
  <v-card flat>
    <v-card-title>{{ results.length + " Playlists" }}</v-card-title>
    <v-list max-height="400" style="overflow-y: auto">
      <v-list-item-group>
        <template v-for="(item, index) in results">
          <v-list-item class="" :key="'i' + index">
            <v-list-item-icon>
              <v-img width="96" height="56" :src="item.thumbnail">
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
                v-html="
                  item.videoCounts +
                  ' - ' +
                  formatViews(item.views) +
                  ' - ' +
                  item.published
                "
              ></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider :key="index"></v-divider>
        </template>
      </v-list-item-group>
    </v-list>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" text @click="addYTPlaylist()">add</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import utils from "../utils/utils";
export default {
  props: { data: "" },
  data() {
    return {
      results: [],
    };
  },
  async fetch() {
    this.results = await this.$axios.$get("/api/playlist/getplaylists");
    console.log(this.results);
  },
  methods: {
    formatViews(viewCount) {
      return utils.formatNumbers(viewCount);
    },
    addYTPlaylist() {
      this.$axios
        .post("/api/playlist/addplaylist", {
          id: this.data.playlistId,
          playlist: this.data.playlist,
        })
        .then((response) => {
          this.$root.$emit("CloseDialog");
          this.$root.$emit("SnackBar", {
            color: "success",
            text: "Playlist added successfully.",
          });
        })
        .catch((err) => {
          console.log(err);
          this.$root.$emit("CloseDialog");
          this.$root.$emit("SnackBar", { color: "error", text: err });
        });
    },
  },
};
</script>

<style>
</style>