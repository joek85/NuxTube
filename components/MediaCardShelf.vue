<template>
  <v-card class="rounded-card" max-width="240">
    <NuxtLink class="subheading" :to="{name: 'player-id', params: {id: data.id}}">
      <v-img :src="data.bestThumbnail.url" aspect-ratio="1.7" height="120px">
        <template v-slot:placeholder>
          <v-row class="fill-height pa-0">
            <v-col cols="12">
              <v-skeleton-loader type="image"></v-skeleton-loader>
            </v-col>
          </v-row>
        </template>
      </v-img>
    </NuxtLink>
    <v-toolbar-title class="ml-1">
      {{ data.title }}
    </v-toolbar-title>
    <v-card-title class="">
      <NuxtLink class="nuxt-link-exact-active pa-0" :to="{name: 'channel-id', params: {id: data.author.channelID } }">
        <v-avatar size="36">
          <img :src="data.author.bestAvatar.url">
        </v-avatar>
      </NuxtLink>
      <v-toolbar-title class="ml-2">
        {{ data.author.name }}
      </v-toolbar-title>
    </v-card-title>
    <v-card-title class="pa-1 d-flex justify-space-around">
      <v-chip v-if="data.duration" class="grey--text" small color="accent">{{data.duration}}</v-chip>
      <v-chip v-if="data.isLive == true" small outlined color="red">LIVE</v-chip>
      <v-chip class="grey--text" small color="accent">
        <v-icon>mdi-play</v-icon>
        <span>{{getPlayCounts(data.views)}}</span>
      </v-chip>
      <v-chip v-if="data.uploadedAt" class="grey--text" small color="accent">{{data.uploadedAt}}</v-chip>
    </v-card-title>
  </v-card>
</template>

<script>
  import utils from '../utils/utils'
  export default {
    props: {
      data: {}
    },
    methods: {
      getPlayCounts (nb) {
        return utils.formatNumbers(nb)
      },
      convertTime (time) {
        return utils.convertTime(time)
      }
    }
  }
</script>
