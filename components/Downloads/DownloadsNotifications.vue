<template>
  <v-card flat>
    <v-list>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>Notifications</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list v-if="downloads.length">
      <v-list-item-group>
        <template v-for="(d, i) in downloads">
          <v-list-item :key="i">
            <v-list-item-icon>
              <v-icon>{{ getMediaType(d.mediaType) }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ d.title }}</v-list-item-title>
              <v-list-item-subtitle class="">{{
                d.subTitle
              }}</v-list-item-subtitle>
              <v-progress-linear v-model="d.progress"></v-progress-linear>
            </v-list-item-content>
            <v-list-item-action>
              <v-list-item-action-text
                v-text="d.progress + '%'"
              ></v-list-item-action-text>
            </v-list-item-action>
          </v-list-item>
          <v-divider :key="i + 1"></v-divider>
        </template>
      </v-list-item-group>
    </v-list>
    <v-card-subtitle class="text-center" v-else
      >No notifications.</v-card-subtitle
    >
    <v-card-actions
      class="d-flex justify-center"
      v-if="downloads.length && !getPath"
    >
      <v-btn small to="/downloads" nuxt text color="primary">View all</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  watch: {
    "$route.name"(name) {
      if (name === "downloads") {
        this.path = true;
      } else {
        this.path = false;
      }
    },
  },
  data() {
    return {
      path: false,
      downloads: [
        // {
        //   title: "title",
        //   mediaType: 2,
        //   subTitle: "sub",
        //   progress: 10,
        //   size: 150,
        // },
      ],
    };
  },
  computed: {
    getPath() {
      return this.path;
    },
  },
  methods: {
    getMediaType(t) {
      switch (t) {
        case 0:
          return "mdi-music";
        case 1:
          return "mdi-video";
        case 2:
          return "mdi-image";
        default:
          break;
      }
    },
  },
};
</script>

<style>
</style>