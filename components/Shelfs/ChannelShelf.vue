<template>
  <v-card class="rounded-card d-flex align-center flex-column pt-2 elevation-4 grow" width="180">
    <NuxtLink class="subheading" :to="{name: 'channel-id', params: {id: data.channelId}}">
      <v-avatar size="88">
        <v-img :src="data.thumbnails.url">
        </v-img>
      </v-avatar>
    </NuxtLink>
    <v-card-title class="ml-1 body-1 font-weight-bold">{{ data.title }}</v-card-title>
    <v-card-subtitle v-if="data.subscribers" class="ml-1 grey--text">{{ data.subscribers }}</v-card-subtitle>
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