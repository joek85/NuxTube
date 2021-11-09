<template>
  <v-card class="elevation-4">
    <v-card-title class="font-weight-bold">{{ data.title }}</v-card-title>
    <v-row v-for="video in data.videos" :key="video.title">
      <v-col md="2" sm="12">
        <NuxtLink :to="{name: 'player', query: {id: video.videoId}}">
          <v-img class="pa-0 ma-1"
                 aspect-ratio="1.7"
                 :src="video.thumbnails.url">
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
      <v-col md="10" sm="12">
        <v-card-title class="font-weight-bold">{{ video.title }}</v-card-title>
        <v-card-title class="subtitle-1 pt-0">{{ video.description }}</v-card-title>
        <v-card-actions class="pt-0">
          <v-chip class=" mr-2" outlined color="primary">{{video.views}}</v-chip>
        </v-card-actions>
      </v-col>
    </v-row>

  </v-card>

</template>

<script>
  export default {
    props: {
        data: {}
    },
    data () {
        return {
          params: '?amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1'
        }
    },
    methods: {

    },
    computed: {

    }
  }
</script>
