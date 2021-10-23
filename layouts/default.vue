<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      temporary
      app
    >
      <v-card color="red" tile class=" pa-2" height="140">
        <v-card-title class="justify-center pa-0 pt-4">
          <v-avatar
            color="secondary"
            size="68"
          ></v-avatar>
        </v-card-title>
          <v-card-title class=" justify-center pa-1">NUXTUBE</v-card-title>
      </v-card>
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      app
      dark
      color="primary">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <h3 class="pa-2">{{title}}</h3>
        <v-row class="d-flex justify-center">
          <v-col cols="6" class="">
            <v-form @submit="doSearch" class="mt-5">
                <v-text-field
                  class=""
                  label="Search..."
                  append-icon="mdi-magnify"
                  color="secondary"
                  v-model="searchQuery"
                ></v-text-field>
            </v-form>
          </v-col>
        </v-row>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <nuxt />
        <div style="">
          <transition name="slide">
            <div v-if="getShowVideoDialog" v-show="getShowVideoDialog" :class="{'fullscreen': getFullscreen, 'miniscreen': !getFullscreen}" >
              <!--<v-col style="">-->
                <v-sheet
                  dark
                  rounded="t-xl"
                  class="primary text-right">
                  <v-btn icon dark @click="toggleFullScreen">
                    <v-icon>{{`mdi-${iconText}`}}</v-icon>
                  </v-btn>
                  <v-btn fab icon dark @click="hideVideoDialog">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-sheet>
                <v-card class="" style=" height: 90%">

                  <VideoPlayer :videoId="getVideoId"/>
                </v-card>
              <!--</v-col>-->

            </div>
          </transition>
        </div>

      </v-container>
    </v-main>
      <v-footer app color="transparent" class="pa-0" v-if="getBottomSheet" fixed>
        <transition name="bottom-sheet-transition">
          <div class="v-dialog v-bottom-sheet v-dialog--active v-dialog--persistent">
            <AudioPlayer></AudioPlayer>
          </div>
        </transition>
      </v-footer>
  </v-app>
</template>

<script>
  import AudioPlayer from '../components/AudioPlayer.vue'
  import VideoPlayer from '../components/VideoPlayer.vue'

  import { mapState, mapGetters } from 'vuex'
export default {
  components: {
    AudioPlayer,
    VideoPlayer
  },
  data () {
    return {
      clipped: true,
      drawer: false,
      fixed: false,
      fullscreen: false,
      iconText: 'fullscreen',
      items: [
        {
          icon: 'mdi-apps',
          title: 'Home',
          to: '/'
        },
        {
          icon: 'mdi-history',
          title: 'History',
          to: '/history'
        }
      ],
      miniVariant: false,
      title: 'NuxTube',
      searchQuery: '',
    }
  },
  methods: {
    doSearch (event) {
      event.preventDefault();
      if (this.searchQuery.length > 0){
        this.$router.push({name: 'search', query: {q: this.searchQuery}});
      }
    },
    toggleFullScreen (event) {
      event.preventDefault();
      this.fullscreen =! this.fullscreen;
      if (this.fullscreen) {
        this.iconText = 'fullscreen-exit';
        document.documentElement.classList.add('overflow-y-hidden')
      }else{
        this.iconText = 'fullscreen';
        document.documentElement.classList.remove('overflow-y-hidden')
      }
      this.$store.commit('setVideoFullScreen', this.fullscreen)
    },
    hideVideoDialog () {
      document.documentElement.classList.remove('overflow-y-hidden')
      this.$store.commit('showVideoDialog', false)
    },
  },
  computed: {
    getBottomSheet () {
      return this.$store.getters.getBottomSheet
    },
    getFullscreen () {
      return this.fullscreen
    },
    getShowVideoDialog () {
      return this.$store.getters.getVideoDialog
    },
    getVideoId () {
      return this.$store.getters.getAudioPlayerData.id
    },
  },

}
</script>

<style scoped>
  /*>>>.v-dialog:not(.v-dialog--fullscreen){*/
    /*width: 25%;*/
    /*height: 25%;*/
    /*bottom: 0 !important;*/
    /*right: 0 !important;*/
    /*position: absolute !important;*/
  /*}*/
  .slide-enter-active,
  .fslide-leave-active {
    transition: transform 0.5s;
  }

  .slide-enter,
  .slide-leave-to {
    transform: translateY(100vh);
  }

  .slide-enter-to,
  .slide-leave {
    transform: translateY(0);
  }
  .miniscreen {
    width: 25%;
    height: 30%;
    right: 0;
    bottom: 0;
    position: fixed;
    transition: all .5s ease;
    z-index: 999;
  }
  .fullscreen {
    width: 100%;
    height: 100%;
    bottom: 0;
    right: 0;
    position: fixed;
    transition: all .5s ease;
    z-index: 999;
  }
</style>
