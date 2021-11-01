<template>
  <v-container >
    <v-row>
      <v-col cols="12">
        <v-sheet elevation="10" rounded="xl">
          <v-sheet class="pa-2 primary" dark rounded="t-xl">
              <v-card-title class="pa-0 pl-2">Searching for: {{SearchQuery}}</v-card-title>
              <v-card-title class="pa-0 pl-2 subtitle-1">{{'Showing ' + results.estimatedResults + ' results'}}</v-card-title>
          </v-sheet>
          <div class="pa-4">
            <v-chip-group active-class="primary--text" column>
              <v-chip
                outlined
                color="primary"
                v-for="refinement in results.refinements"
                :key="refinement"
                :to="{name: 'search-query', query: {q: refinement}}">
                {{ refinement }}
              </v-chip>
            </v-chip-group>
          </div>
        </v-sheet>
      </v-col>
      <v-col order="2" md="4">
        <artist-card :data="results.secondaryResults"/>
      </v-col>
      <v-col order="1" md="8">
        <v-card flat class="transparent">
          <!--<v-slide-group show-arrows v-model="refines" @change="cardClick">-->
            <!--<v-slide-item class="ma-2"-->
              <!--v-for="item in SearchResults.refinements"-->
              <!--:key="item.q" v-slot="{ active, toggle }">-->
              <!--<v-card @click="toggle" class="rounded-card " width="180">-->
                <!--<router-link :to="{name: 'Search', query: {q: item.q } }">-->
                  <!--<v-img :src="item.bestThumbnail.url" contain height="">-->
                    <!--<template v-slot:placeholder>-->
                      <!--<v-row class="fill-height pa-0">-->
                        <!--<v-col cols="12">-->
                          <!--<v-skeleton-loader type="image"></v-skeleton-loader>-->
                        <!--</v-col>-->
                      <!--</v-row>-->
                    <!--</template>-->
                  <!--</v-img>-->
                <!--</router-link>-->
                <!--<v-card-title >-->
                  <!--<p>{{ item.q }}</p>-->
                <!--</v-card-title>-->
              <!--</v-card>-->
            <!--</v-slide-item>-->
          <!--</v-slide-group>-->
          <v-col cols="12">
            <template v-for="result in results.primaryResults">
              <component :is="getCardType(result.type)" :data="result.items" class="mb-3"/>
            </template>
          </v-col>
        </v-card>
      </v-col>

      <!--<v-col cols="12" class="d-flex justify-center">-->
        <!--<v-btn rounded color="primary" dark>loadmore</v-btn>-->
      <!--</v-col>-->
    </v-row>
  </v-container>
</template>

<script>
  import VideoCard from '../../components/Search/VideoCard.vue'
  import ShelfCard from '../../components/Search/ShelfCard.vue'
  import ChannelCard from '../../components/Search/ChannelCard.vue'
  import ArtistCard from '../../components/Search/ArtistCard.vue'
  import QueryCard from '../../components/Search/QueryCard.vue'
  import { mapGetters } from 'vuex'
  export default {
    components: {
      VideoCard,
      ArtistCard,
      ChannelCard,
      ShelfCard,
      QueryCard
    },
    data () {
      return {
        refines: null,
        title: ''
      }
    },
    mounted () {
    },
    head() {
      return {
        title: this.$route.query.q
      };
    },
    computed: {
      ...mapGetters({
        SearchQuery: 'getSearchQuery'
      }),
    },
    watchQuery: true,
    async asyncData({query, $axios, store}) {
      const results = await $axios.$get('/api/Search', {
        params: {
          q: query.q
        }
      });
     console.log(results);
     store.dispatch('storeSearchQuery', query.q);
      return { results }
    },
    methods: {
      getCardType (type) {
        switch (type){
          case 'video':
            return 'VideoCard';
          case 'channel':
            return 'ChannelCard';
          case 'shelf':
            return 'ShelfCard';
          case 'cards':
            return 'QueryCard'
        }
      }
    }

  }
</script>
