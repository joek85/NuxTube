<template>
  <v-card class="rounded-card elevation-4" width="240">
    <NuxtLink class="subheading" :to="{name: 'playlist-id', params: {id: data.playlistId}}">
      <v-img :src="data.thumbnails[data.thumbnails.length -1].url" aspect-ratio="1.7" height="120px">
        <template v-slot:placeholder>
          <v-row class="fill-height pa-0">
            <v-col cols="12">
              <v-skeleton-loader type="image"></v-skeleton-loader>
            </v-col>
          </v-row>
        </template>
      </v-img>
    </NuxtLink>
    <v-card-subtitle class="white--text pb-1 font-weight-bold">{{ data.title }}</v-card-subtitle>
    <v-card-subtitle v-if="data.subtitle" class="pt-1">{{ data.subtitle }}</v-card-subtitle>
    <v-card-title class="pa-1 d-flex ">
      <v-chip v-if="data.videoCounts" class="grey--text" outlined small color="accent">{{data.videoCounts}} videos</v-chip>
    </v-card-title>
  </v-card>
</template>

<script>

  export default {
    props: {
      data: {}
    },
    methods: {

    },
    mounted() {

    }
  }
</script>
