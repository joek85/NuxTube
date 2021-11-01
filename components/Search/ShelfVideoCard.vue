<template>
  <v-card class="pa-2" width="220">
    <v-row>
      <v-col cols="12">
        <NuxtLink class="subheading " :to="{name: 'player-id', params: {id: data.videoId}}">
          <v-img
            aspect-ratio="1.7"
            :src="data.thumbnail.url">
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
      <v-col cols="12" class="d-flex flex-column justify-space-between">
        <v-card-text class="pa-0 text-truncate">{{data.title}}</v-card-text>
        <v-card-title class="pa-0 subtitle-2 grey--text">{{data.views}} - {{data.published}} - {{data.duration}}</v-card-title>
        <v-card-title class="pa-0">
          <NuxtLink class="nuxt-link-exact-active" :to="{name: 'channel-id', params: {id: data.author.channelId } }">
            <v-avatar size="36">
              <img :src="data.author.thumbnail.url">
            </v-avatar>
          </NuxtLink>
          <v-card-title class=" subtitle-2 grey--text">{{ data.author.name }}</v-card-title>
        </v-card-title>
      </v-col>
    </v-row>
  </v-card>

</template>

<script>
    export default {
      props: {
        data: ''
      }
    }
</script>

<style scoped>

</style>
