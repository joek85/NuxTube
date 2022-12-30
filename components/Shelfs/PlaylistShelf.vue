<template>
  <v-card class="pa-1 grow" width="256" flat>
    <NuxtLink class="subheading" :to="{name: 'playlist-id', params: {id: data.playlistId}}">
      <v-img v-if="data.thumbnails" :src="data.thumbnails.url" aspect-ratio="1.7" style="border-radius:5%">
        <template v-slot:placeholder>
          <v-row class="fill-height pa-0">
            <v-col cols="12">
              <v-skeleton-loader type="image"></v-skeleton-loader>
            </v-col>
          </v-row>
        </template>
      </v-img>
    </NuxtLink>
    <v-card-title v-snip="{ lines: 2 }" class="subtitle-1 font-weight-bold">{{ data.title }}</v-card-title>
    <v-card-subtitle v-if="data.subtitle" class="">{{ data.subtitle }}</v-card-subtitle>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-chip v-if="data.videoCounts" class="grey-text" outlined small >{{data.videoCounts}} videos</v-chip>
    </v-card-actions>
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
<style lang="scss">
.grow {
  transition: all 0.25s ease-in-out;
}
.grow:hover {
  transform: scale(1.05);
}
</style>
