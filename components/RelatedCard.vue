<template>
  <v-card class="mx-auto transparent">
    <v-container>
      <v-row>
        <v-col cols="12"
               v-for="related in posts.relatedVideos"
               :key="related.id">
          <MediaCardRelatedHorizontal :data="related"></MediaCardRelatedHorizontal>
        </v-col>
        <!--<v-col cols="12" class="d-flex justify-center">-->
        <!--<v-btn rounded color="primary" dark @click="loadMore(posts.continuation)">loadmore</v-btn>-->
        <!--</v-col>-->
        <v-col cols="12">
          <div class="text-center pa-1" v-if="$fetchState.pending">
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
          </div>
        </v-col>

      </v-row>
    </v-container>


  </v-card>
</template>
<script>
  export default {
    props: {
      id: ''
    },
    data() {
      return {
        continuation: '',
        ctp: '',
        posts: {continuation: '', relatedVideos: []},
        fetched: false
      }
    },
    async fetch() {
      this.fetched = false;
      const related = await this.$axios.$get('/api/player/related', {
        params: {
          id: this.id,
          continuation: this.continuation,
          ctp: this.ctp
        }
      });

      this.posts.continuation = related.continuation;
      this.posts.relatedVideos.push(...related.relatedVideos);
      this.fetched = true;
    },
    fetchOnServer: false,
    methods: {
      loadMore (continuation) {
        if (continuation){
          this.continuation = continuation.Token;
          this.ctp = continuation.ctp;
          this.$fetch();
        }
      },
      handleScroll() {
        let bottomOfWindow = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop) + window.innerHeight === document.documentElement.offsetHeight

        if (bottomOfWindow && this.fetched) {
          setTimeout(this.loadMore(this.posts.continuation), 1000)
        }
      }
    },
    mounted() {
      window.addEventListener('scroll', this.handleScroll);
    },
    destroyed() {
      window.removeEventListener('scroll', this.handleScroll);
    }
  }
</script>
