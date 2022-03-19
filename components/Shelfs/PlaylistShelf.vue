<template>
  <v-card class="rounded-card elevation-4" width="240">
    <NuxtLink class="subheading" :to="{name: 'playlist-id', params: {id: data.playlistId}}">
      <v-img v-if="data.thumbnails" :src="data.thumbnails.url" aspect-ratio="1.7" >
        <template v-slot:placeholder>
          <v-row class="fill-height pa-0">
            <v-col cols="12">
              <v-skeleton-loader type="image"></v-skeleton-loader>
            </v-col>
          </v-row>
        </template>
      </v-img>
    </NuxtLink>
    <v-card-title class="subtitle-1 font-weight-bold">{{ data.title }}</v-card-title>
    <v-card-subtitle v-if="data.subtitle" class="">{{ data.subtitle }}</v-card-subtitle>
    <v-card-title class="">
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
