<template>
  <v-app dark :style="{background: $vuetify.theme.themes[theme].background}">
    <v-app-bar app dark clipped-left color="primary">
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
              <!-- <template v-slot:selection="">
               <div>{{ getInputText.text }}</div>
              </template> -->
            </v-autocomplete>

            <!-- <v-menu
              offset-y
              transition="slide-y-transition"
              max-height="400px"
              rounded="b-xl"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-on="on"
                  class=""
                  flat
                  solo-inverted
                  hide-details
                  single-line
                  append-icon=""
                  placeholder="Search..."
                  :value="getInputText"
                  @input="onChange"
                ></v-text-field>
              </template>
              <v-list light class="pa-2">
                <v-list-item-group
                  v-model="selectedItem"
                  @change="searchlistClick"
                >
                  <v-list-item link v-for="(item, i) in searchItems" :key="i">
                    <v-list-item-title v-html="item.text"></v-list-item-title>
                    <v-divider></v-divider>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-menu> -->
          </v-form>
        </v-col>
      </v-row>
      <v-row class="d-flex justify-end">
        <v-switch v-model="$vuetify.theme.dark" inset light color="indigo"></v-switch>
      </v-row>
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
    <v-footer app color="transparent" class="pa-0" v-if="getBottomSheet" fixed>
      <transition name="bottom-sheet-transition">
        <v-col
          cols="12"
          class="
            v-dialog v-bottom-sheet
            v-dialog--active v-dialog--persistent
            pa-0
          "
        >
          <AudioPlayer></AudioPlayer>
        </v-col>
      </transition>
    </v-footer>
  </v-app>
</template>

<script>
import AudioPlayer from "../components/AudioPlayer.vue";
import VideoPlayer from "../components/VideoPlayer.vue";
import SuggestionService from "../services/service";
import { mapState, mapGetters } from "vuex";
export default {
  components: {
    AudioPlayer,
    VideoPlayer,
  },
  mounted() {
    window.addEventListener("resize", this.resizeEventHandler);
    this.setWindowSize();
    this.$root.$on("SnackBar", (param) => {
      this.snackbarColor = param.color;
      this.snackbarText = param.text;
      this.snackbar = true;
    });
  },
  fetchOnServer: false,
  data() {
    return {
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
          to: "/",
        },
        {
          icon: "mdi-history",
          title: "History",
          to: "/history",
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
     theme(){
      return (this.$vuetify.theme.dark) ? 'dark' : 'light'
    }
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
  margin: 24px;
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
