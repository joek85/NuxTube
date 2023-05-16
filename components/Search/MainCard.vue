<template>
  <v-card flat class="transparent">
    <v-row>
      <v-col cols="12">
        <v-sheet flat rounded="xl" v-if="!$fetchState.pending">
          <v-sheet class="pa-2 primary" dark rounded="t-xl">
            <v-card-title class="pa-0 pl-2"
              >Searching for: {{ query.q }}</v-card-title
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
        <v-expansion-panels flat v-if="!$fetchState.pending">
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
                        @click="filterClick(item.params)"
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
              <playlist-card
                class="mb-2"
                v-if="result.type === 'playlist'"
                :key="index"
                :thumbnail="result.items.thumbnails"
                :playlistId="result.items.playlistId"
                :channelId="result.items.channelId"
                :title="result.items.title"
                :subtitle="result.items.subtitle"
                :videoCounts="result.items.videoCounts"
                :videos="result.items.videos"
              ></playlist-card>
            </template>
          </v-col>
        </v-card>
      </v-col>
    </v-row>

    <v-col cols="12">
      <div class="text-center pa-1" v-if="$fetchState.pending">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </div>
    </v-col>
    <!-- </v-col> -->
    <!-- <v-col cols="12">
        <v-sheet flat rounded="xl" v-if="!$fetchState.pending">
          <v-sheet class="pa-2 primary" dark rounded="t-xl">
            <v-card-title class="pa-0 pl-2"
              >Searching for: {{ query.q }}</v-card-title
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
      </v-col> -->
    <!-- </v-row> -->
  </v-card>
</template>
<script>
import VideoCard from "../../components/Search/VideoCard.vue";
import ShelfCard from "../../components/Search/ShelfCard.vue";
import ChannelCard from "../../components/Search/ChannelCard.vue";
import ArtistCard from "../../components/Search/ArtistCard.vue";
import QueryCard from "../../components/Search/QueryCard.vue";
import PlaylistCard from "../../components/Search/SearchPlaylistCard.vue";
import { mapGetters } from "vuex";

export default {
  components: {
    VideoCard,
    ArtistCard,
    ChannelCard,
    ShelfCard,
    QueryCard,
    PlaylistCard,
  },
  props: { query: "" },
  computed: {
    ...mapGetters({
      SearchQuery: "getSearchQuery",
      SearchContinuation: "getSearchContinuation",
    }),
  },
  watch: {
    query() {
      this.results = {
        primaryResults: [],
        secondaryResults: null,
        estimatedResults: "",
        refinements: [],
        searchFilters: [],
      };
      this.continuation = "";
      this.$fetch();
    },
  },
  data() {
    return {
      fetched: false,
      results: {
        primaryResults: [],
        secondaryResults: null,
        estimatedResults: "",
        refinements: [],
        searchFilters: [],
      },
      continuation: "",
    };
  },
  async fetch() {
    this.fetched = false;
    const response = await this.$axios.$get("/api/search", {
      params: {
        q: this.query.q,
        sp: this.query.sp,
        continuation: this.continuation,
      },
    });
    if (!this.continuation) {
      this.results.primaryResults.push(...response.primaryResults);
      this.results.secondaryResults = response.secondaryResults;
      this.results.estimatedResults = response.estimatedResults;
      this.results.refinements = response.refinements;
      this.results.searchFilters = response.searchFilters;
    } else {
      this.results.primaryResults.push(...response.primaryResults);
    }
    this.continuation = response.continuation;
    this.fetched = true;
  },
  fetchOnServer: false,
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
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
    filterClick(param) {
      this.$router.push({
        name: "search-query",
        query: {
          q: this.$route.query.q,
          sp: param,
        },
      });
    },
    handleScroll() {
      let bottomOfWindow =
        Math.max(
          window.pageYOffset,
          document.documentElement.scrollTop,
          document.body.scrollTop
        ) +
          window.innerHeight ===
        document.documentElement.offsetHeight;
      if (bottomOfWindow && this.fetched) {
        setTimeout(this.loadMore(this.continuation), 1000);
      }
    },
    loadMore(continuation) {
      if (continuation.token) {
        this.continuation = continuation;
        this.$fetch();
      }
    },
  },
};
</script>