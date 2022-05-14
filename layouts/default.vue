<template>
  <v-app :style="{ background: $vuetify.theme.themes[theme].background }">
    <v-app-bar app dark clipped-left color="primary" class="">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title @click="$router.push('/')" style="cursor: pointer">{{
        title
      }}</v-toolbar-title>
      <v-row class="d-flex justify-center">
        <v-col cols="12" class="">
          <v-form @submit="doSearch">
            <v-autocomplete
              v-model="model"
              :items="searchItems"
              :search-input.sync="search"
              @change="searchlistClick"
              append-icon=""
              color="accent"
              label="Search..."
              class="mx-4"
              loader-height="12"
              clearable
              flat
              no-filter
              hide-no-data
              hide-details
              solo-inverted
              return-object
              @update:list-index="updateListIndex"
              :menu-props="{ closeOnContentClick: true }"
            >
              <template v-slot:item="{ item }">
                <v-list-item-title v-html="item.text"></v-list-item-title>
                <v-divider></v-divider>
              </template>
            </v-autocomplete>
          </v-form>
        </v-col>
      </v-row>
      <v-spacer></v-spacer>
      <v-menu
        v-model="menu"
        :nudge-width="400"
        offset-y
        transition="slide-y-transition"
        bottom
        :close-on-content-click="false"
      >
        <template v-slot:activator="{ on, attrs }">
          <!-- <v-badge color="secondary" dot offset-x="20" offset-y="20"> -->
            <v-btn class="text-center" icon v-bind="attrs" v-on="on">
              <v-icon>mdi-bell</v-icon>
            </v-btn>
          <!-- </v-badge> -->
        </template>
        <notifications-component/>
      </v-menu>
      <v-btn icon @click="toggleTheme()">
        <v-icon>{{ btnThemeIcon }}</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" app clipped temporary hide-overlay>
      <v-list>
        <v-list-item v-for="(item, i) in items" :key="i" :to="item.to">
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <nuxt />
      <v-dialog class="pa-0" v-model="dialog">
        <template v-slot:default="dialog">
          <v-card class="pa-0" flat min-height="400">
            <v-toolbar color="primary" dark flat dense>
              <v-spacer></v-spacer>
              <v-btn rounded icon dark @click="dialog.value = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
            <div class="text-center pa-0" v-if="loading">
              <v-progress-linear
                indeterminate
                color="secondary"
              ></v-progress-linear>
            </div>
            <component
              v-else
              :is="getComponentType(componentType)"
              :data="componentsData"
            />
            <!-- <download-dialog ></download-dialog> -->
          </v-card>
        </template>
      </v-dialog>
      <div class="wrapper__content">
        <div
          v-if="getShowVideoDialog"
          v-show="getShowVideoDialog"
          :class="{ fullscreen: getFullscreen, video__content: !getFullscreen }"
        >
          <v-card style="height: inherit">
            <v-toolbar dark dense class="primary">
              <v-spacer></v-spacer>
              <v-btn icon dark @click="toggleFullScreen">
                <v-icon>{{ `mdi-${iconText}` }}</v-icon>
              </v-btn>
              <v-btn fab icon dark @click="hideVideoDialog">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
            <video-player :videoId="getVideoId"></video-player>
          </v-card>
        </div>
      </div>
      <v-snackbar
        :timeout="snackbarTimeout"
        :value="snackbar"
        :color="snackbarColor"
        absolute
        right
        rounded="pill"
        top
      >
        {{ snackbarText }}
      </v-snackbar>
    </v-main>
    <v-footer app fixed color="transparent" class="pa-0" v-if="getBottomSheet">
      <v-col cols="12" class="pa-0">
        <AudioPlayer></AudioPlayer>
      </v-col>
    </v-footer>
  </v-app>
</template>

<script>
import AudioPlayer from "../components/AudioPlayer.vue";
import VideoPlayer from "../components/VideoPlayer.vue";
import SuggestionService from "../services/service";
import DownloadDialog from "../components/DownloadDialog.vue";
import NotificationsComponent from "../components/Downloads/DownloadsNotifications.vue";
import PlaylistDialog from "../components/PlaylistDialog.vue";
import { mapState, mapGetters } from "vuex";

export default {
  components: {
    AudioPlayer,
    VideoPlayer,
    DownloadDialog,
    NotificationsComponent,
    PlaylistDialog,
  },
  mounted() {
    window.addEventListener("resize", this.resizeEventHandler);
    this.setWindowSize();

    this.$root.$on("SnackBar", (param) => {
      this.snackbarColor = param.color;
      this.snackbarText = param.text;
      this.snackbar = true;
    });
    this.$root.$on("Dialog", (param) => {
      this.componentType = param.type;
      switch (param.type) {
        case "download":
          if (this.downloadId != param.id) {
            this.downloadId = param.id;
            this.getDownloadInfos(param.id);
          }
          break;
        case "playlist":
          this.componentsData = param;
          break;
      }
      this.dialog = true;
    });
    this.$root.$on("CloseDialog", (param) => {
      this.dialog = false;
    });
  },
  fetchOnServer: false,
  data() {
    return {
      menu: false,
      dialog: false,
      clipped: true,
      drawer: false,
      fixed: false,
      fullscreen: false,
      isOpen: false,
      iconText: "fullscreen",
      items: [
        {
          icon: "mdi-apps",
          title: "Home",
          to: "/trending",
        },
        {
          icon: "mdi-history",
          title: "History",
          to: "/history",
        },
        {
          icon: "mdi-cloud-download",
          title: "Downloads",
          to: "/downloads",
        },
        {
          icon: "mdi-waveform",
          title: "Editor",
          to: "/editor",
        },
      ],
      miniVariant: false,
      title: "NuxTube",
      searchQuery: "",
      inputText: "",
      isOpen: true,
      listS: [],
      isLoading: false,
      selectedItem: null,
      model: null,
      search: null,
      snackbar: false,
      snackbarMode: "vertical",
      snackbarColor: "success",
      snackbarTimeout: 8000,
      snackbarText: "",
      loading: false,
      downloadInfos: "",
      btnThemeIcon: "mdi-weather-night",
      componentType: "",
      componentsData: "",
    };
  },
  watch: {
    search(val) {
      if (!val) return;
      // console.log("search " + val);
      // Items have already been loaded
      // if (this.searchItems.length > 0) return;

      // Items have already been requested
      // if (this.isLoading) return;
      this.searchQuery = val;
      // this.isLoading = true;

      // Lazily load input items
      SuggestionService.searchSuggestion(val)
        .then((res) => {
          this.listS = res.data;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.isLoading = false;
          // this.isOpen = false;
        });
    },
  },
  methods: {
    toggleTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      if (this.$vuetify.theme.dark) {
        this.btnThemeIcon = "mdi-white-balance-sunny";
      } else {
        this.btnThemeIcon = "mdi-weather-night";
      }
    },
    getComponentType(type) {
      switch (type) {
        case "download":
          return "DownloadDialog";
        case "playlist":
          return "PlaylistDialog";
      }
    },
    updateListIndex(i) {
      if (i > -1) {
        // console.log(i);
        this.searchQuery = this.searchItems[i].text;
        // console.log(this.searchQuery);
      }
    },
    doSearch(event) {
      event.preventDefault();

      // console.log("doSearch " + this.searchQuery);
      if (this.searchQuery.length > 0) {
        this.listS = [];
        this.$router.push({
          name: "search-query",
          query: { q: this.searchQuery },
        });
      }
    },
    toggleFullScreen(event) {
      event.preventDefault();
      this.fullscreen = !this.fullscreen;
      if (this.fullscreen) {
        this.iconText = "fullscreen-exit";
        document.documentElement.classList.add("overflow-y-hidden");
      } else {
        this.iconText = "fullscreen";
        document.documentElement.classList.remove("overflow-y-hidden");
      }
      this.$store.commit("setVideoFullScreen", this.fullscreen);
    },
    hideVideoDialog() {
      document.documentElement.classList.remove("overflow-y-hidden");
      this.$store.commit("showVideoDialog", false);
    },
    resizeEventHandler() {
      // console.log(window.innerHeight)
    },
    setWindowSize() {
      this.$store.commit("setWindowSize", window.innerHeight);
    },
    searchlistClick(val) {
      if (val) {
        // console.log(val.text);
        this.$router.push({ name: "search-query", query: { q: val.text } });
      }
    },
    keyd(val) {
      console.log("keyd");
    },
    onChange(val) {
      // if (!val) return;

      this.searchQuery = val;

      // if (this.isLoading) return;

      // this.isLoading = true;
      // this.isOpen = true;
      console.log("onChange = " + val);
      SuggestionService.searchSuggestion(val)
        .then((res) => {
          this.listS = res.data;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.isLoading = false;
          // this.isOpen = false;
        });
    },
    getDownloadInfos(id) {
      this.loading = true;
      this.$axios
        .$get("/api/download", {
          params: {
            id: id,
          },
        })
        .then((response) => {
          this.loading = false;
          this.$store.commit("setDownloadInfos", {
            videoDetails: response.videoDetails,
            formats: response.streamingData.adaptiveFormats,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  created() {},
  destroyed() {
    window.removeEventListener("resize", this.resizeEventHandler);
  },
  computed: {
    getBottomSheet() {
      return this.$store.getters.getBottomSheet;
    },
    getFullscreen() {
      return this.fullscreen;
    },
    getShowVideoDialog() {
      return this.$store.getters.getVideoDialog;
    },
    getVideoId() {
      return this.$store.getters.getAudioPlayerData.id;
    },
    searchItems() {
      return this.listS.map((entry) => {
        const text = entry.text;
        return Object.assign({}, entry, { text });
      });
    },
    getInputText() {
      return this.searchQuery;
    },
    theme() {
      return this.$vuetify.theme.dark ? "dark" : "light";
    },
  },
};
</script>

<style lang="css" scoped>
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
  transition: all 0.5s ease;
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
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  width: 100%;
  z-index: inherit;
  box-shadow: 0 11px 15px -7px rgba(0, 0, 0, 0.2),
    0 24px 38px 3px rgba(0, 0, 0, 0.14), 0 9px 46px 8px rgba(0, 0, 0, 0.12);
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
  margin: 4px;
  overflow-y: auto;
  pointer-events: auto;
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  width: 25%;
  z-index: inherit;
  box-shadow: 0 11px 15px -7px rgba(0, 0, 0, 0.2),
    0 24px 38px 3px rgba(0, 0, 0, 0.14), 0 9px 46px 8px rgba(0, 0, 0, 0.12);
  transform-origin: center center;
}
</style>
