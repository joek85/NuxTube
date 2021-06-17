<template>
  <v-container>
    <v-card class="mb-4">
      <v-row >
        <v-col cols="12" md="3">
            <v-sheet
              elevation="5"
              class="ma-3">
              <v-img
                aspect-ratio="1.7"
                :src="results[0].thumbnail.url.split('?')[0]">
              </v-img>
            </v-sheet>
        </v-col>
        <v-col cols="12" md="9">
          <h1 class="pt-2">
            {{ results[0].title }}
          </h1>
          <v-card-title class="pa-0">
            <NuxtLink class="nuxt-link-exact-active" :to="{name: 'channel-id', params: {id: results[0].author.id } }">
              <v-avatar size="64">
                <img :src="results[0].author.thumbnails[0].url">
              </v-avatar>
            </NuxtLink>
            <v-list-item-content class="ml-2">
              <v-toolbar-title>{{results[0].author.name}}</v-toolbar-title>
              <v-toolbar-title class="grey--text">{{getPlayCounts(results[0].author.subscriber_count) + ' Subscribers'}}</v-toolbar-title>
            </v-list-item-content>
          </v-card-title>
            <v-card-title class="pa-2 d-flex ml-0">
              <v-chip v-if="results[0].duration !== `0`" class="grey--text mr-2" color="accent">{{convertTime(results[0].duration)}}</v-chip>
              <v-chip v-if="results[0].isLive == true" outlined color="red" class="mr-2">LIVE</v-chip>
              <v-chip class="grey--text mr-2" color="accent">
                <v-icon>mdi-play</v-icon>
                <span>{{getPlayCounts(results[0].play_counts)}}</span>
              </v-chip>
              <v-chip v-if="results[0].published_at" class="grey--text" color="accent">{{formatDate(results[0].published_at)}}</v-chip>
            </v-card-title>
          </v-col>
      </v-row>
    </v-card>
    <v-card class="mt-6 pa-1 transparent">
      <v-row>
        <v-col sm="6"
               md="4"
               lg="4"
               xl="2"
                v-for="related in results[0].related"
                :key="related.id">
          <MediaCardRelated :data="related"></MediaCardRelated>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>
<script>
  import utils from '../../utils/utils'
  import MediaCardRelated from '../../components/MediaCardRelated.vue'
  export default {
    components: {
      MediaCardRelated,
    },
    watchQuery: true,
    head() {
      return {
        title: this.results[0].title
      };
    },
    async asyncData({params, $axios, store}) {
      const results = await $axios.$get('/api/player', {
        params: {
          id: params.id
        }
      });
//      console.log(results);
      store.commit('setAudioPlayerData', {
        title: results[0].title,
        subtitle: results[0].author.name,
        thumbnail: results[0].thumbnail.url.split('?')[0],
        url: results[0].formats.url
      });
      store.commit('showBottomSheet', true);
      return { results }
    },
    methods: {
      getPlayCounts (nb) {
        return utils.formatNumbers(nb)
      },
      convertTime (time) {
        return utils.convertTime(time)
      },
      formatDate (date) {
        return utils.formatDate(date)
      }
    }
  }
</script>
