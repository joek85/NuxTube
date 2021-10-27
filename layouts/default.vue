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
      <!--<v-container ref="container">-->
        <nuxt />
        <div class="wrapper__content">
          <div v-if="getShowVideoDialog" v-show="getShowVideoDialog" :class="{'fullscreen': getFullscreen, 'video__content': !getFullscreen}">
            <v-card style="height: inherit">
              <v-toolbar
                dark
                dense
                class="primary ">
                <v-spacer></v-spacer>
                <v-btn icon dark @click="toggleFullScreen">
                  <v-icon>{{`mdi-${iconText}`}}</v-icon>
                </v-btn>
                <v-btn fab icon dark @click="hideVideoDialog">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-toolbar>
              <video-player :videoId="getVideoId"></video-player>

            </v-card>
          </div>
        </div>
      <!--</v-container>-->
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
  mounted () {
    window.addEventListener("resize", this.resizeEventHandler);
    this.setWindowSize()
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
      document.documentElement.classList.remove('overflow-y-hidden');
      this.$store.commit('showVideoDialog', false)

    },
    resizeEventHandler() {
      // console.log(window.innerHeight)
    },
    setWindowSize () {
      this.$store.commit('setWindowSize', window.innerHeight)
    }
  },
  created() {
  },
  destroyed() {
    window.removeEventListener("resize", this.resizeEventHandler);
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

<style lang="css" scoped>
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
    /*background-color: #673ab7;*/
    position: absolute;
    right: 0;
    /*background-color: #673ab7;*/
    margin: 24px;
    width: 20%;
    height: 30%;
    transition: all .5s ease;
    z-index: 999;
  }
  .fullscreen {
    border-radius: 0;
    margin: 0;
    height: 100%;
    position: fixed;
    pointer-events: auto;
    top: 0;
    left: 0;
    transition: .3s cubic-bezier(0.25, 0.8, 0.25, 1);
    width: 100%;
    z-index: inherit;
    box-shadow: 0 11px 15px -7px rgba(0, 0, 0, 0.2), 0 24px 38px 3px rgba(0, 0, 0, 0.14), 0 9px 46px 8px rgba(0, 0, 0, 0.12);
    transform-origin: center center 0;
  }
  .wrapper__content {
    align-items: flex-end;
    display: flex;
    height: 100%;
    justify-content: flex-end;
    left: 0;
    pointer-events: none;
    position: fixed;
    top: 0;
    transition: 0.2s cubic-bezier(0.25, 0.8, 0.25, 1), z-index 1ms;
    width: 100%;
    z-index: 202;
    outline: none;
  }
  .video__content {
    border-radius: 4px;
    margin: 24px;
    overflow-y: auto;
    pointer-events: auto;
    transition: .3s cubic-bezier(0.25, 0.8, 0.25, 1);
    width: 25%;
    z-index: inherit;
    box-shadow: 0 11px 15px -7px rgba(0, 0, 0, 0.2), 0 24px 38px 3px rgba(0, 0, 0, 0.14), 0 9px 46px 8px rgba(0, 0, 0, 0.12);
    transform-origin: center center;
  }
</style>
