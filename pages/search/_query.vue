<template>
  <v-container>
    <search-card :query="$route.query"></search-card>
  </v-container>
</template>

<script>
import SearchCard from "../../components/Search/MainCard.vue";
export default {
  components: {
    SearchCard,
  },
  data() {
    return {
      title: "",
    };
  },
  head() {
    return {
      title: this.$route.query.q,
    };
  },
  computed: {},
  watchQuery: true,
  methods: {},
};
</script>
