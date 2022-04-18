<template>
  <v-card class="pa-2" flat>
    <v-row>
      <v-col cols="12" md="4">
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
      </v-col>
      <v-col cols="12" md="8">
        <!-- <v-card flat class="pa-0">
          <v-card-title class="pa-1 subtitle-1">{{
            infos.videoDetails.title
          }}</v-card-title>
          <v-card-subtitle class="pa-1 subtitle-2 grey--text">
            {{ infos.videoDetails.author }}
          </v-card-subtitle>
        </v-card> -->
         <v-card class="d-flex" flat tile>
          <v-card-title class="pa-0" v-snip="{ lines: 2 }">{{
            infos.videoDetails.title
          }}</v-card-title>
        </v-card>
        <v-list-item two-line class="pa-0">
          <v-list-item-avatar>
            <NuxtLink
              class="nuxt-link-exact-active"
              :to="{ name: 'channel-id', params: { id: infos.videoDetails.channelId } }"
            >
              <v-avatar size="56">
                <img :src="infos.videoDetails.thumbnail.thumbnails[infos.videoDetails.thumbnail.thumbnails.length-1].url" />
              </v-avatar>
            </NuxtLink>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ infos.videoDetails.author }}</v-list-item-title>
            <v-list-item-subtitle v-if="infos.videoDetails.viewCount"
              >{{ getPlayCounts(infos.videoDetails.viewCount) + " views - "  + convertTime(infos.videoDetails.lengthSeconds)}}
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-chip v-if="infos.videoDetails.isLiveContent === true" dark small color="red">LIVE</v-chip>
          </v-list-item-action>
        </v-list-item>
      </v-col>
    
      <v-col cols="12">
        <v-card-actions class="pa-0 d-flex justify-end">
          <v-btn
            class="pa-1"
            color="primary"
            text
            :disabled="downloading"
            @click="
              downloadImage(
                infos.videoDetails.thumbnail.thumbnails[
                  infos.videoDetails.thumbnail.thumbnails.length - 1
                ].url.split('?')[0]
              )
            "
          >
            Download Image
          </v-btn>
          <v-btn
            class="pa-1"
            color="primary"
            text
            :disabled="isSelected"
            @click="downloadMedia()"
          >
            Download
          </v-btn>
        </v-card-actions>
      </v-col>
      <v-col cols="12">
        <v-tabs v-model="tab">
          <v-tab v-for="(item, i) in tabItems" :key="item.tab">
            {{ item.tab + "(" + splitInfos[i].length + ")" }}
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item v-for="(item, i) in splitInfos" :key="i">
            <v-data-table
              v-model="selected"
              :headers="getTableHeaders(i)"
              :items="item"
              item-key="itag"
              :search="search"
              show-select
              single-select
            >
              <template v-slot:item.contentLength="{ item }">
                <v-card-text class="pa-0">{{
                  formatNumbers(item.contentLength)
                }}</v-card-text>
              </template></v-data-table
            >
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
import utils from "../utils/utils";
import MediaCardRelated from "./Cards/MediaCardRelated.vue";

export default {
  components: { MediaCardRelated },
  props: {},
  data() {
    return {
      dialog: false,
      tableVideoHeaders: [
        {
          text: "Itag",
          value: "itag",
        },
        {
          text: "Quality",
          value: "qualityLabel",
        },
        {
          text: "Width",
          value: "width",
        },
        {
          text: "Height",
          value: "height",
        },
        {
          text: "mimeType",
          value: "mimeType",
        },
        {
          text: "Size",
          value: "contentLength",
        },
      ],
      tableAudioHeaders: [
        {
          text: "Itag",
          value: "itag",
        },
        {
          text: "Quality",
          value: "audioQuality",
        },
        {
          text: "mimeType",
          value: "mimeType",
        },
        {
          text: "audioChannels",
          value: "audioChannels",
        },
        {
          text: "audioSampleRate",
          value: "audioSampleRate",
        },
        {
          text: "Size",
          value: "contentLength",
        },
      ],
      search: "",
      selected: [],
      downloading: false,
      tab: null,
      tabItems: [
        {
          tab: "Video",
        },
        {
          tab: "audio",
        },
      ],
    };
  },
  watch: {},
  mounted() {},
  computed: {
    ...mapGetters({
      infos: "getDownloadInfos",
    }),
    isSelected() {
      console.log(this.selected);
      return this.selected.length ? false : true;
    },
    splitInfos() {
      let grouped = this.infos.formats.reduce(function (r, a, i) {
        if (!i || r[r.length - 1][0].audioChannels !== a.audioChannels) {
          return r.concat([[a]]);
        }
        r[r.length - 1].push(a);
        return r;
      }, []);
      return grouped;
    },
  },
  methods: {
    downloadImage(url) {
      this.downloading = true;
      this.$axios
        .$get("/api/download/image", {
          params: {
            url: url,
            title: this.infos.videoDetails.title,
            folder: "/home/joe/Pictures/media",
          },
        })
        .then(() => {
          this.downloading = false;

          this.$root.$emit("SnackBar", {
            color: "success",
            text: "Image Downloaded Successfully!",
          });
        })
        .catch((err) => {
          this.downloading = false;
          this.$root.$emit("SnackBar", {
            color: "error",
            text: err,
          });
        });
    },
    downloadMedia() {
      this.$axios
        .$get("/api/download/media", {
          params: {
            id: this.infos.videoDetails.videoId,
            title: this.infos.videoDetails.title,
            itag: this.selected[0].itag,
          },
        })
        .then(() => {})
        .catch((err) => {});
    },
    getTableHeaders(index) {
      switch (index) {
        case 0:
          return this.tableVideoHeaders;
        case 1:
          return this.tableAudioHeaders;
      }
    },
    formatNumbers(nb) {
      return utils.bytesToSize(nb);
    },
        getPlayCounts(nb) {
      return utils.formatNumbers(nb);
    },
    convertTime(time) {
      return utils.convertTime(time);
    },
    formatDate(date) {
      return utils.formatDate(date);
    },
  },
};
</script>

<style>
</style>