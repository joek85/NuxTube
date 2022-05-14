<template>
  <v-container>
    <v-row>
      <v-col sm="12" md="4">
        <v-card flat>
          <v-img class="" aspect-ratio="1.7" :src="results.sidebar.thumbnails.url">
            <template v-slot:placeholder>
              <v-row class="fill-height">
                <v-col cols="12">
                  <v-skeleton-loader type="image"></v-skeleton-loader>
                </v-col>
              </v-row>
            </template>
          </v-img>
          <v-card-title style="position: relative" class="pb-0">
            <v-fab-transition>
              <v-btn
                color="primary"
                dark
                absolute
                top
                right
                fab
                @click="play()"
              >
                <v-icon large>mdi-play</v-icon>
              </v-btn>
            </v-fab-transition>
          </v-card-title>
          <v-card-title>
            {{ results.sidebar.title }}
          </v-card-title>
          <v-card-subtitle>
            {{ results.sidebar.videoCounts }} -
            {{ formatViews(results.sidebar.views) }} - {{ results.sidebar.published }}
          </v-card-subtitle>
        </v-card>
      </v-col>
      <v-col md="8">
        <v-card flat>
          <v-list three-line>
            <template v-for="(item, index) in results.videos">
              <v-list-item
                :key="index + 1"
                :to="{
                  name: 'player',
                  query: {
                    id: item.videoId,
                    playlistId: $route.params.id,
                    index: index,
                  },
                }"
              >
                <v-list-item-icon>
                  <v-img width="160" height="80" :src="item.thumbnails.url">
                    <template v-slot:placeholder>
                      <v-row class="fill-height">
                        <v-col cols="12">
                          <v-skeleton-loader type="image"></v-skeleton-loader>
                        </v-col>
                      </v-row>
                    </template>
                  </v-img>
                </v-list-item-icon>
                <v-list-item-content class="pa-0">
                  <v-list-item-title v-html="item.title"></v-list-item-title>
                  <v-list-item-subtitle
                    v-html="item.subtitle"
                  ></v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-list-item-action-text
                    v-text="item.duration"
                  ></v-list-item-action-text>
                </v-list-item-action>
              </v-list-item>
              <v-divider :key="index + 1"></v-divider>
            </template>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import utils from "../../utils/utils";
import MediaCard from "../../components/Cards/MediaCardRelated.vue";
export default {
  components: {
    MediaCard,
  },
  data() {
    return {};
  },
  head() {
    return {
      title: this.results.sidebar.title,
    };
  },
  async asyncData({ params, $axios, store }) {
    const results = await $axios.$get("/api/playlist", {
      params: {
        playlistId: params.id,
      },
    });
    // store.commit("setPlayerPlaylist", {
    //   title: results.title,
    //   estimatedItemCount: results.estimatedItemCount,
    //   views: results.views,
    //   lastUpdated: results.lastUpdated,
    //   items: results.items,
    // });
    return { results };
  },
  methods: {
    formatViews(viewCount) {
      return utils.formatNumbers(viewCount);
    },
    play() {
      this.$router.push({
        name: "player",
        query: {
          id: this.results.videos[0].videoId,
          playlistId: this.$route.params.id,
          index: 0
        },
      });
    },
  },
  computed: {},
};
</script>
