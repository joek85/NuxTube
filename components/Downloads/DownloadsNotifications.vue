<template>
  <v-card flat max-width="600">
    <v-list>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>Notifications</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list v-if="downloads.length">
      <template v-for="{ infos, progress } in downloads">
        <v-list-item>
          <v-list-item-avatar>
            <v-img
              class=""
              aspect-ratio="1.7"
              :src="
                infos.videoDetails.thumbnail.thumbnails[
                  infos.videoDetails.thumbnail.thumbnails.length - 1
                ].url.split('?')[0]
              "
            >
              <template v-slot:placeholder>
                <v-row class="fill-height">
                  <v-col cols="12">
                    <v-skeleton-loader type="image"></v-skeleton-loader>
                  </v-col>
                </v-row>
              </template>
            </v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{
              infos.videoDetails.title
            }}</v-list-item-title>
            <v-list-item-subtitle class="">{{
              infos.videoDetails.author
            }}</v-list-item-subtitle>
            <v-list-item-subtitle class="">{{
              progress.total + " MB"
            }}</v-list-item-subtitle>
            <v-progress-linear v-model="progress.progress"></v-progress-linear>
          </v-list-item-content>
          <v-list-item-action>
            <v-list-item-action-text
              v-text="
                progress.downloadedMinutes +
                '/' +
                progress.estimatedDownloadTime
              "
            ></v-list-item-action-text>
            <v-list-item-action-text
              v-text="progress.progress + '%'"
            ></v-list-item-action-text>
          </v-list-item-action>
        </v-list-item>
        <v-divider></v-divider>
      </template>
    </v-list>
    <v-card-subtitle class="text-center" v-else
      >No notifications.</v-card-subtitle
    >
    <v-card-actions
      class="d-flex justify-center"
      v-if="downloads.length && !getPath"
    >
      <v-btn small to="/downloads" nuxt text color="primary">View all</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  watch: {
    "$route.name"(name) {
      if (name === "downloads") {
        this.path = true;
      } else {
        this.path = false;
      }
    },
  },
  data() {
    return {
      path: false,
    };
  },
  computed: {
    ...mapGetters({
      infos: "getDownloadInfos",
      downloading: "getisDownloading",
      downloads: "getDownloads",
    }),
    getPath() {
      return this.path;
    },
  },
  methods: {
    getMediaType(t) {
      switch (t) {
        case 0:
          return "mdi-music";
        case 1:
          return "mdi-video";
        case 2:
          return "mdi-image";
        default:
          break;
      }
    },
  },
};
</script>

<style>
</style>