<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h2 class="card-title">{{SearchResults.originalQuery}}</h2>
      </v-col>
      <v-col cols="12">
        <h3 class="title">{{'Showing ' + SearchResults.results + ' results'}}</h3>
      </v-col>
      <v-col cols="12">
        <v-card class="elevation-0 transparent">
          <v-slide-group show-arrows v-model="refines" @change="cardClick">
            <v-slide-item class="ma-2"
              v-for="item in SearchResults.refinements"
              :key="item.q" v-slot="{ active, toggle }">
              <v-card @click="toggle" class="rounded-card " width="180">
                <router-link :to="{name: 'search', query: {q: item.q } }">
                  <v-img :src="item.bestThumbnail.url" contain height="120px">
                    <template v-slot:placeholder>
                      <v-row class="fill-height pa-0">
                        <v-col cols="12">
                          <v-skeleton-loader type="image"></v-skeleton-loader>
                        </v-col>
                      </v-row>
                    </template>
                  </v-img>
                </router-link>
                <v-card-title >
                  <p>{{ item.q }}</p>
                </v-card-title>
              </v-card>
            </v-slide-item>
          </v-slide-group>
        </v-card>
      </v-col>
      <v-col cols="12">
        <template v-for="block in SearchResults.items">
          <component :is="getCardType(block.type)" :data="block" ></component>
        </template>
      </v-col>
      <v-col cols="12" class="d-flex justify-center">
        <v-btn rounded color="primary" dark>loadmore</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import SearchCard from '~/components/SearchCard.vue'
  import ShelfCard from '~/components/ShelfCard.vue'
  import ChannelCard from '~/components/ChannelCard.vue'
  import { mapGetters } from 'vuex'
  export default {
    components: {
      SearchCard,
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
        title: this.SearchResults.originalQuery
      };
    },
    computed: {
      ...mapGetters({
        SearchResults: 'getSearchResults'
      }),
    },
    watchQuery: true,
    async asyncData({query, $axios, store}) {
      const results = await $axios.$get('/api/search', {
        params: {
          q: query.q
        }
      });
//      console.log(results);
      store.dispatch('storeSearchResults', results);
      return 1
    },
    methods: {
      getCardType (type) {
        switch (type){
          case 'video':
            return 'SearchCard';
          case 'channel':
            return 'ChannelCard';
          case 'shelf':
            return 'shelfCard';
        }
      },
      cardClick () {
//        console.log(this.refines)
        //this.$router.push({name: 'search', query: {q: this.SearchResults.refinements[this.refines].q}});
      }
    }

  }
</script>
