<template>
  <v-card class="pa-2" flat rounded="lg">
    <v-row>
      <v-col cols="12" :xl="getImageSize(this.sizeMode)">
        <NuxtLink :to="{ name: 'player', query: { id: videoId } }">
          <v-img
            class=""
            aspect-ratio="1.7"
            :src="thumbnail.url.split('?')[0]"
            style="border-radius: 5%"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height">
                <v-col cols="12">
                  <v-skeleton-loader type="image"></v-skeleton-loader>
                </v-col>
              </v-row>
            </template>
          </v-img>
        </NuxtLink>
      </v-col>
      <v-col cols="12" :xl="getColSize(this.sizeMode)">
        <v-card class="d-flex" flat tile>
          <v-card-title class="pa-0 subtitle-1" v-snip="{ lines: 2 }">{{
            title
          }}</v-card-title>
          <v-card class="ml-auto transparent pa-0" flat tile>
            <v-menu v-if="hasMenu === true" bottom left rounded="lg">
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(item, i) in items"
                  :key="i"
                  link
                  @click.prevent="menuClick(item.title)"
                >
                  <v-icon small class="pa-2 pl-0">{{ item.icon }}</v-icon>
                  <v-list-item-title> {{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-card>
        </v-card>
        <v-list-item two-line class="pa-0">
          <v-list-item-avatar v-if="authorThumbnail" class="mr-1">
            <NuxtLink
              class="nuxt-link-exact-active"
              :to="{ name: 'channel-id', params: { id: channelId } }"
            >
              <v-avatar size="36">
                <img :src="authorThumbnail.url" />
              </v-avatar>
            </NuxtLink>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ authorName }}</v-list-item-title>
            <v-list-item-subtitle v-if="playCounts"
              >{{ playCounts + " - " + published + " - " + duration }}
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-chip v-if="isLive === true" dark small color="red">LIVE</v-chip>
          </v-list-item-action>
        </v-list-item>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import utils from "../../utils/utils";
export default {
  props: {
    videoId: "",
    thumbnail: "",
    title: "",
    channelId: "",
    authorThumbnail: "",
    authorName: "",
    playCounts: 0,
    published: "",
    duration: 0,
    isLive: false,
    hasMenu: false,
    isHistory: false,
    sizeMode: { default: "normal" },
  },
  data() {
    return {
      items:
        this.isHistory == true
          ? [{ title: "Remove", icon: "mdi-trash-can" }]
          : [
              { title: "Download", icon: "mdi-cloud-download" },
              { title: "Add to favourite", icon: "mdi-star" },
              { title: "Hide", icon: "mdi-eye-off" },
              { title: "Block Video", icon: "mdi-cancel" },
              { title: "Block Channel", icon: "mdi-cancel" },
            ],
    };
  },
  watch: {},
  methods: {
    getPlayCounts(nb) {
      return utils.formatNumbers(nb);
    },
    convertTime(time) {
      return utils.convertTime(time);
    },
    menuClick(title) {
      switch (title) {
        case "Download":
          this.$root.$emit("Dialog", { id: this.videoId, type: "download" });
          break;
        case "Hide":
          this.$root.$emit("hideVideo", this.videoId);
          break;
        case "Block Video":
          this.$root.$emit("blockVideo", this.videoId);
          break;
        case "Block Channel":
          this.$root.$emit("blockChannel", this.channelId);
          break;
        case "Remove":
          this.$root.$emit("histoy_remove", this.videoId);
          break;
      }
    },
    getImageSize(type) {
      switch (type) {
        case "normal":
          return 4;
        case "channel":
          return 12;
      }
    },
    getColSize(type) {
      switch (type) {
        case "normal":
          return 8;
        case "channel":
          return 12;
      }
    },
  },
  computed: {},
};
</script>
<style lang="scss">
.grow {
  transition: all 0.25s ease-in-out;
}
.grow:hover {
  transform: scale(1.05);
}
</style>
