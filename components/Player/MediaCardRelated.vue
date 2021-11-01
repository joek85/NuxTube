<template>
  <v-card class="rounded-card ">
    <NuxtLink class="subheading " :to="{name: 'player-id', params: {id: data.id}}">
      <v-img :src="data.thumbnail[0].url.split('?')[0]" aspect-ratio="1.7">
        <template v-slot:placeholder>
          <v-row class="fill-height pa-0">
            <v-col cols="12">
              <v-skeleton-loader type="image"></v-skeleton-loader>
            </v-col>
          </v-row>
        </template>
      </v-img>
    </NuxtLink>
    <h3 class="pa-1 d-flex justify-space-between">
      {{ data.title }}
      <v-menu bottom left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn dark icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="(item, i) in items" :key="i" link>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </h3>
    <v-card-title class="ma-0">
      <NuxtLink class="nuxt-link-exact-active pa-0" :to="{name: 'channel-id', params: {id: data.channel_id } }">
        <v-avatar size="24">
          <img :src="data.author.thumbnails[0].url">
        </v-avatar>
      </NuxtLink>
      <v-card-subtitle class="pa-1 grey--text">
        {{ data.subtitle }}
      </v-card-subtitle>
    </v-card-title>
    <v-card-title class="pa-2 d-flex">
        <v-chip v-if="data.duration" class="grey--text ma-1" small outlined color="accent">{{data.duration}}</v-chip>
        <v-chip v-if="data.isLive == true" small outlined color="red" class="ma-1">LIVE</v-chip>
        <v-chip class="grey--text ma-1" small outlined color="accent">
          <v-icon>mdi-play</v-icon>
          <span>{{data.playcounts}}</span>
        </v-chip>
        <v-chip v-if="data.published" class="grey--text ma-1" small outlined color="accent">{{data.published}}</v-chip>
      </v-card-title>

  </v-card>
</template>

<script>
  import utils from '../../utils/utils'
  export default {
    props: {
      data: {}
    },
    data () {
      return {
        items: [
          { title: 'Click Me' },
          { title: 'Click Me' },
          { title: 'Click Me' },
          { title: 'Click Me 2' },
        ],
      }
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
