<template>
  <v-card class="pa-1 pb-0 transparent" flat>
    <v-row no-gutters class="pa-2 pb-0">
      <v-col cols="5" sm="3" md="5" lg="5">
        <NuxtLink
          :to="{ name: 'playlist-id', params: { id: playlistId } }"
          style="text-decoration: none"
        >
          <v-img
            class=""
            :src="thumbnail.url"
            :aspect-ratio="16 / 9"
            style="border-radius: 5%"
          >
            <v-card
              style="height: 100%"
              flat
              class="justify-end d-flex flex-row transparent"
            >
              <v-col
                cols="6"
                class=""
                style="background-color: rgb(0, 0, 0, 0.8)"
              >
                <v-card class="transparent" flat>
                  <v-card-subtitle
                    class="
                      white--text
                      font-weight-bold
                      pa-1
                      d-flex
                      justify-center
                    "
                  >
                    {{ videoCounts }}
                  </v-card-subtitle>
                  <v-card-actions class="d-flex justify-center pa-1">
                    <v-icon dark class="">mdi-playlist-play</v-icon>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-card>

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
            {{ title }}
          </v-card-title>
        </v-col>
        <v-col class="pa-0 ma-0">
          <v-card-subtitle class="pl-2 pt-2 pb-0 two-lines">
            {{ subtitle }}
          </v-card-subtitle>
        </v-col>
        <v-col class="pa-0 ma-0">
          <v-card-subtitle class="pl-2 pt-2 pb-0 two-lines">
            {{ published }}
          </v-card-subtitle>
        </v-col>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  props: {
    playlistId: "",
    thumbnail: "",
    title: "",
    subtitle: "",
    published: "",
    videoCounts: 0,
  },
  methods: {},
  mounted() {},
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
