<template>
  <v-card flat class="d-flex align-center transparent">
    <v-row>
      <v-col cols="12" sm="3" md="4">
        <v-card-title class="justify-center">
          <NuxtLink
            class="nuxt-link-exact-active"
            :to="{ name: 'channel-id', params: { id: data.channelId } }"
          >
            <v-avatar size="88">
              <img :src="data.thumbnail.url" />
            </v-avatar>
          </NuxtLink>
        </v-card-title>
      </v-col>
      <v-col cols="12" sm="9" md="8">
        <v-card-title class="ml-2 pa-0">{{ data.title }}</v-card-title>
        <v-card-title class="subtitle-1 ml-2 pa-0 grey--text"
          >{{ data.subscribers }} - {{ data.videoCounts }}</v-card-title
        >
        <v-card-title class="subtitle-1 ml-2 pa-0 grey--text">{{
          data.description
        }}</v-card-title>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  props: {
    data: "",
  },
};
</script>

<style scoped>
</style>
