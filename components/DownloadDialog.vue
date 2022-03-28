<template>
  <v-card class="pa-2" flat>
    <v-row>
      <v-col cols="12" xl="4">
        <v-img
          class=""
          aspect-ratio="1.7"
          :src="
            infos.videoDetails.thumbnail.thumbnails[
              infos.videoDetails.thumbnail.thumbnails.length - 1
            ].url.split('?')[0]
          "
        >
          <template v-slot:placeholder>
            <v-row class="fill-height">
              <v-col cols="12">
                <v-skeleton-loader type="image"></v-skeleton-loader>
              </v-col>
            </v-row>
          </template>
        </v-img>
      </v-col>
      <v-col cols="12" xl="8">
        <v-card class="d-flex" flat tile>
          <v-card-title class="pa-0 subtitle-1">{{
            infos.videoDetails.title
          }}</v-card-title>
        </v-card>

        <v-card-title class="pa-0">
          <!-- <NuxtLink
            class="nuxt-link-exact-active"
            :to="{ name: 'channel-id', params: { id: channelId } }"
          >
            <v-avatar size="36">
              <img :src="authorThumbnail.url" />
            </v-avatar>
          </NuxtLink> -->
          <v-col cols="10">
            <v-toolbar-title class="pa-0 subtitle-2 grey--text">{{
              infos.videoDetails.author
            }}</v-toolbar-title>
          </v-col>
        </v-card-title>
        <!-- <v-card-title v-if="!isLive" class="pa-0 subtitle-2 grey--text"
          >{{ playCounts }} - {{ published }} - {{ duration }}</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-chip v-if="isLive === true" dark small color="red">LIVE</v-chip>
        </v-card-actions> -->
      </v-col>
      <v-col cols="12">
        <!-- <v-list-item-group>
          <v-list-item v-for="(item, i) in infos.formats" :key="i">
            <v-list-item-content>
              <v-list-item-title>{{ item.itag + ' '  + item.width }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group> -->
        <v-data-table
          :headers="tableHeaders"
          :items="infos.formats"
          :search="search"
        ></v-data-table>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  props: {
    infos: "",
  },
  data() {
    return {
      dialog: false,
      tableHeaders: [
        {
          text: "Itag",
          value: "itag",
        },
        {
          text: "Quality",
          value: "qualityLabel",
        },
        {
          text: "Width",
          value: "width",
        },
        {
          text: "Height",
          value: "height",
        },
        {
          text: "mimeType",
          value: "mimeType",
        },
        {
          text: "audioChannels",
          value: "audioChannels",
        },
        {
          text: "audioSampleRate",
          value: "audioSampleRate",
        },
      ],
      search: "",
    };
  },
  mounted() {},
};
</script>

<style>
</style>