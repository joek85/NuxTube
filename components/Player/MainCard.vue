<template>
  <v-card flat rounded="lg">
    <v-img
      class=""
      ref="imageplayer"
      :aspect-ratio="16 / 9"
      :src="AudioPlayerData.thumbnail"
    ></v-img>
  </v-card>
</template>

<script>
import utils from "../../utils/utils";
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters({
      AudioPlayerData: "getAudioPlayerData",
    }),
  },
  mounted() {
    this.$store.commit("showBottomSheet", true);
  },
};
</script>