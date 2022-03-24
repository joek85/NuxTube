<template>
  <!-- <v-card class="rounded-card elevation-4 grow" width="240">

    <NuxtLink class="subheading" :to="{name: 'player', query: {id: data.videoId}}">
      <v-img :src="data.thumbnails.url" aspect-ratio="1.7" height="120px">
        <template v-slot:placeholder>
          <v-row class="fill-height pa-0">
            <v-col cols="12">
              <v-skeleton-loader type="image"></v-skeleton-loader>
            </v-col>
          </v-row>
        </template>
      </v-img>
    </NuxtLink>
    <v-card-subtitle class="white--text pb-1 body-1 font-weight-bold">{{ data.title }}</v-card-subtitle>
    <v-card-subtitle v-if="data.subtitle" class="grey--text pt-1">{{ data.subtitle }}</v-card-subtitle>
    <v-card-title class="pa-1 d-flex ">
      <v-chip v-if="data.duration" class="grey--text" outlined small color="accent">{{data.duration}}</v-chip>
      <v-chip v-if="data.isLive == true" small outlined color="red">LIVE</v-chip>
      <v-chip v-if="data.views" class="grey--text" outlined small color="accent">
        <v-icon>mdi-play</v-icon>
        <span>{{data.views}}</span>
      </v-chip>
      <v-chip v-if="data.published" class="grey--text" outlined small color="accent">{{data.published}}</v-chip>
      <v-chip v-if="data.videoCounts" class="grey--text" outlined small color="accent">{{data.videoCounts}} videos</v-chip>

    </v-card-title>
  </v-card> -->
  
  
    <v-card class="pa-1 grow" width="256" flat>
    <v-row>
      <v-col cols="12">
        <NuxtLink :to="{ name: 'player', query: { id: data.videoId } }">
          <v-img class="" aspect-ratio="1.7" :src="data.thumbnails.url.split('?')[0]">
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
      <v-col
        cols="12"
        class="d-flex flex-column justify-space-between d-sm-inline"
      >
        <v-card-title class="pa-0 subtitle-1">
          <v-row>
            <v-col cols="10">
              <v-card-title class="subtitle-1 pa-1">{{ data.title }}</v-card-title>
            </v-col>
            
          </v-row>
        </v-card-title>
     
         
          <v-col cols="10">
            <v-toolbar-title class="pa-0 subtitle-2 grey--text">{{
              data.subtitle
            }}</v-toolbar-title>
          </v-col>
      
        <v-card-title v-if="!data.isLive" class="pa-1 subtitle-2 grey--text"
          >{{ data.views }} - {{ data.published }} - {{ data.duration }}</v-card-title
        >
        <v-chip v-if="data.isLive === true" small color="red">LIVE</v-chip>
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
<style lang="scss">
.grow {
  transition: all 0.25s ease-in-out;
}
.grow:hover {
  transform: scale(1.05);
}
</style>
