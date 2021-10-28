<template>
  <v-card flat>
    <v-card-title class="pb-0"> {{ data.title }}</v-card-title>
    <v-toolbar-title class="grey--text ml-4 mt-0 subtitle-2"> {{ data.subtitle }}</v-toolbar-title>
    <v-slide-group show-arrows @change="cardClick">
      <v-slide-item class="ma-2"
                    v-for="item in data.videos.items"
                    :key="item.videoId">
        <component :is="getCardType(type)" :data="item"/>
      </v-slide-item>
    </v-slide-group>
  </v-card>
</template>

<script>
  import utils from '../utils/utils'
  import MediaCardShelf from './MediaCardShelf.vue'
  import PlaylistShelf from './Shelfs/PlaylistShelf.vue'
  import ChannelShelf from './Shelfs/ChannelShelf.vue'

  export default {
    components: {
      MediaCardShelf,
      PlaylistShelf,
      ChannelShelf
    },
    props: {
      data: {},
      type: ''
    },
    data () {
      return {
        refines: null,
      }
    },
    methods: {
      cardClick () {

      },
      getPlayCounts (nb) {
        return utils.formatNumbers(nb)
      },
      getCardType (type) {
        switch (type){
          case 'videos':
            return 'MediaCardShelf';
          case 'playlists':
            return 'PlaylistShelf';
          case 'channel':
            return 'ChannelShelf'
        }
      },
    }
  }
</script>
