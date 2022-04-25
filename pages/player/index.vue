<template>
  <v-container>
    <v-row>
      <v-col order="1" cols="12" md="8" sm="8">
        <v-card class="mb-4 pa-2" flat>
          <v-row>
            <v-col cols="12" :xl="ToggleView ? 12 : 3">
              <!-- <v-hover>
                <template v-slot:default="{ hover }">
                  <v-card flat>
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
                        <v-btn
                          icon
                          fab
                          dark
                          color="primary"
                          x-large
                          @click="openDownloadDialog()"
                        >
                          <v-icon x-large color="white"
                            >mdi-cloud-download-outline</v-icon
                          >
                        </v-btn>
                      </v-overlay>
                    </v-fade-transition>
                  </v-card>
                </template>
              </v-hover> -->
              <v-card flat>
                <v-img
                  aspect-ratio="1.7"
                  :src="results[0].thumbnail.url.split('?')[0]"
                >
                </v-img>
              </v-card>
            </v-col>
            <v-col
              cols="12"
              :xl="toggle_view ? 12 : 9"
              class="d-flex flex-column justify-space-between d-sm-inline"
            >
              <v-card-title class="text-h5 font-weight-bold pa-0">{{
                results[0].title
              }}</v-card-title>

              <v-list-item two-line class="pa-0">
                <v-list-item-avatar>
                  <NuxtLink
                    class="nuxt-link-exact-active"
                    :to="{
                      name: 'channel-id',
                      params: { id: results[0].channel_id },
                    }"
                  >
                    <v-avatar size="48">
                      <img :src="results[0].authorThumbnail" />
                    </v-avatar>
                  </NuxtLink>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title
                    ><NuxtLink
                      class="nuxt-link-exact-active"
                      :to="{
                        name: 'channel-id',
                        params: { id: results[0].channel_id },
                      }"
                    >
                      {{ results[0].author }}
                    </NuxtLink></v-list-item-title
                  >
                  <v-list-item-subtitle v-if="results[0].subscribers"
                    >{{
                      formatNumbers(results[0].subscribers)
                    }}
                    Subscribers</v-list-item-subtitle
                  >
                </v-list-item-content>
                <v-list-item-action>
                  <v-list-item-action-text
                    class="subtitle-2"
                    v-text="
                      getPlayCounts(results[0].play_counts) +
                      ' - ' +
                      formatDate(results[0].published_at) +
                      ' - ' +
                      convertTime(results[0].duration)
                    "
                  ></v-list-item-action-text>

                  <v-chip v-if="results[0].isLive" color="red" dark small
                    >LIVE</v-chip
                  >
                </v-list-item-action>
              </v-list-item>
              <v-list-item class="pa-0">
                <v-spacer></v-spacer>
                <v-list-item-action class="ma-0">
                  <v-list-item-action-text>
                    <v-btn icon fab @click.stop="showVideoDialog">
                      <v-icon color="primary">mdi-video-outline</v-icon>
                    </v-btn>
                    <v-btn icon fab @click="openDownloadDialog()">
                      <v-icon color="primary"
                        >mdi-cloud-download-outline</v-icon
                      >
                    </v-btn>
                    <v-btn icon fab @click="setToggleView()">
                      <v-icon color="primary">{{
                        ToggleView == 0 ? "mdi-view-grid" : "mdi-view-list"
                      }}</v-icon>
                    </v-btn>
                  </v-list-item-action-text>
                </v-list-item-action>
              </v-list-item>
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
        <chapters-card
          v-if="results[0].chapters.length"
          :chapters="results[0].chapters"
          :thumbnail="results[0].thumbnail.url"
        ></chapters-card>
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
import ChaptersCard from "../../components/Cards/ChaptersCard.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    RelatedCard,
    DescriptionCard,
    PlaylistCard,
    ChaptersCard,
  },
  computed: {
    ...mapGetters({
      AudioPlayerData: "getAudioPlayerData",
      VideoDialog: "getVideoDialog",
      ToggleView: "getToggle_view",
      PlayerPlaylist: "getPlayerPlaylist",
    }),
  },
  watchQuery: true,
  mounted() {
    if (this.$route.query.playlistId) {
      this.$store.commit("setIsPlaylist", true);
    } else {
      this.$store.commit("setIsPlaylist", false);
    }
  },
  data() {
    return {
      overlay: false,
      toggle_view: 0,
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
    formatNumbers(nb) {
      return utils.formatNumbers(nb);
    },
    showVideoDialog() {
      this.$store.commit("showVideoDialog", true);
      this.$store.commit("showBottomSheet", false);
    },
    openDownloadDialog() {
      this.$root.$emit("Dialog", { id: this.$route.query.id, type: 'download'});
    },
    setToggleView() {
      this.toggle_view = !this.toggle_view;
      this.$store.commit("setToggle_view", this.toggle_view);
    },
  },
};
</script>
<style scoped>
.imgOverlay {
  overflow-y: unset;
}
</style>
