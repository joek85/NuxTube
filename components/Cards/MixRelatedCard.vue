<template>
  <v-card class="pa-2 grow" flat>
    <v-row>
      <v-col cols="12" xl="4">
        <NuxtLink
          :to="{
            name: 'player',
            query: { id: data.videoId, list: data.playlistId },
          }"
        >
          <v-img :src="data.thumbnail.url" aspect-ratio="1.7">
            <template v-slot:placeholder>
              <v-row class="fill-height pa-0">
                <v-col cols="12">
                  <v-skeleton-loader type="image"></v-skeleton-loader>
                </v-col>
              </v-row>
            </template>
          </v-img>
        </NuxtLink>
      </v-col>
      <v-col cols="12" xl="8">
        <v-list-item two-line class="pa-0">
          <v-list-item-content>
            <v-list-item-title>{{ data.title }}</v-list-item-title>
            <v-list-item-subtitle>{{ data.author }} </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-list-item-action-text
              v-text="data.videoCounts"
            ></v-list-item-action-text>
          </v-list-item-action>
        </v-list-item>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  props: ["data"],
};
</script>

<style lang="scss">
.grow {
  transition: all 0.25s ease-in-out;
}
.grow:hover {
  transform: scale(1.05);
}
</style>