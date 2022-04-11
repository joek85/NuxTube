<template>
  <v-container>
    <v-card class="pa-2 d-flex" flat>
      <v-btn icon>
          <v-icon>mdi-folder</v-icon>
      </v-btn>
      <!-- <v-file-input
        v-model="files"
        hide-input
        prepend-icon="mdi-folder"
      ></v-file-input> -->
      <!-- <input type="file"/> -->
      <v-card-title class="subtitle-1 pa-0 ml-2">{{ localPath }}</v-card-title>
    </v-card>
  </v-container>
</template>

<script>
import utils from "../../utils/utils";

export default {
  mounted() {
    this.getLocalpath();
  },
  data() {
    return {
      files: [],
      localPath: "",
    };
  },
  watch: {
      files(val) {
          console.log(val)
      }
  },
  methods: {
    getLocalpath() {
      this.localPath = utils.getLocalPath();
    },
  },
};
</script>

<style>
</style>