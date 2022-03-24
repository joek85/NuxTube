<template>
  <v-card flat>
    <v-card-title class=""> {{ data.title }}</v-card-title>
    <v-slide-group show-arrows>
      <v-slide-item class=""
                    v-for="video in data.videos"
                    :key="video.videoId">
        <shelf-video-card :data="video"></shelf-video-card>
      </v-slide-item>
    </v-slide-group>
  </v-card>
</template>

<script>
  import ShelfVideoCard from '../../components/Search/ShelfVideoCard.vue'
    export default {
       props: {
         data: ''
       },
       fetchOnServer: false,
      components: {
        ShelfVideoCard
      }
    }
</script>

<style scoped>

</style>
