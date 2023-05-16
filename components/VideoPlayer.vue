<template >
  <v-card flat>
    <!-- <vue-plyr :key="videoId" :style="{'height': getHeight}">
        <div class="plyr__video-embed">
          <iframe
            style="border: transparent"
            :src="`https://www.youtube.com/embed/${videoId + params}`"
            allowfullscreen
            allowtransparency
            allow="autoplay"
          ></iframe>
        </div>
      </vue-plyr> -->
    <vue-plyr ref="plyr">
      <video controls crossorigin playsinline></video>
    </vue-plyr>
  </v-card>
</template>

<script>
export default {
  components: {},
  props: { data: null},
  data() {
    return {
      height: "",
      params:
        "?amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1",
      player: null,
      details: null,
    };
  },
  mounted() {
    this.$store.commit("showBottomSheet", false);

    this.$root.$on("seek", (param) => {
      this.player.currentTime = param.time;
    });
    // if (this.getFullScreen) {
    //   document.documentElement.classList.add('overflow-y-hidden')
    // }
    this.player = this.$refs.plyr.player;
    this.player.on("ready", () => {
     // console.log("ready fired")
    });
    this.player.on("loadstart", () => {
     // console.log("loadstart fired")
    });
    this.player.on("loadeddata", () => {
     // console.log("loadeddata fired")
    });
    this.player.on("canplay", () => {
     // console.log("canplay fired")
      this.player.play()
    });

    // if (this.isVideo == true) {
      this.playYoutube();
    // } else {
    //   this.playAudio();
    // }
  },
  watch: {
    data() {
      this.player.source = null;
      //if (this.isVideo == true) {
        this.playYoutube();
      // } else {
      //   this.playAudio();
      // }
    },
    isVideo(b) {
      this.player.source = null;
      //if (b == true) {
        this.playYoutube();
      // } else {
      //   this.playAudio();
      // }
    },
  },
  destroyed() {
    this.player.destroy();
  },
  methods: {
    playYoutube() {
      this.player.source = {
        type: "video",
        sources: [
          {
            src: this.getData.id,
            provider: "youtube",
          },
        ],
        poster: this.getData.thumbnail,
      };
    },
    playAudio() {
      this.player.source = {
        type: "video",
        sources: [
          {
            src: "http://localhost:8080/" + this.getData.url,
          },
        ],
        poster: this.getData.thumbnail,
      };
    },
  },
  computed: {
    getData() {
      return this.data;
    },
    getFullScreen() {
      return this.$store.getters.getVideoFullScreen;
    },
    getHeight() {
      return this.getFullScreen
        ? this.$store.getters.getWindowSize - 64 + "px"
        : "100%";
    },
    getIframeHeight() {
      return this.getFullScreen ? this.$store.getters.getWindowSize + "px" : "";
    },
  },
};
</script>
<style >
.plyr {
  height: inherit;
  --plyr-color-main: red;
}
</style>

