<template>
  <v-container>
    <v-row>
      <v-col order="1" cols="8">
        <v-card class="mb-4 pa-2">
          <v-row >
            <v-col xl="3" sm="12">
              <v-hover>
                <template v-slot:default="{ hover }">
                  <v-card
                    class="mx-auto">
                    <v-img
                      aspect-ratio="1.7"
                      :src="results[0].thumbnail.url">
                    </v-img>
                    <v-fade-transition>
                      <v-overlay class="imgOverlay"
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
                        <v-btn
                          icon
                          fab
                          dark
                          color="primary"
                          x-large>
                          <v-icon x-large color="white">mdi-cloud-download-outline</v-icon>
                        </v-btn>
                      </v-overlay>
                    </v-fade-transition>
                  </v-card>
                </template>
              </v-hover>
            </v-col>
            <v-col sm="12" xl="9"class="d-flex flex-column justify-space-between d-sm-inline">
              <v-card-title class="text-h4 font-weight-bold pa-0">{{ results[0].title }}</v-card-title>
              <v-card-title class="pa-0">
                <NuxtLink class="nuxt-link-exact-active" :to="{name: 'channel-id', params: {id: results[0].channel_id } }">
                  {{results[0].author}}
                </NuxtLink>
              </v-card-title>
              <v-card-title v-if="!results[0].isLive" class="pa-0 subtitle-2 grey--text">{{getPlayCounts(results[0].play_counts)}} - {{formatDate(results[0].published_at)}} - {{convertTime(results[0].duration)}}</v-card-title>
              <v-chip v-if="results[0].isLive" color="red" small>LIVE</v-chip>
              <v-col cols="12" class="pa-0">
                <v-chip-group class="pa-0" active-class="primary--text" column>
                  <v-chip outlined color="primary"
                          v-for="tag in results[0].tags"
                          :key="tag"
                          :to="{name: 'search-query', query: {q: tag}}">
                    {{ tag }}
                  </v-chip>
                </v-chip-group>
              </v-col>
            </v-col>
          </v-row>
        </v-card>
        <description-card :descriptions="results[0].description"/>
      </v-col>
      <v-col order="2" cols="4">
        <related-card :id="results[0].id"></related-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
  import utils from '../../utils/utils'
  import RelatedCard from '../../components/Player/RelatedCard.vue'
  import DescriptionCard from '../../components/Player/DescriptionCard.vue'
  import { mapGetters } from 'vuex'
  export default {
    components: {
      RelatedCard,
      DescriptionCard
    },
    computed: {
      ...mapGetters({
        AudioPlayerData: 'getAudioPlayerData',
        VideoDialog: 'getVideoDialog'
      }),
    },
    watchQuery: true,
    mounted () {
    },
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
    watch: {
      VideoDialog (val) {
        if (!val) {
          this.$store.commit('showBottomSheet', true);
        }
      }
    },
    async asyncData({params, $axios, store}) {
        let results = await $axios.$get('/api/player', {
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
        if (!store.getters.getVideoDialog){
          store.commit('showBottomSheet', true);
        }
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
        this.$store.commit('showVideoDialog', true);
        this.$store.commit('showBottomSheet', false);
      }
    }
  }
</script>
<style scoped>
  .imgOverlay {
    overflow-y: unset;
  }
</style>
