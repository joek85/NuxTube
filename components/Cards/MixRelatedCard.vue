<template>
  <v-card class="pa-1 transparent" flat>
    <v-row no-gutters class="pa-2">
      <v-col class="" cols="5" sm="3" md="5" lg="5">
        <NuxtLink
          :to="{
            name: 'player',
            query: { id: data.videoId, list: data.playlistId },
          }"
                  style="text-decoration: none"
        >
          <v-img
          class="align-end"
            :src="data.thumbnail.url"
            :aspect-ratio="16 / 9"
            style="border-radius: 5%"
          >
          <v-card-subtitle style="background-color:rgb(0, 0, 0, 0.5);" class="pa-0 d-flex justify-center dark">
            <v-icon dark class="pa-0">mdi-antenna</v-icon>
          </v-card-subtitle>
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
      <v-col>
        <v-col class="d-flex pa-0 ma-0">
          <v-card-title
            class="pl-2 pa-0 subtitle-2 font-weight-bold ma-0 two-lines"
          >
            {{ data.title }}
          </v-card-title>
        </v-col>
        <v-col class="pa-0 ma-0">
          <v-card-subtitle class="pl-2 pt-2 pb-0 two-lines">
            {{ data.author }}
          </v-card-subtitle>
        </v-col>
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
.two-lines {
  line-height: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  max-height: 3rem;
}
</style>