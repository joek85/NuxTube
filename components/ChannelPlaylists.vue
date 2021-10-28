<template>
  <v-row class="">
    <v-col cols="12" class=""
           v-for="playlist in playlists"
           :key="playlist.title">
      <v-row v-if="getCardType(playlist.type) === 'grid'">
        <v-col cols="2"
               v-for="item in playlist.items"
               :key="item.playlistId">
          <playlist-shelf class="" :data="item"/>
        </v-col>
      </v-row>
      <v-row v-else>
        <v-col cols="12">
          <v-card flat>
            <v-card-title class="pb-0"> {{ playlist.title }}</v-card-title>
            <v-slide-group show-arrows>
              <v-slide-item class="ma-2"
                            v-for="item in playlist.items"
                            :key="item.playlistId">
                <playlist-shelf :data="item"/>
              </v-slide-item>
            </v-slide-group>
          </v-card>
        </v-col>
      </v-row>

    </v-col>
    <v-col cols="12">
      <div class="text-center pa-1">
        <v-progress-circular
          v-if="$fetchState.pending"
          indeterminate
          color="primary"
        ></v-progress-circular>
      </div>
    </v-col>
  </v-row>

</template>
<script>

  import ShelfCard from '../components/ShelfCard'
  import ChannelCard from  '../components/ChannelCard.vue'
  import ChannelFeaturedCard from '../components/ChannelFeaturedCard.vue'
  import PlaylistShelf from './Shelfs/PlaylistShelf.vue'
  export default {
    components: {
      ShelfCard,
      ChannelCard,
      ChannelFeaturedCard,
      PlaylistShelf
    },
    props: {
      data: [],
    },
    data() {
      return {
        fetched: false,
        playlists: []
      }
    },
    mounted() {
      // console.log(this.$props.data[0])
    },
    async fetch() {
      this.fetched = false;
      const playlists = await this.$axios.$get('/api/channel/playlists', {
        params: {
          channelId: this.$props.data[0].browseId,
          clickTrackingParams: this.$props.data[0].clickTrackingParams,
          params: this.$props.data[0].params
        }
      });
      console.log(playlists)
      this.playlists = playlists;
      this.fetched = true;
    },
    fetchOnServer: false,
    methods: {
      getCardType (type) {
        // switch (type){
        //   case 'shelf':
        //     return 'ShelfCard';
        //   case 'channelVideo':
        //     return 'ChannelCard';
        //   case 'channelFeaturedVideos':
        //     return 'ChannelFeaturedCard'
        // }
        return type
      },
    }
  }
</script>
