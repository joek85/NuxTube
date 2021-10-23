<template>
  <v-container>
    <v-row justify="space-between">
      <v-col cols="12">
        <v-card>
          <v-img max-height="200" :src="results.authorBanners[results.authorBanners.length - 1].url">
            <template v-slot:placeholder>
              <v-row class="fill-height pa-0">
                <v-col cols="12">
                  <v-skeleton-loader type="image"></v-skeleton-loader>
                </v-col>
              </v-row>
            </template>
          </v-img>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-avatar size="96">
              <img :src="results.authorThumbnails[results.authorThumbnails.length - 1].url">
            </v-avatar>
            <v-list-item-content class="ml-2">
              <v-toolbar-title>{{results.author}}</v-toolbar-title>
              <v-toolbar-title class="grey--text text-h6">{{results.subscriberText}}</v-toolbar-title>
              <v-toolbar-title class="grey--text">{{results.description}}</v-toolbar-title>
            </v-list-item-content>
          </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-tabs fixed-tabs show-arrows background-color="secondary" dark  v-model="tab">
          <v-tabs-slider></v-tabs-slider>
          <v-tab
            v-for="item in items"
            :key="item"
          >
            {{ item }}
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item>
            <channel-videos :channelId="results.authorId"></channel-videos>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>

  </v-container>
</template>
<script>
  import ChannelVideos from '../../components/ChannelVideos.vue'
  export default {
    components: {
      ChannelVideos
    },
    data () {
      return {
        tab: null,
        items: [
          'videos', 'playlists', 'channels',
        ],
      }
    },
    async asyncData({params, $axios, store}) {
      const results = await $axios.$get('/api/channel', {
        params: {
          channelId: params.id
        }
      });
      console.log(results);
      return { results }
    },
  }
</script>
