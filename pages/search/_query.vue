<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-sheet elevation="10" rounded="xl">
          <v-sheet class="pa-2 primary" dark rounded="t-xl">
            <v-card-title class="pa-0 pl-2"
              >Searching for: {{ SearchQuery }}</v-card-title
            >
            <v-card-title class="pa-0 pl-2 subtitle-1">{{
              "Showing " + results.estimatedResults + " results"
            }}</v-card-title>
          </v-sheet>
          <div class="pa-4">
            <v-chip-group active-class="primary--text" column>
              <v-chip
                outlined
                color="primary"
                v-for="refinement in results.refinements"
                :key="refinement"
                :to="{ name: 'search-query', query: { q: refinement } }"
              >
                {{ refinement }}
              </v-chip>
            </v-chip-group>
          </div>
        </v-sheet>
      </v-col>
      <v-col cols="12">
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-header>Filters</v-expansion-panel-header>
            <v-expansion-panel-content>
              <div class="d-flex justify-space-between">
                <v-card
                  flat
                  v-for="(filter, index) in results.searchFilters"
                  :key="index"
                >
                  <v-card-subtitle>{{ filter.title }}</v-card-subtitle>
                  <v-list>
                    <template v-for="(item, index) in filter.filters">
                      <v-list-item
                        :key="item.title"
                        :to="{
                          name: 'player',
                          query: {},
                        }"
                      >
                        <v-list-item-content>
                          <v-list-item-title
                            v-html="item.title"
                          ></v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-divider :key="index"></v-divider>
                    </template>
                  </v-list>
                </v-card>
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
      <v-col order-sm="1" order-md="2" cols="12" md="4">
        <artist-card :data="results.secondaryResults" />
      </v-col>
      <v-col order-sm="2" order-md="1" cols="12" md="8">
        <v-card flat class="transparent">
          <v-col cols="12" class="pa-0">
            <template v-for="(result, index) in results.primaryResults">
              <component
                :key="index"
                :is="getCardType(result.type)"
                :data="result.items"
                class="mb-3"
              />
            </template>
          </v-col>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import VideoCard from "../../components/Search/VideoCard.vue";
import ShelfCard from "../../components/Search/ShelfCard.vue";
import ChannelCard from "../../components/Search/ChannelCard.vue";
import ArtistCard from "../../components/Search/ArtistCard.vue";
import QueryCard from "../../components/Search/QueryCard.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    VideoCard,
    ArtistCard,
    ChannelCard,
    ShelfCard,
    QueryCard,
  },
  data() {
    return {
      refines: null,
      title: "",
    };
  },
  mounted() {},
  head() {
    return {
      title: this.$route.query.q,
    };
  },
  computed: {
    ...mapGetters({
      SearchQuery: "getSearchQuery",
    }),
    getFilters() {
      console.log(
        this.results.searchFilters.map((filters) => {
          // console.log(filters)
          return filters.filters.map((title) => {
            return { name: filters.title, title: title };
          });
        })
      );
    },
  },
  watchQuery: true,
  async asyncData({ query, $axios, store }) {
    const results = await $axios.$get("/api/Search", {
      params: {
        q: query.q,
      },
    });
    console.log(results);
    store.dispatch("storeSearchQuery", query.q);
    return { results };
  },
  methods: {
    getCardType(type) {
      switch (type) {
        case "video":
          return "VideoCard";
        case "channel":
          return "ChannelCard";
        case "shelf":
          return "ShelfCard";
        case "cards":
          return "QueryCard";
      }
    },
  },
};
</script>
