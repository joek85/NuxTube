<template>
  <v-container>
    <v-toolbar dense class="transparent mb-2" flat>
      <v-row align="end" justify="end">
        <v-btn-toggle
          v-model="toggle_exclusive"
          mandatory
          dense
          group
          color="primary"
        >
          <v-btn>
            <v-icon>mdi-view-list</v-icon>
          </v-btn>
          <v-btn>
            <v-icon>mdi-view-grid</v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-row>
    </v-toolbar>
    <v-row>
      <v-col order="1" cols="12" md="8" sm="8">
        <v-card class="mb-4 pa-2">
          <v-row>
            <v-col cols="12" :xl="toggle_view ? 12 : 3">
              <v-hover>
                <template v-slot:default="{ hover }">
                  <v-card class="mx-auto">
                    <v-img
                      aspect-ratio="1.7"
                      :src="results[0].thumbnail.url.split('?')[0]"
                    >
                    </v-img>
                    <v-fade-transition>
                      <v-overlay
                        class="imgOverlay"
                        absolute
                        v-if="hover"
                        color="#121212"
                      >
                        <v-btn
                          @click.stop="showVideoDialog"
                          icon
                          fab
                          dark
                          color="primary"
                          x-large
                        >
                          <v-icon x-large color="white"
                            >mdi-video-outline</v-icon
                          >
                        </v-btn>
                        <v-btn icon fab dark color="primary" x-large>
                          <v-icon x-large color="white"
                            >mdi-cloud-download-outline</v-icon
                          >
                        </v-btn>
                      </v-overlay>
                    </v-fade-transition>
                  </v-card>
                </template>
              </v-hover>
            </v-col>
            <v-col
              cols="12"
              :xl="toggle_view ? 12 : 9"
              class="d-flex flex-column justify-space-between d-sm-inline"
            >
              <v-card-title class="text-h4 font-weight-bold pa-0">{{
                results[0].title
              }}</v-card-title>
              <v-card-title class="pa-1 mt-1">
                <NuxtLink
                  class="nuxt-link-exact-active"
                  :to="{
                    name: 'channel-id',
                    params: { id: results[0].channel_id },
                  }"
                >
                  <v-avatar size="36">
                    <img :src="results[0].authorThumbnail" />
                  </v-avatar>
                </NuxtLink>
                <NuxtLink
                  class="nuxt-link-exact-active pl-2"
                  :to="{
                    name: 'channel-id',
                    params: { id: results[0].channel_id },
                  }"
                >
                  {{ results[0].author }}
                </NuxtLink>
              </v-card-title>
              <v-card-title
                v-if="!results[0].isLive"
                class="pa-0 mt-1 subtitle-2 grey--text"
                >{{ getPlayCounts(results[0].play_counts) }} -
                {{ formatDate(results[0].published_at) }} -
                {{ convertTime(results[0].duration) }}</v-card-title
              >
              <v-chip v-if="results[0].isLive" color="red" small>LIVE</v-chip>
              <v-col cols="12" class="pa-0">
                <v-chip-group class="pa-0" active-class="primary--text" column>
                  <v-chip
                    outlined
                    color="primary"
                    v-for="tag in results[0].tags"
                    :key="tag"
                    :to="{ name: 'search-query', query: { q: tag } }"
                  >
                    {{ tag }}
                  </v-chip>
                </v-chip-group>
              </v-col>
            </v-col>
          </v-row>
        </v-card>
        <description-card :descriptions="results[0].description" />
      </v-col>
      <v-col order="2" cols="12" md="4" sm="4">
        <playlist-card
          v-if="$route.query.playlistId"
          :playlistId="$route.query.playlistId"
          :index="$route.query.index"
        ></playlist-card>
        <related-card :id="results[0].id"></related-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import utils from "../../utils/utils";
import RelatedCard from "../../components/Player/RelatedCard.vue";
import DescriptionCard from "../../components/Player/DescriptionCard.vue";
import PlaylistCard from "../../components/Player/PlaylistCard.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    RelatedCard,
    DescriptionCard,
    PlaylistCard,
  },
  computed: {
    ...mapGetters({
      AudioPlayerData: "getAudioPlayerData",
      VideoDialog: "getVideoDialog",
      toggle_view: "getToggle_view",
      PlayerPlaylist: "getPlayerPlaylist",
    }),
  },
  watchQuery: true,
  mounted() {},
  data() {
    return {
      overlay: false,
      toggle_exclusive: 0,
      isPlaylist: false,
    };
  },
  head() {
    return {
      title: this.results[0].title,
    };
  },
  watch: {
    VideoDialog(val) {
      if (!val) {
        this.$store.commit("showBottomSheet", true);
      }
    },
    toggle_exclusive(val) {
      this.$store.commit("setToggle_view", val);
    },
    "$route.query"(query) {
      if (query.playlistId) {
        this.$store.commit("setIsPlaylist", true);
      } else {
        this.$store.commit("setIsPlaylist", false);
      }
    },
  },
  async asyncData({ query, $axios, store }) {
    if (query.playlistId) {
      store.commit("setIsPlaylist", true);
    }
    let results = await $axios.$get("/api/player", {
      params: {
        id: query.id,
        date: new Date().toISOString().substring(0, 10),
      },
    });
    store.commit("setAudioPlayerData", {
      title: results[0].title,
      subtitle: results[0].author,
      thumbnail: results[0].thumbnail.url,
      url: results[0].formats.url,
      id: query.id,
    });
    if (!store.getters.getVideoDialog) {
      store.commit("showBottomSheet", true);
    }
    return { results };
  },
  methods: {
    getPlayCounts(nb) {
      return utils.formatNumbers(nb);
    },
    convertTime(time) {
      return utils.convertTime(time);
    },
    formatDate(date) {
      return utils.formatDate(date);
    },
    showVideoDialog() {
      this.$store.commit("showVideoDialog", true);
      this.$store.commit("showBottomSheet", false);
    },
  },
};
</script>
<style scoped>
.imgOverlay {
  overflow-y: unset;
}
</style>
