<template>
  <!-- <v-card class="pa-2" flat rounded="lg">
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
  </v-card> -->

  <v-card class="pa-1 pb-0 transparent" flat>
    <v-row no-gutters class="pa-2 pb-0">
      <v-col cols="5" sm="3" md="5" lg="5">
        <NuxtLink :to="{ name: 'player', query: { id: videoId } }">
          <v-img
            class=""
            :aspect-ratio="16 / 9"
            :src="thumbnail.url.split('?')[0]"
            style="border-radius: 5%"
          >
            <v-overlay
              class="justify-end align-end pa-1 pb-0"
              absolute
              color="transparent"
            >
              <v-chip
                v-if="!isLive"
                class="font-weight-bold pa-1"
                label
                small
                dark
                color="black"
                >{{ duration }}</v-chip
              >
            </v-overlay>
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
      <v-col>
        <v-col class="d-flex pa-0 ma-0">
          <v-card-title
            class="pl-2 pa-0 subtitle-2 font-weight-bold ma-0 two-lines"
          >
            {{ title }}
          </v-card-title>
          <v-card class="ml-auto pa-0 transparent" flat tile>
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
        </v-col>
        <v-col class="pa-0 ma-0">
          <v-card-subtitle class="pl-2 pt-2 pb-0 two-lines">
            {{ authorName }}
          </v-card-subtitle>
          <v-card-subtitle class="pa-1 pl-2">
            <v-row no-gutters>
              {{ playCounts }}
              <v-card-subtitle v-if="!isLive" class="pa-0 pl-1 pr-1">{{
                "  \u2022"
              }}</v-card-subtitle>

              {{ published }}
            </v-row>
          </v-card-subtitle>
          <v-card-subtitle class="pa-1 pl-2">
            <v-chip
              v-if="isLive"
              class="font-weight-bold pa-1"
              label
              small
              dark
              color="red"
            >
              <v-icon small class="pa-1">mdi-antenna</v-icon>
              LIVE
            </v-chip>
          </v-card-subtitle>
        </v-col>
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
              { title: "Go to channel", icon: "mdi-checkbox-intermediate" },
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
        case "Go to channel":
          this.$router.push({
            name: "channel-id",
            params: { id: this.channelId },
          });
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
    getColors(live) {
      if (live == true) {
        return "red";
      } else {
        return "black";
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
.two-lines {
  line-height: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  max-height: 3rem;
}
</style>
