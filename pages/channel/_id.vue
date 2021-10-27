<template>
  <v-card>
    <v-card v-if="results.header.banner.length">
      <v-img class="imgStyle" :src="results.header.banner[results.header.banner.length - 1].url">

      </v-img>
    </v-card>
    <v-container>
      <v-card class="mb-2">
        <v-card-title>
          <v-avatar size="88">
            <img :src="results.header.avatar[results.header.avatar.length - 1].url">
          </v-avatar>
          <v-list-item-content class="ml-2">
            <v-toolbar-title>{{results.header.title}}</v-toolbar-title>
            <v-toolbar-title class="grey--text subtitle-1">{{results.header.subscribers}}</v-toolbar-title>
            <v-toolbar-title class="grey--text subtitle-2">{{results.header.descriptions}}</v-toolbar-title>
          </v-list-item-content>
        </v-card-title>
      </v-card>
      <!--</v-col>-->
      <!--<v-col cols="12">-->
      <v-tabs show-arrows background-color="primary" dark v-model="tab" class="mb-2">
        <v-tabs-slider></v-tabs-slider>
        <v-tab
          v-for="item in results.items"
          :key="item.tabs.title"
        >
          {{ item.tabs.title }}
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item v-for="item in results.items"
                    :key="item.tabs.title">
          <component :is="getCardType(item.tabs.title)" :data="item.tabs.items"/>
        </v-tab-item>
      </v-tabs-items>

      <!--</v-col>-->
      <!--</v-row>-->

    </v-container>
  </v-card>
  <!--<v-container fluid>-->
    <!--<v-row >-->
      <!--<v-col cols="12">-->

  <!--</v-container>-->
      <!--</v-col>-->
      <!--<v-col cols="12">-->

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
    head() {
      return {
        title: this.results.header.title
      };
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
    methods: {
      getCardType (type) {
        switch (type){
          case 'Home':
            return 'ChannelVideos';
        }
      },
    },

  }
</script>
<style scoped>
  .imgStyle {
    height: calc((100vw - 240px) / 6.2 - 1px);
  }
</style>
