<template>
  <v-card class="elevation-4">
    <v-row>
      <v-col md="3" sm="12">
        <v-col class="d-flex justify-center flex-column">
          <vue-plyr :key="data.videoId">
            <div class="plyr__video-embed">
              <iframe
                style="border: transparent"
                :src="`https://www.youtube.com/embed/${data.videoId + params}`"
                allowfullscreen
                allowtransparency
              ></iframe>
            </div>
          </vue-plyr>
        </v-col>
      </v-col>
      <v-col md="9" sm="12">
        <v-card-title class="font-weight-bold">{{ data.title }}</v-card-title>
        <v-card-title class="subtitle-1 pt-0">{{
          data.description
        }}</v-card-title>
        <v-card-actions class="pt-0">
          <v-chip class="grey--text mr-2" outlined color="accent">{{
            data.views
          }}</v-chip>
          <v-chip
            v-if="data.published"
            class="grey--text"
            outlined
            color="accent"
            >{{ data.published }}</v-chip
          >
        </v-card-actions>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  props: {
    data: {},
  },
  data() {
    return {
      params:
        "?amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1",
    };
  },
  methods: {},
  computed: {},
};
</script>
<style scoped>
.plyr {
  height: inherit;
  --plyr-color-main: red;
}
</style>
