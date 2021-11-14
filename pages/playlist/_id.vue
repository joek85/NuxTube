<template>
  <v-container>
    <v-row>
      <v-col sm="12" md="4">
        <v-card>
          <v-img class="" aspect-ratio="1.7" :src="results.bestThumbnail.url">
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
            {{ results.title }}
          </v-card-title>
          <v-card-subtitle>
            {{ results.estimatedItemCount }} videos -
            {{ formatViews(results.views) }} views - {{ results.lastUpdated }}
          </v-card-subtitle>
        </v-card>
      </v-col>
      <v-col md="8">
        <v-card>
          <v-list three-line>
            <template v-for="(item, index) in results.items">
              <v-list-item
                :key="item.id"
                :to="{
                  name: 'player',
                  query: {
                    id: item.id,
                    playlistId: $route.params.id,
                    index: index,
                  },
                }"
              >
                <v-list-item-icon>
                  <v-img width="160" height="80" :src="item.bestThumbnail.url">
                    <template v-slot:placeholder>
                      <v-row class="fill-height">
                        <v-col cols="12">
                          <v-skeleton-loader type="image"></v-skeleton-loader>
                        </v-col>
                      </v-row>
                    </template>
                  </v-img>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-html="item.title"></v-list-item-title>
                  <v-list-item-subtitle
                    v-html="item.author.name"
                  ></v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-list-item-action-text
                    v-text="item.duration"
                  ></v-list-item-action-text>
                </v-list-item-action>
              </v-list-item>
              <v-divider :key="index"></v-divider>
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
      title: this.results.title,
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
          id: this.results.items[0].id,
          playlistId: this.$route.params.id,
        },
      });
    },
  },
  computed: {},
};
</script>
