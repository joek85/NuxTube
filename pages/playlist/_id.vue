<template>
  <v-container>
    <v-row>
      <v-col cols="3">
        <v-card>
          <v-img class=""
                 aspect-ratio="1.7"
                 :src="results.bestThumbnail.url">
            <template v-slot:placeholder>
              <v-row class="fill-height">
                <v-col cols="12">
                  <v-skeleton-loader type="image"></v-skeleton-loader>
                </v-col>
              </v-row>
            </template>
          </v-img>
          <v-card-title>
            {{results.title}}
          </v-card-title>
          <v-card-subtitle>
            {{ results.estimatedItemCount}} videos - {{formatViews(results.views)}} views - {{results.lastUpdated}}
          </v-card-subtitle>
        </v-card>
      </v-col>
      <v-col cols="9">
        <v-card>
          <v-row>
            <v-col cols="12" v-for="video in results.items">
              <v-card class="rounded-card mb-1">
                <v-row >
                  <v-col sm="12" md="2">
                    <NuxtLink :to="{name: 'player-id', params: {id: video.id}}">
                      <v-img class="pa-0 ma-1"
                             aspect-ratio="1.7"
                             height="120"
                             :src="video.bestThumbnail.url">
                        <template v-slot:placeholder>
                          <v-row class="fill-height">
                            <v-col cols="12">
                              <v-skeleton-loader type="image"></v-skeleton-loader>
                            </v-col>
                          </v-row>
                        </template>
                      </v-img>
                    </NuxtLink>
                  </v-col>
                  <v-col sm="12" md="9" class="pa-0">
                    <v-card-title>
                      <div class="d-flex justify-space-around">
                        <NuxtLink  class="" :to="{name: 'player-id', params: {id: video.id}}"> {{ video.title }}</NuxtLink>
                        <!--<v-menu bottom left>-->
                          <!--<template v-slot:activator="{ on, attrs }">-->
                            <!--<v-btn dark icon v-bind="attrs" v-on="on">-->
                              <!--<v-icon>mdi-dots-vertical</v-icon>-->
                            <!--</v-btn>-->
                          <!--</template>-->
                          <!--<v-list>-->
                            <!--<v-list-item v-for="(item, i) in items" :key="i" link>-->
                              <!--<v-list-item-title>{{ item.title }}</v-list-item-title>-->
                            <!--</v-list-item>-->
                          <!--</v-list>-->
                        <!--</v-menu>-->
                      </div>
                    </v-card-title>
                    <v-card-title class="pt-0">
                      <NuxtLink class="nuxt-link-exact-active" :to="{name: 'channel-id', params: {id: video.author.channelID } }">
                        <h5 class="ml-2">
                          {{ video.author.name }}
                        </h5>
                      </NuxtLink>

                    </v-card-title>
                    <v-card-title class="pt-0">
                      <v-chip v-if="video.duration" class="grey--text" outlined small color="accent">{{video.duration}}</v-chip>
                    </v-card-title>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import utils from '../../utils/utils'
  import MediaCard from '../../components/MediaCardRelatedHorizontal.vue'
  export default {
    components: {
      MediaCard
    },
    data () {
      return {
      }
    },
    async asyncData({params, $axios, store}) {
      const results = await $axios.$get('/api/playlist', {
        params: {
          playlistId: params.id
        }
      });
      return { results }
    },
    methods: {
      formatViews (viewCount){
        return utils.formatNumbers(viewCount)
      }
    },
    computed: {

    }
  }
</script>
