<template>
  <v-card class="rounded-card pa-2">
    <v-row >
      <v-col sm="12" xl="4">
        <NuxtLink :to="{name: 'player-id', params: {id: data.id}}">
          <v-img class=""
            aspect-ratio="1.7"
            :src="data.thumbnail.url.split('?')[0]">
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
      <v-col sm="12" xl="8" class="d-flex flex-column justify-space-between d-sm-inline">
        <v-card-title class="pa-0 subtitle-1">
          <v-row>
            <v-col sm="10">
              <NuxtLink  class="" :to="{name: 'player-id', params: {id: data.id}}">{{data.title}}</NuxtLink>
            </v-col>
            <v-col sm="1">
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
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-title class="pa-0">
          <NuxtLink class="nuxt-link-exact-active" :to="{name: 'channel-id', params: {id: data.channel_id } }">
            <v-avatar size="36">
              <img :src="data.author.thumbnails.url">
            </v-avatar>
          </NuxtLink>
          <v-card-title class=" subtitle-2 grey--text">{{ data.subtitle }}</v-card-title>
        </v-card-title>
        <v-card-title v-if="!data.isLive" class="pa-0 subtitle-2 grey--text">{{data.playcounts}} - {{data.published}} - {{data.duration}}</v-card-title>
          <v-chip v-if="data.isLive === true" small color="red">LIVE</v-chip>
      </v-col>
    </v-row>
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
          { title: 'Click Me' },
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
