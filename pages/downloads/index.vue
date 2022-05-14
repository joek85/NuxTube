<template>
  <v-container>
    <v-card class="pa-2" flat>
      <!-- <v-btn icon>
          <v-icon>mdi-folder</v-icon>
      </v-btn> -->
      <!-- <v-file-input
        v-model="files"
        hide-input
        prepend-icon="mdi-folder"
      ></v-file-input> -->
      <!-- <input type="file"/> -->
      <!-- <v-card-title class="subtitle-1 pa-0 ml-2">{{ localPath }}</v-card-title> -->

      <v-list v-if="downloads.length">
      <template v-for="({ infos, progress }) in downloads">
        <v-list-item class="pa-2">
          <v-card width="96" flat class="mr-2">
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
          </v-card>
          <v-list-item-content class="ml-2">
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
      >No downloads.</v-card-subtitle
    >
    </v-card>
  </v-container>
</template>

<script>
import utils from "../../utils/utils";
import { mapGetters } from "vuex";

export default {
  mounted() {
    this.getLocalpath();
  },
  data() {
    return {
      files: [],
      localPath: "",
    };
  },
  computed: {
    ...mapGetters({
      downloading: "getisDownloading",
      downloads: "getDownloads",
    }),
  },
  watch: {
    files(val) {
      console.log(val);
    },
  },
  methods: {
    getLocalpath() {
      this.localPath = utils.getLocalPath();
    },
  },
};
</script>

<style>
</style>