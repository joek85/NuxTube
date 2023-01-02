<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="8" xl="8">
        <v-responsive :aspect-ratio="16 / 9">
          <v-card flat class="">
            <video-player :data="AudioPlayerData" :isVideo="isVideo"></video-player>
          </v-card>
          <v-card flat rounded="lg">
            <v-card-title class="text-h5 font-weight-bold">{{
              results.title
            }}</v-card-title>
            <v-card-subtitle class="pb-0">
              {{
                getPlayCounts(results.play_counts) +
                " - " +
                formatDate(results.published_at) +
                " - " +
                convertTime(results.duration)
              }}
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
                <v-list-item-subtitle v-if="results.owner.owner.subscriberCount"
                  >{{ results.owner.owner.subscriberCount }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-chip v-if="results.isLive" color="red" dark small
                  >LIVE</v-chip
                >

                <v-list-item-action-text>
                  <v-btn icon fab @click.stop="switchAudioVideo">
                    <v-icon color="primary">{{ isVideo == true ?  "mdi-volume-high" : "mdi-video-outline" }}</v-icon>
                  </v-btn>
                  <v-btn icon fab @click="openDownloadDialog()">
                    <v-icon color="primary">mdi-cloud-download-outline</v-icon>
                  </v-btn>
                  <!-- <v-btn icon fab @click="setToggleView()">
                    <v-icon color="primary">{{
                      ToggleView == 0 ? "mdi-view-grid" : "mdi-view-list"
                    }}</v-icon>
                  </v-btn> -->
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
          </v-card>
          <description-card :descriptions="results.description" />
        </v-responsive>
      </v-col>

      <v-col cols="12" md="3" xl="3">
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
        <related-card
          :id="results.id"
          :related="results.related"
        ></related-card>
      </v-col>
    </v-row>
  </v-container>
  <!-- <v-col cols="3">
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
            <related-card
              :id="results.id"
              :related="results.related"
            ></related-card>
          </v-col> -->
</template>
<script>
import utils from "../../utils/utils";
import RelatedCard from "../../components/Player/RelatedCard.vue";
import DescriptionCard from "../../components/Player/DescriptionCard.vue";
import PlaylistCard from "../../components/Player/PlaylistCard.vue";
import ChaptersCard from "../../components/Player/ChaptersCard.vue";
import MixCard from "../../components/Player/MixCard.vue";
import VideoPlayer from "../../components/VideoPlayer.vue";

import { mapGetters } from "vuex";
export default {
  components: {
    RelatedCard,
    DescriptionCard,
    PlaylistCard,
    ChaptersCard,
    MixCard,
    VideoPlayer,
    VideoPlayer,
  },
  computed: {
    ...mapGetters({
      AudioPlayerData: "getAudioPlayerData",
      VideoDialog: "getVideoDialog",
      ToggleView: "getToggle_view",
      PlayerPlaylist: "getPlayerPlaylist",
    }),
    geturl() {
      return "http://localhost:8080/" + this.results.formats[0].url;
    },
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
      isPlaylist: false,
      isMix: false,
      options: {},
      sources: {},
      player: null,
      isVideo: false
    };
  },
  head() {
    return {
      title: this.results.title,
    };
  },
  watch: {
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
    let results = await $axios.$get("/api/player", {
      params: {
        id: query.id,
        date: new Date().toISOString().substring(0, 10),
      },
    });
    store.commit("setAudioPlayerData", {
      title: results.title,
      subtitle: results.owner.owner.title,
      thumbnail: results.thumbnail,
      url: results.formats[0].url,
      isLive: results.isLive,
      id: query.id,
    });

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
    switchAudioVideo() {
      this.isVideo =! this.isVideo
    }
  },
};
</script>
<style >
.imgOverlay {
  overflow-y: unset;
}
</style>
