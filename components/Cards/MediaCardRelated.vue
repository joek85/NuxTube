<template>
  <v-card class="pa-2">
    <v-row>
      <v-col cols="12" xl="4">
        <NuxtLink :to="{ name: 'player', query: { id: videoId } }">
          <v-img class="" aspect-ratio="1.7" :src="thumbnail.url.split('?')[0]">
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
      <v-col
        cols="12"
        xl="8"
        class="d-flex flex-column justify-space-between d-sm-inline"
      >
        <v-card-title class="pa-0 subtitle-1">
          <v-row>
            <v-col cols="10">
              <NuxtLink :to="{ name: 'player', query: { id: videoId } }">{{
                title
              }}</NuxtLink>
            </v-col>
            <v-col cols="1">
              <v-menu bottom left>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn dark icon v-bind="attrs" v-on="on">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item v-for="(item, i) in items" :key="i" link>
                    <v-icon small class="pa-2 pl-0">{{ item.icon }}</v-icon>
                    <v-list-item-title> {{ item.title }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-title v-if="authorThumbnail" class="pa-0">
          <NuxtLink
            class="nuxt-link-exact-active"
            :to="{ name: 'channel-id', params: { id: channelId } }"
          >
            <v-avatar size="36">
              <img :src="authorThumbnail.url" />
            </v-avatar>
          </NuxtLink>
          <v-col cols="10">
            <v-toolbar-title class="pa-0 subtitle-2 grey--text">{{
              authorName
            }}</v-toolbar-title>
          </v-col>
        </v-card-title>
        <v-card-title v-if="!isLive" class="pa-0 subtitle-2 grey--text"
          >{{ playCounts }} - {{ published }} - {{ duration }}</v-card-title
        >
        <v-chip v-if="isLive === true" small color="red">LIVE</v-chip>
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
  },
  data() {
    return {
      items: [
        { title: "Download", icon: "mdi-cloud-download" },
        { title: "Add to favorite", icon: "mdi-star" },
        { title: "Hide", icon: "mdi-eye-off" },
        { title: "Block", icon: "mdi-cancel" },
      ],
    };
  },
  methods: {
    getPlayCounts(nb) {
      return utils.formatNumbers(nb);
    },
    convertTime(time) {
      return utils.convertTime(time);
    },
  },
};
</script>
