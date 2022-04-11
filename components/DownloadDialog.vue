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
        <v-card flat class="pa-0">
          <v-card-title class="pa-1 subtitle-1">{{
            infos.videoDetails.title
          }}</v-card-title>
          <v-card-subtitle class="pa-1 subtitle-2 grey--text">
            {{ infos.videoDetails.author }}
          </v-card-subtitle>
        </v-card>
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
          <v-btn class="pa-1" color="primary" text :disabled="isSelected" @click="downloadMedia()">
            Download
          </v-btn>
        </v-card-actions>
      </v-col>
      <v-col cols="12">
        <v-data-table
          v-model="selected"
          :headers="tableHeaders"
          :items="infos.formats"
          item-key="itag"
          :search="search"
          show-select
          single-select
        ></v-data-table>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {},
  data() {
    return {
      dialog: false,
      tableHeaders: [
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
          text: "audioChannels",
          value: "audioChannels",
        },
        {
          text: "audioSampleRate",
          value: "audioSampleRate",
        },
      ],
      search: "",
      selected: [],
      downloading: false,
    };
  },
  watch: {
   
  },
  mounted() {
   
  },
  computed: {
    ...mapGetters({
      infos: "getDownloadInfos",
    }),
    isSelected() {
      return this.selected.length ? false : true;
    },
  },
  methods: {
    downloadImage(url) {
      this.downloading = true;
      console.log(this.infos.videoDetails.title)
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
        .then(() => {
          
        })
        .catch((err) => {
          
        });
    }
  },
};
</script>

<style>
</style>