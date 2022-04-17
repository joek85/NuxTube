<template>
  <v-container>
    <v-row>
      <v-col order="2" order-sm="1" cols="12" sm="8">
        <v-card flat>
          <v-card-title class="d-flex justify-center">
            <v-col cols="12" md="12" xl="6">
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search..."
                single-line
                hide-details
              ></v-text-field>
            </v-col>
          </v-card-title>
          <v-data-iterator
            :headers="headers"
            :items="gethistoryItems"
            hide-default-header
            :search="search"
          >
            <template v-slot:default="props">
              <v-row class="pa-3">
                <v-col
                  class="pa-1"
                  cols="6"
                  v-for="item in props.items"
                  :key="item.videoId"
                >
                  <media-card-related
                    :videoId="item.videoId"
                    :title="item.title"
                    :thumbnail="{ url: item.thumbnail }"
                    :channelId="item.author_id"
                    :authorThumbnail="{ url: item.author_thumbnail }"
                    :authorName="item.author_name"
                    :duration="convertTime(item.duration)"
                    :published="formatDate(item.published)"
                    :playCounts="getPlayCounts(item.views)"
                  ></media-card-related>
                </v-col>
              </v-row>
            </template>
          </v-data-iterator>
        </v-card>
      </v-col>
      <v-col order="1" order-sm="2" cols="12" sm="4">
        <v-card flat class="mt-3">
          <v-row class="pa-2">
            <v-subheader>DATE</v-subheader>
            <v-spacer></v-spacer>
            <v-card-title class="">
              <v-btn small rounded dark outlined color="primary"
                >clear history</v-btn
              >
            </v-card-title>
          </v-row>
          <v-data-iterator
            :items="results"
            hide-default-header
            :headers="headers"
          >
            <template v-slot:default="props">
              <v-list-item-group v-model="listIndex">
                <v-list-item
                  v-for="(item, i) in props.items"
                  :key="i"
                  @click="getHistory(item.date)"
                >
                  <v-list-item-content>
                    <v-list-item-title>{{
                      getDate(item.date)
                    }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </template>
          </v-data-iterator>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import utils from "../../utils/utils.js";
import service from "../../services/service.js";
import MediaCardRelated from "../../components/Cards/MediaCardRelated.vue";
export default {
  components: { MediaCardRelated },
  data() {
    return {
      disabled: false,
      search: "",
      listIndex: null,
      headers: [
        {
          text: "Dessert",
          value: "title",
        },
      ],
      historyItems: [],
      menuItems: [{ title: "Remove", icon: "mdi-delete" }],
    };
  },
  mounted() {},
  async asyncData({ params, $axios, store }) {
    let results = await $axios.$get("/api/history/dates");
    return { results };
  },
  computed: {
    isDisabled() {
      return this.disabled;
    },
    gethistoryItems() {
      return this.historyItems;
    },
  },
  methods: {
    getDate(date) {
      if (date) return utils.formatDate(date);
    },
    getHistory(date) {
      this.disabled = true;
      service
        .fetchHistory(date)
        .then((response) => {
          this.disabled = false;
          this.historyItems = response.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    removeHistoryItem(id) {
      service
        .removeHistoryItem(id)
        .then((response) => {
          this.$root.$emit("SnackBar", {
            color: "success",
            text: "Video removed!",
          });
        })
        .catch((err) => {
          console.log(err);
        });
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
    menuClick(id) {
      this.removeHistoryItem(id);
    },
  },
};
</script>

<style scoped>
</style>
