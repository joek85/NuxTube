<template>
  <v-col cols="12" class="pa-0">
    <v-card class="pa-0" tile @keydown.left="rewind" @keydown.right="forward">
      <v-slider
        class="pa-0 ml-3 mr-3"
        v-model="sliderValue"
        hide-details
        dense
        thumb-label
        :max="getSliderMax"
        @change="SliderChange"
        @mousedown="SliderMouseDown"
        @mouseup="SliderMouseUp"
      >
        <template v-slot:thumb-label="item">
          {{ convertTimeHHMMSS(item.value) }}
        </template>
      </v-slider>
      <v-list-item class="pa-0" two-line>
        <v-sheet elevation="0" class="ma-2" width="96">
          <NuxtLink
            class="subheading"
            :to="{ name: 'player', query: { id: videoId } }"
          >
            <v-img
              aspect-ratio="1.7"
              :src="AudioPlayerData.thumbnail"
              style="border-radius: 10%"
            >
            </v-img>
          </NuxtLink>
        </v-sheet>
        <v-list-item-content>
          <v-list-item-title>{{ AudioPlayerData.title }}</v-list-item-title>
          <v-list-item-subtitle>{{
            AudioPlayerData.subtitle
          }}</v-list-item-subtitle>
        </v-list-item-content>
        <!-- 
          <v-card
            id="my-peak-meter"
            elevation="4"
            color="primary"
            class=""
            width="196"
          ></v-card> -->

        <v-list-item-action class="ma-0 mr-2">
          <v-list-item-action-text>
            <v-card-title class="subtitle-1 pa-0 d-flex flex-column">{{
              getAudioDuration
            }}</v-card-title>
            <v-btn icon @click="toggleRepeat">
              <v-icon v-if="getRepeat">mdi-repeat-once</v-icon>
              <v-icon v-else>mdi-repeat</v-icon>
            </v-btn>
            <v-btn
              v-if="IsPlaylist || IsMix"
              icon
              @click="SkipBackward"
              :disabled="isBackwardDiabled"
            >
              <v-icon>mdi-skip-backward</v-icon>
            </v-btn>
            <v-btn icon @click="rewind">
              <v-icon>mdi-rewind</v-icon>
            </v-btn>

            <v-btn icon @click="togglePlaying" :loading="isLoading">
              <v-icon>{{ onbtnPlayChange }}</v-icon>
            </v-btn>

            <v-btn icon @click="forward">
              <v-icon>mdi-fast-forward</v-icon>
            </v-btn>

            <v-btn
              v-if="IsPlaylist || IsMix"
              icon
              @click="SkipForward"
              :disabled="isForwardDisabled"
            >
              <v-icon>mdi-skip-forward</v-icon>
            </v-btn>
          </v-list-item-action-text>
        </v-list-item-action>
      </v-list-item>
    </v-card>
  </v-col>
</template>
<script>
import { mapMutations, mapGetters } from "vuex";
let webAudioPeakMeter = require("web-audio-peak-meter");
export default {
  components: {},
  computed: {
    ...mapGetters({
      AudioPlayerData: "getAudioPlayerData",
      IsPlaylist: "getIsPlaylist",
      PlaylistInfo: "getPlaylistInfo",
      PlaylistIndex: "getPlaylistIndex",
      ChapterDurations: "getChapterDurations",
      selected: "getChapterSelectedItem",
      IsMix: "getIsMix",
      MixInfo: "getMixInfo",
      MixIndex: "getMixIndex",
    }),
    onbtnPlayChange() {
      return this.btns[0].btnPlay;
    },
    isLoading() {
      return this.loading;
    },
    getSliderMax() {
      return this.sliderMax;
    },
    getSliderValue() {
      return this.sliderValue;
    },
    getAudioDuration() {
      return this.audio
        ? this.convertTimeHHMMSS(this.Audioduration) +
            " / " +
            this.convertTimeHHMMSS(this.audio.duration)
        : "-- / --";
    },
    getRepeat() {
      return this.isRepeat;
    },
    isBackwardDiabled() {
      if (this.IsPlaylist) {
        return this.PlaylistIndex <= 0;
      } else if (this.IsMix) {
        return this.MixIndex <= 0;
      }
    },
    isForwardDisabled() {
      if (this.IsPlaylist) {
        return this.PlaylistIndex >= this.PlaylistInfo.PlaylistLength - 1;
      } else if (this.IsMix) {
        return this.MixIndex >= this.MixInfo.MixLength - 1;
      }
    },
  },
  data() {
    return {
      audio: null,
      audioCtx: null,
      btns: [
        {
          btnPlay: "mdi-play",
          btnRepeat: "repeat",
          btnMute: "volume_up",
        },
      ],
      videoId: "",
      loading: true,
      sliderMax: 0,
      sliderUpdate: true,
      sliderValue: 0,
      Audioduration: 0,
      isRepeat: false,
    };
  },
  fetchOnServer: false,

  mounted() {
    this.$root.$on("seek", (param) => {
      this.Seek(param.time);
    });
    this.setupAudio();
    if (this.AudioPlayerData.isLive) {
      this.fetchLiveAudio(this.AudioPlayerData.url);
    } else {
      this.audio.src = this.AudioPlayerData.url;
    }
    this.videoId = this.AudioPlayerData.id;
  },
  destroyed() {
    this.removeAudioEventListinners();
    this.audio.src = null;
    this.audio = null;
  },
  watch: {
    AudioPlayerData(val) {
      if (val.id !== this.videoId) {
        if (val.isLive) {
          this.videoId = val.id;
          this.fetchLiveAudio(val.url);
        } else {
          this.audio.src = val.url;
          this.loading = true;
          this.videoId = val.id;
        }
      }
    },
  },
  fetchOnServer: false,
  methods: {
    async fetchLiveAudio(url) {
      this.loading = true;
      const audioUrl = await this.$axios.$get("/api/player/live", {
        params: {
          videoId: url
        },
      });
      //console.log(audioUrl)
      this.audio.src = audioUrl;
    },
    setupAudio() {
      this.audio = new Audio();
      this.audio.autoplay = true;
      this.audio.playsinline = true;
      this.audio.crossorigin = "anonymous";
      this.setupAudioEventListinners();

      // var myMeterElement = document.getElementById("my-peak-meter");
      // this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      // var sourceNode = this.audioCtx.createMediaElementSource(this.audio);

      // sourceNode.connect(this.audioCtx.destination);
      // var meterNode = webAudioPeakMeter.createMeterNode(sourceNode, this.audioCtx);
      // webAudioPeakMeter.createMeter(myMeterElement, meterNode, {});
    },
    setupAudioEventListinners() {
      this.audio.addEventListener("error", this.onAudioError);
      this.audio.addEventListener("play", this.onAudioPlay);
      this.audio.addEventListener("pause", this.onAudioPause);
      this.audio.addEventListener("abort", this.onAudioPause);
      this.audio.addEventListener("progress", this.onAudioProgress);
      this.audio.addEventListener("durationchange", this.onAudioDurationChange);
      this.audio.addEventListener("timeupdate", this.onAudioTimeUpdate);
      this.audio.addEventListener("volumechange", this.onAudioVolumeChange);
      this.audio.addEventListener("ended", this.onAudioEnded);
      this.audio.addEventListener("loadstart", this.onloadstart);
      this.audio.addEventListener("loadeddata", this.onloadeddata);
      this.audio.addEventListener("waiting", this.onwaitingdata);
      this.audio.addEventListener("playing", this.onPlaying);
    },
    removeAudioEventListinners() {
      this.audio.removeEventListener("error", this.onAudioError);
      this.audio.removeEventListener("play", this.onAudioPlay);
      this.audio.removeEventListener("pause", this.onAudioPause);
      this.audio.removeEventListener("abort", this.onAudioPause);
      this.audio.removeEventListener("progress", this.onAudioProgress);
      this.audio.removeEventListener(
        "durationchange",
        this.onAudioDurationChange
      );
      this.audio.removeEventListener("timeupdate", this.onAudioTimeUpdate);
      this.audio.removeEventListener("volumechange", this.onAudioVolumeChange);
      this.audio.removeEventListener("ended", this.onAudioEnded);
      this.audio.removeEventListener("loadstart", this.onloadstart);
      this.audio.removeEventListener("loadeddata", this.onloadeddata);
      this.audio.removeEventListener("waiting", this.onwaitingdata);
      this.audio.removeEventListener("playing", this.onPlaying);
    },
    onPlaying() {
      this.loading = false;
    },
    onAudioPlay() {
      this.btns[0].btnPlay = "mdi-pause";
      //        this.crossFadeIn(this.audios.activeAudio);
      //        this.crossFadeOut(this.audios.preId);

      //      webAudioPeakMeter.Start()
      //      this.audios.activeAudio++
      //      console.log(this.audios.activeAudio)
      //      this.removeAudioEventListinners(this.audios.activeAudio)
      //      // this.audios.activeAudio = (this.audios.activeAudio ? 0 : 1)
      //      console.log(this.audios.activeAudio)
      //      this.crossFadeOut()
      // this.audioCtx.resume();
    },
    onAudioError(err) {
      this.loading = false;
      console.log(err);
    },
    onAudioPause() {
      // this.isPlaying = false
      this.btns[0].btnPlay = "mdi-play";
      // webAudioPeakMeter.Stop()
    },
    onloadstart() {
      // this.isPlaying = false
      // console.log('onloadstart')
      // webAudioPeakMeter.Stop()
    },
    onloadeddata() {},
    onAudioDurationChange() {
      if (!isNaN(this.audio.duration)) {
        this.sliderMax = this.audio.duration;
      }
    },
    onAudioProgress() {
      //      if (this.audio.buffered.length) {
      //        this.playStat.loadedTime = this.audio.buffered.end(this.audio.buffered.length - 1)
      //      } else {
      //        this.playStat.loadedTime = 0
      //      }
    },
    onAudioTimeUpdate() {
      //        this.audios.Audioduration = this.convertTimeHHMMSS(this.audios.audioB[this.audios.activeAudio].currentTime);
      ////        if (this.audios.audioB[this.audios.activeAudio].currentTime === (this.audios.audioB[this.audios.activeAudio].duration -10.0)){
      ////        }
      this.Audioduration = this.audio.currentTime;
      if (this.sliderUpdate) {
        this.sliderValue = this.audio.currentTime;
      }
      // var lower = this.ChapterDurations[this.selected];
      // var upper = this.ChapterDurations[this.selected + 1];

      // var between = this.ChapterDurations.filter( function(item, i, arr) {
      //   return arr[i]
      // });
      // console.log(this.selected)
      // console.log((between))
      // console.log(this.convertTimeHHMMSS(this.Audioduration))
    },
    onAudioVolumeChange() {
      //      this.volume = this.audioB[this.audios.activeAudio].volume
    },
    onAudioEnded() {
      this.btns[0].btnPlay = "mdi-play";
      this.sliderValue = 0;
      if (this.getRepeat) {
        this.play();
      } else if (this.IsPlaylist || this.IsMix) {
        this.SkipForward();
      } else {
        this.$root.$emit("audioEnded", {});
      }
    },
    onwaitingdata() {
      this.loading = true;
    },
    rewind() {
      this.audio.currentTime -= 5;
    },
    forward() {
      this.audio.currentTime += 5;
    },
    togglePlaying() {
      if (!this.audio.paused) {
        this.pause();
      } else {
        this.play();
      }
    },
    toggleRepeat() {
      this.isRepeat = !this.isRepeat;
    },
    play() {
      this.audio.play();
    },
    pause() {
      this.audio.pause();
    },
    convertTimeHHMMSS(val) {
      if (!isNaN(val)) {
        let hhmmss = new Date(val * 1000).toISOString().substr(11, 8);
        return hhmmss.indexOf("00:") === 0 ? hhmmss.substr(3) : hhmmss;
      }
      return "";
    },
    SliderMouseDown() {
      this.sliderUpdate = false;
    },
    SliderMouseUp() {
      this.sliderUpdate = true;
    },
    SliderChange(val) {
      if (isNaN(this.audio.duration)) {
      } else {
        this.audio.currentTime = val;
      }
    },
    Seek(time) {
      if (this.audio) this.audio.currentTime = time;
    },
    SkipBackward() {
      if (this.IsPlaylist) {
        if (Number(this.PlaylistIndex) - 1 >= 0) {
          this.$root.$emit("SkipPlaylist", Number(this.PlaylistIndex) - 1);
        }
      } else if (this.IsMix) {
        if (Number(this.MixIndex) - 1 >= 0) {
          this.$root.$emit("SkipMix", Number(this.MixIndex) - 1);
        }
      }
    },
    SkipForward() {
      if (this.IsPlaylist) {
        if (
          Number(this.PlaylistIndex) + 1 <=
          this.PlaylistInfo.PlaylistLength - 1
        ) {
          this.$root.$emit("SkipPlaylist", Number(this.PlaylistIndex) + 1);
        }
      } else if (this.IsMix) {
        if (Number(this.MixIndex) + 1 <= this.MixInfo.MixLength - 1) {
          this.$root.$emit("SkipMix", Number(this.MixIndex) + 1);
        }
      }
    },
  },
};
</script>
<style scoped >
.slider-transition {
  transition: none;
}
</style>
