<template>
  <v-container>
    <v-row>
      <v-col order="2" order-sm="1" cols="12" sm="8">
        <v-card>
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
              <v-row class="pa-1">
                <v-col
                  cols="12"
                  md="6"
                  xl="3"
                  v-for="item in props.items"
                  :key="item.videoId"
                >
                  <v-card class="rounded-card pa-2">
                    <v-row>
                      <v-col cols="12">
                        <NuxtLink
                          :to="{ name: 'player', query: { id: item.videoId } }"
                        >
                          <v-img
                            class=""
                            aspect-ratio="1.7"
                            :src="item.thumbnail"
                          >
                            <template v-slot:placeholder>
                              <v-row class="fill-height">
                                <v-col cols="12">
                                  <v-skeleton-loader
                                    type="image"
                                  ></v-skeleton-loader>
                                </v-col>
                              </v-row>
                            </template>
                          </v-img>
                        </NuxtLink>
                      </v-col>
                      <v-col
                        cols="12"
                        class="
                          d-flex
                          flex-column
                          justify-space-between
                          d-sm-inline
                        "
                      >
                        <v-card-title class="pa-0 subtitle-1">
                          <v-row>
                            <v-col sm="10">
                              <v-card-title class="subtitle-1 pa-1">{{
                                item.title
                              }}</v-card-title>
                            </v-col>
                            <v-col sm="1">
                              <v-menu bottom left>
                                <template v-slot:activator="{ on, attrs }">
                                  <v-btn dark icon v-bind="attrs" v-on="on">
                                    <v-icon>mdi-dots-vertical</v-icon>
                                  </v-btn>
                                </template>
                                <v-list>
                                  <v-list-item
                                    v-for="(menu, i) in menuItems"
                                    :key="i"
                                    link
                                    @click="menuClick(item.videoId)"
                                  >
                                    <v-list-item-title>
                                      <v-icon small>{{ menu.icon }}</v-icon>
                                      {{ menu.title }}</v-list-item-title
                                    >
                                  </v-list-item>
                                </v-list>
                              </v-menu>
                            </v-col>
                          </v-row>
                        </v-card-title>
                        <v-card-title class="pa-0">
                          <NuxtLink
                            class="nuxt-link-exact-active"
                            :to="{
                              name: 'channel-id',
                              params: { id: item.author_id },
                            }"
                          >
                            <v-avatar size="36">
                              <img :src="item.author_thumbnail" />
                            </v-avatar>
                          </NuxtLink>
                          <v-col cols="8">
                            <v-toolbar-title
                              class="pa-0 subtitle-2 grey--text"
                              >{{ item.author_name }}</v-toolbar-title
                            >
                          </v-col>
                        </v-card-title>
                        <v-card-title
                          v-if="!item.isLive"
                          class="pa-0 subtitle-2 grey--text"
                          >{{ getPlayCounts(item.views) }} -
                          {{ formatDate(item.published) }} -
                          {{ convertTime(item.duration) }}</v-card-title
                        >
                        <v-chip v-if="item.isLive === true" small color="red"
                          >LIVE</v-chip
                        >
                      </v-col>
                    </v-row>
                  </v-card>
                </v-col>
              </v-row>
            </template>
          </v-data-iterator>
        </v-card>
      </v-col>
      <v-col order="1" order-sm="2" cols="12" sm="4">
        <v-card class="mx-auto">
          <v-row class="pa-2">
            <v-subheader>DATE</v-subheader>
            <v-spacer></v-spacer>
            <v-card-title class="">
              <v-btn small rounded dark color="primary">clear history</v-btn>
            </v-card-title>
          </v-row>
          <v-data-iterator
            :items="results"
            hide-default-header
            :headers="headers"
          >
            <template v-slot:default="props">
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
export default {
  data() {
    return {
      disabled: false,
      search: "",
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
