<template>
  <v-container style="maxwidth: 1680px">
    <v-row>
      <v-col order="1" cols="12" md="8" sm="8" :xl="8">
        <v-card class="mb-4 pa-2" flat>
          <v-row>
            <v-col cols="12" :xl="ToggleView ? 12 : 3">
              <v-card flat>
                <v-img aspect-ratio="1.7" :src="results.thumbnail"> </v-img>
              </v-card>
            </v-col>
            <v-col
              cols="12"
              :xl="toggle_view ? 12 : 9"
              class="d-flex flex-column justify-space-between d-sm-inline pa-0"
            >
              <v-card-title class="text-h5 font-weight-bold">{{
                results.title
              }}</v-card-title>
              <v-card-subtitle class="pb-0">
                {{getPlayCounts(results.play_counts) + ' - ' +
                formatDate(results.published_at) + ' - ' +
                convertTime(results.duration)}}
              </v-card-subtitle>
              <v-list-item two-line class="">
                <v-list-item-avatar>
                  <NuxtLink
                    class="nuxt-link-exact-active"
                    :to="{
                      name: 'channel-id',
                      params: { id: results.channel_id },
                    }"
                  >
                    <v-avatar size="48">
                      <img :src="results.owner.owner.thumbnails.url" />
                    </v-avatar>
                  </NuxtLink>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title
                    ><NuxtLink
                      class="nuxt-link-exact-active"
                      :to="{
                        name: 'channel-id',
                        params: { id: results.channel_id },
                      }"
                    >
                      {{ results.owner.owner.title }}
                    </NuxtLink></v-list-item-title
                  >
                  <v-list-item-subtitle
                    v-if="results.owner.owner.subscriberCount"
                    >{{ results.owner.owner.subscriberCount }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-chip v-if="results.isLive" color="red" dark small
                    >LIVE</v-chip
                  >
                  
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
              <v-col cols="12" class="">
                <v-chip-group class="" active-class="primary--text" column>
                  <v-chip
                    outlined
                    color="primary"
                    v-for="tag in results.tags"
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
        <description-card :descriptions="results.description" />
      </v-col>
      <v-col order="2" cols="12" md="4" sm="4" :xl="4">
        <mix-card
          v-if="$route.query.list"
          :listId="$route.query.list"
          :index="$route.query.index"
        >
        </mix-card>
        <playlist-card
          v-if="$route.query.playlistId"
          :playlistId="$route.query.playlistId"
          :index="$route.query.index"
        ></playlist-card>
        <chapters-card
          v-if="results.chapters.length"
          :chapters="results.chapters"
        ></chapters-card>
        <related-card :id="results.id" :related="results.related"></related-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import utils from "../../utils/utils";
import RelatedCard from "../../components/Player/RelatedCard.vue";
import DescriptionCard from "../../components/Player/DescriptionCard.vue";
import PlaylistCard from "../../components/Player/PlaylistCard.vue";
import ChaptersCard from "../../components/Player/ChaptersCard.vue";
import MixCard from "../../components/Player/MixCard.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    RelatedCard,
    DescriptionCard,
    PlaylistCard,
    ChaptersCard,
    MixCard,
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
    if (this.$route.query.list) {
      this.$store.commit("setIsMix", true);
    } else {
      this.$store.commit("setIsMix", false);
    }
  },
  data() {
    return {
      overlay: false,
      toggle_view: 0,
      isPlaylist: false,
      isMix: false,
    };
  },
  head() {
    return {
      title: this.results.title,
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
      if (query.list) {
        this.$store.commit("setIsMix", true);
      } else {
        this.$store.commit("setIsMix", false);
      }
    },
  },
  async asyncData({ query, $axios, store }) {
    // if (query.playlistId) {
    //   store.commit("setIsPlaylist", true);
    // }
    let results = await $axios.$get("/api/player", {
      params: {
        id: query.id,
        date: new Date().toISOString().substring(0, 10),
      },
    });
    // console.log(results.formats)
    store.commit("setAudioPlayerData", {
      title: results.title,
      subtitle: results.owner.owner.title,
      thumbnail: results.thumbnail,
      url: results.formats[0].url,
      id: query.id,
    });
    if (!store.getters.getVideoDialog) {
      store.commit("showBottomSheet", true);
    }
    //console.log(results.related)
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
      this.$root.$emit("Dialog", {
        id: this.$route.query.id,
        type: "download",
      });
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
