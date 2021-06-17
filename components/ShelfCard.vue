<template>
  <v-col cols="12" class="pa-0 pt-3 pb-3">
    <v-card class="elevation-0 transparent">
      <v-card-title> {{ data.title }}</v-card-title>
      <v-slide-group show-arrows v-model="refines" @change="cardClick">
        <v-slide-item class="ma-2"
                      v-for="item in data.items"
                      :key="item.q">
          <MediaCardShelf :data="item"></MediaCardShelf>
        </v-slide-item>
      </v-slide-group>
    </v-card>
  </v-col>
</template>

<script>
  import utils from '../utils/utils'
  import MediaCardShelf from './MediaCardShelf.vue'

  export default {
    components: {
      MediaCardShelf,
    },
    props: {
      data: {},
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
    }
  }
</script>
