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
        <v-card-title class="grey--text pa-2">{{ title }}</v-card-title>
        <v-card-title class="subtitle-1 grey--text pa-1">{{
          subtitle
        }}</v-card-title>
        <v-card-title class="subtitle-1 grey--text pa-1">{{
          published
        }}</v-card-title>
        <v-card-title class="pa-2">
          <v-chip v-if="videoCounts" class="grey--text" outlined small
            >{{ videoCounts }} videos</v-chip
          >
        </v-card-title>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  props: {
    playlistId: "",
    thumbnail: "",
    title: "",
    subtitle: "",
    published: "",
    videoCounts: 0,
  },
  methods: {},
  mounted() {},
};
</script>
