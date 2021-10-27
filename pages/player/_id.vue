<template>
  <v-container fluid>
    <v-row>
      <v-col order="1" cols="8">
        <v-card class="mb-4">
          <v-row >
            <v-col xl="3" sm="12">
              <v-hover>
                <template v-slot:default="{ hover }">
                  <v-card
                    class="mx-auto">
                    <v-img
                      aspect-ratio="1.7"
                      :src="results[0].thumbnail.url.split('?')[0]">
                    </v-img>
                    <v-fade-transition>
                      <v-overlay
                        absolute
                        v-if="hover"
                        color="#121212">
                        <v-btn
                          @click.stop="showVideoDialog"
                          icon
                          fab
                          dark
                          color="primary"
                          x-large>
                          <v-icon x-large color="white">mdi-video-outline</v-icon>
                        </v-btn>
                      </v-overlay>
                    </v-fade-transition>
                  </v-card>
                </template>
              </v-hover>
            </v-col>
            <v-col cols="12" md="9" sm="9">
              <v-card-title class="text-h4 font-weight-bold">
                {{ results[0].title }}
              </v-card-title>
              <v-card-title class="d-flex justify-space-around pt-0">
                <NuxtLink class="nuxt-link-exact-active" :to="{name: 'channel-id', params: {id: results[0].channel_id } }">
                  <!--<v-avatar size="36">-->
                  <!--<img :src="results[0].authorThumbnail">-->
                  <!--</v-avatar>-->
                </NuxtLink>
                <v-list-item-content class="pl-2">
                  <NuxtLink class="nuxt-link-exact-active" :to="{name: 'channel-id', params: {id: results[0].channel_id } }">
                    <v-toolbar-title>{{results[0].author}}</v-toolbar-title>
                  </NuxtLink>
                  <!--<v-toolbar-title v-if="results[0].author" class="grey&#45;&#45;text">{{getPlayCounts(results[0].author) + ' Subscribers'}}</v-toolbar-title>-->
                </v-list-item-content>
              </v-card-title>
              <v-card-title class="pt-0 d-flex">
                <v-chip v-if="results[0].duration !== `0`" class="grey--text mr-2" outlined color="accent">{{convertTime(results[0].duration)}}</v-chip>
                <v-chip v-if="results[0].isLive == true" outlined color="red" class="mr-2">LIVE</v-chip>
                <v-chip class="grey--text mr-2" outlined color="accent">
                  <v-icon>mdi-play</v-icon>
                  <span>{{getPlayCounts(results[0].play_counts)}}</span>
                </v-chip>
                <v-chip v-if="results[0].published_at" class="grey--text" outlined color="accent">{{formatDate(results[0].published_at)}}</v-chip>
                <v-col cols="12" class="pa-0 ma-0">
                  <v-chip-group
                    active-class="primary--text"
                    column
                  >
                    <v-chip outlined

                            v-for="tag in results[0].tags"
                            :key="tag"
                    >
                      {{ tag }}
                    </v-chip>
                  </v-chip-group>
                </v-col>

              </v-card-title>
            </v-col>
          </v-row>
        </v-card>
        <DescriptionCard :descriptions="results[0].description"></DescriptionCard>
      </v-col>
      <v-col order="2" cols="4">
        <RelatedCard :id="results[0].id"></RelatedCard>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
  import utils from '../../utils/utils'
  import MediaCardRelated from '../../components/MediaCardRelated.vue'
  import RelatedCard from '../../components/RelatedCard.vue'
  import { mapGetters } from 'vuex'
  export default {
    components: {
      MediaCardRelated,
      RelatedCard
    },
    computed: {
      ...mapGetters({
        AudioPlayerData: 'getAudioPlayerData'
      }),
    },
    watchQuery: true,
    data() {
      return {

        overlay: false
      }
    },
    head() {
      return {
        title: this.results[0].title
      };
    },
    async asyncData({params, $axios, store, getters}) {
      let results;
        results = await $axios.$get('/api/player', {
          params: {
            id: params.id
          }
        });

        store.commit('setAudioPlayerData', {
          title: results[0].title,
          subtitle: results[0].author,
          thumbnail: results[0].thumbnail.url,
          url: results[0].formats.url,
          id: params.id
        });
        // store.commit('showBottomSheet', true);

      return { results }
    },
    methods: {
      getPlayCounts (nb) {
        return utils.formatNumbers(nb)
      },
      convertTime (time) {
        return utils.convertTime(time)
      },
      formatDate (date) {
        return utils.formatDate(date)
      },
      showVideoDialog() {
        this.$store.commit('showVideoDialog', true)
      }
    }
  }
</script>
