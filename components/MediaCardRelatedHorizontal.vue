<template>
  <v-card class="rounded-card mb-1">
    <v-row >
      <v-col sm="12" xl="4">
        <NuxtLink :to="{name: 'player-id', params: {id: data.id}}">
          <v-img class="pa-0 ma-1"
            aspect-ratio="1.7"
            :src="data.thumbnail[0].url.split('?')[0]">
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
      <v-col sm="12" xl="8" class="pa-0">
        <v-card-title>
          <div class="d-flex justify-space-around">
            <NuxtLink  class="" :to="{name: 'player-id', params: {id: data.id}}"> {{ data.title }}</NuxtLink>
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
          </div>
        </v-card-title>
        <v-card-title class="pt-0">
          <NuxtLink class="nuxt-link-exact-active" :to="{name: 'channel-id', params: {id: data.channel_id } }">
            <v-avatar size="36">
              <img :src="data.author.thumbnails[0].url">
            </v-avatar>
          </NuxtLink>
          <h5 class="ml-2">
            {{ data.subtitle }}
          </h5>
        </v-card-title>
        <v-card-title class="pt-0">
          <v-chip v-if="data.duration" class="grey--text" outlined small color="accent">{{data.duration}}</v-chip>
          <v-chip v-if="data.isLive === true" small outlined color="red">LIVE</v-chip>
          <v-chip v-if="data.isLive !== true" class="grey--text" outlined small color="accent">
            <v-icon>mdi-play</v-icon>
            <span>{{data.playcounts}}</span>
          </v-chip>
          <v-chip v-if="data.published" class="grey--text" outlined small color="accent">{{data.published}}</v-chip>
        </v-card-title>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
  import utils from '../utils/utils'
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
