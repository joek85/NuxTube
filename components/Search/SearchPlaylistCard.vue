<template>
  <v-card class="pa-2">
    <v-row>
      <v-col cols="12" xl="4">
        <NuxtLink :to="{ name: 'playlist-id', params: { id: playlistId } }">
          <v-img v-if="thumbnail" :src="thumbnail.url" aspect-ratio="1.7">
            <template v-slot:placeholder>
              <v-row class="fill-height pa-0">
                <v-col cols="12">
                  <v-skeleton-loader type="image"></v-skeleton-loader>
                </v-col>
              </v-row>
            </template>
          </v-img>
        </NuxtLink>
      </v-col>
      <v-col cols="12" xl="8">
        <v-card-title class="pa-1">{{ title }}</v-card-title>
        <v-card-title class="subtitle-1 pa-1">
          <NuxtLink
                  class="nuxt-link-exact-active"
                  :to="{
                    name: 'channel-id',
                    params: { id: channelId},
                  }"
                >
                  {{ subtitle}}
                </NuxtLink>
        </v-card-title>
        <v-list max-height="400" style="overflow-y: auto">
          <v-list-item-group>
            <template v-for="(item, index) in videos">
              <v-list-item
                :to="{
                  name: 'player',
                  query: {
                    id: item.videoId,
                  },
                }"
                :key="index"
              >
                <v-list-item-content>
                  <v-list-item-title v-html="item.title"></v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                  <v-list-item-action-text
                    v-text="item.duration"
                  ></v-list-item-action-text>
                </v-list-item-action>
              </v-list-item>
              <v-divider :key="index"></v-divider>
            </template>
          </v-list-item-group>
        </v-list>
        <v-card-actions class="">
          <v-chip v-if="videoCounts" class="grey--text" outlined
            >{{ videoCounts }} videos</v-chip
          >
        </v-card-actions>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import utils from "../../utils/utils";

export default {
  props: {
    playlistId: "",
    thumbnail: "",
    title: "",
    subtitle: "",
    published: "",
    videoCounts: 0,
    videos: [],
    channelId: "",
  },
  methods: {
    convertTime(time) {
      return utils.convertTime(time);
    },
  },
  mounted() {},
};
</script>
