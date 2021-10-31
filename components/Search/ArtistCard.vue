<template>
    <v-card flat color="transparent">
      <v-card flat class="d-flex align-center">
        <v-card-title>
          <v-avatar size="88">
            <img :src="data.header.avatar.url">
          </v-avatar>
        </v-card-title>
        <div>
          <v-card-title class="ml-2 pa-0">{{data.header.title}}</v-card-title>
          <v-card-title class="subtitle-1 ml-2 pa-0">{{data.header.subtitle}}</v-card-title>
        </div>
      </v-card>
      <v-card flat class="mt-2">
        <NuxtLink :to="{name: 'player-id', params: {id: data.action.videoId}}">
          <v-img class=""
                 aspect-ratio="1.7"
                 :src="data.action.thumbnail.url">
            <template v-slot:placeholder>
              <v-row class="fill-height">
                <v-col cols="12">
                  <v-skeleton-loader type="image"></v-skeleton-loader>
                </v-col>
              </v-row>
            </template>
          </v-img>
        </NuxtLink>
        <v-card-title class="pb-0">{{data.action.title}}</v-card-title>
        <div class="d-flex justify-space-between">
          <v-card-title class="subtitle-1 pt-0">{{data.action.subtitle}}</v-card-title>
          <v-card-title class="subtitle-1 pt-0">{{data.action.duration}}</v-card-title>
        </div>
      </v-card>
      <v-card flat class="mt-2">
        <v-list two-line>
          <v-list-item-group
            active-class="primary">
            <template v-for="item in data.sections[0].items">
              <v-list-item :key="item.videoId" :to="{name: 'player-id', params: {id: item.videoId}}">
                  <v-list-item-content>
                    <v-list-item-title v-text="item.title"></v-list-item-title>
                    <v-list-item-subtitle v-text="item.subtitle"></v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-list-item-action-text v-text="item.duration"></v-list-item-action-text>
                  </v-list-item-action>
              </v-list-item>
              <v-divider></v-divider>
            </template>
          </v-list-item-group>
        </v-list>
      </v-card>
      <v-card flat class="mt-2">
        <v-card-title class=""> {{ data.sections[1].items.title }}</v-card-title>
        <v-slide-group show-arrows>
          <v-slide-item class="ma-1"
                        v-for="item in data.sections[1].items.items"
                        :key="item.playlistId">
            <v-card class="rounded-card elevation-4" width="180" height="220">
              <NuxtLink class="subheading" :to="{name: 'playlist-id', params: {id: item.playlistId}}">
                <v-img :src="item.thumbnail.url" aspect-ratio="1.7" height="120px">
                  <template v-slot:placeholder>
                    <v-row class="fill-height pa-0">
                      <v-col cols="12">
                        <v-skeleton-loader type="image"></v-skeleton-loader>
                      </v-col>
                    </v-row>
                  </template>
                </v-img>
              </NuxtLink>
              <v-toolbar-title class="">{{ item.query }}</v-toolbar-title>
            </v-card>
          </v-slide-item>
        </v-slide-group>
      </v-card>
    </v-card>
</template>

<script>
    export default {
      props: {
        data: ''
      },

    }
</script>

<style scoped>

</style>
