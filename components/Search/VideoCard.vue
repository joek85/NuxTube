<template>
  <v-card flat class="pa-2 grow">
    <v-row>
      <v-col cols="12" sm="3" md="4">
        <NuxtLink
          class="subheading"
          :to="{ name: 'player', query: { id: data.videoId } }"
        >
          <v-img aspect-ratio="1.7" :src="data.thumbnail.url">
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
      <v-col
        cols="12"
        sm="9"
        md="8"
        class="d-flex flex-column justify-space-between d-sm-inline"
      >
        <v-card-title class="pa-0">{{ data.title }}</v-card-title>
        <v-card-title class="pa-0 subtitle-2 grey--text"
          >{{ data.views }} - {{ data.published }} -
          {{ data.duration }}</v-card-title
        >
        <v-card-title class="pa-0">
          <NuxtLink
            class="nuxt-link-exact-active"
            :to="{ name: 'channel-id', params: { id: data.author.channelId } }"
          >
            <v-avatar size="36">
              <img :src="data.author.thumbnail.url" />
            </v-avatar>
          </NuxtLink>
          <v-card-title class="subtitle-2 grey--text">{{
            data.author.name
          }}</v-card-title>
        </v-card-title>
        <v-card-title class="pa-0 subtitle-2 grey--text">{{
          data.description
        }}</v-card-title>
        <v-chip
          v-if="data.badges === 'LIVE NOW'"
          small
          color="primary"
          class="mt-2"
          outlined
          >{{ data.badges }}</v-chip
        >
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  props: {
    data: "",
  },
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
