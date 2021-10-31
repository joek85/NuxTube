<template>
  <v-card flat class="d-flex align-center">
    <v-card-title>
      <v-avatar size="88">
        <img :src="data.thumbnail.url">
      </v-avatar>
    </v-card-title>
    <div>
      <v-card-title class="ml-2 pa-0">{{data.title}}</v-card-title>
      <v-card-title class="subtitle-1 ml-2 pa-0">{{data.subscribers}} - {{data.videoCounts}}</v-card-title>
      <v-card-title class="subtitle-1 ml-2 pa-0">{{data.description}}</v-card-title>
    </div>
  </v-card>
</template>

<script>
    export default {
      props: {
        data: ''
      }
    }
</script>

<style scoped>

</style>
