<template>
  <v-expansion-panels class="mb-2" v-model="panel" flat>
    <v-expansion-panel>
      <v-expansion-panel-header class="text-uppercase font-weight-bold">
        Mix
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-col cols="12">
          <div class="text-center" v-if="$fetchState.pending">
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
          </div>
        </v-col>

        <div class="d-flex justify-space-between" v-if="!$fetchState.pending">
          <div>
            <v-card-title>
              {{ results.title }}
            </v-card-title>
            <v-card-subtitle>
              {{ results.author }}
            </v-card-subtitle>
          </div>
          <div class="d-flex align-end pa-0">
            <v-btn icon>
              <v-icon>mdi-playlist-plus</v-icon>
            </v-btn>
          </div>
        </div>
        <v-list max-height="400" style="overflow-y: auto">
          <v-list-item-group v-model="selected">
            <template v-for="(item, index) in results.videos">
              <v-list-item
                class=""
                :key="item.videoId"
                @click="itemClick(item.videoId, index)"
              >
                <v-list-item-icon v-if="$vuetify.breakpoint.xlOnly">
                  <v-img width="96" height="56" :src="item.thumbnail.url">
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
                    v-html="item.author"
                  ></v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-list-item-action-text
                    v-text="index + 1"
                  ></v-list-item-action-text>
                  <v-list-item-action-text
                    v-text="item.duration"
                  ></v-list-item-action-text>
                </v-list-item-action>
              </v-list-item>
              <v-divider :key="index"></v-divider>
            </template>
          </v-list-item-group>
        </v-list>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
export default {
  props: { listId: "", index: 0 },
  data() {
    return {
      results: [],
      selected: 0,
      panel: 0,
    };
  },
  fetchOnServer: false,
  watch: {
    index(val) {
      this.selected = val;
      this.$store.commit("setMixIndex", val);
    },
  },
  mounted() {
    this.selected = Number(this.index ? this.index : -1);
    this.$store.commit("setMixIndex", this.index ? this.index : -1);
    this.$root.$on("SkipMix", (index) => {
      this.$router.push({
        name: "player",
        query: {
          id: this.results.videos[index].videoId,
          list: this.listId,
          index: index,
        },
      });
    });
  },
  async fetch() {
    this.results = await this.$axios.$get("/api/player/mix", {
      params: {
        listId: this.listId,
      },
    });
    this.$store.commit("setMixInfo", {
      listId: this.listId,
      MixLength: this.results.videos.length,
    });
  },
  methods: {
    itemClick(id, index) {
      this.$router.push({
        name: "player",
        query: {
          id: id,
          list: this.listId,
          index: index,
        },
      });
    },
  },
};
</script>

<style>
</style>