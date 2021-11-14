<template>
  <v-card tile @keydown.left="rewind" @keydown.right="forward">
    <v-slider
      class="pb-0 ml-3 mr-3"
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
    <v-list class="pa-0">
      <v-list-item>
        <v-sheet elevation="5" class="ma-2" width="96">
          <v-img aspect-ratio="1.7" :src="AudioPlayerData.thumbnail"> </v-img>
        </v-sheet>
        <v-list-item-content>
          <v-list-item-title>{{ AudioPlayerData.title }}</v-list-item-title>
          <v-list-item-subtitle>{{
            AudioPlayerData.subtitle
          }}</v-list-item-subtitle>
        </v-list-item-content>

        <v-spacer></v-spacer>
        <v-card-title class="subtitle-1">{{ getAudioDuration }}</v-card-title>
        <v-list-item-icon>
          <v-btn icon>
            <v-icon>mdi-repeat</v-icon>
          </v-btn>
        </v-list-item-icon>
        <v-list-item-icon>
          <v-btn icon @click="rewind">
            <v-icon>mdi-rewind</v-icon>
          </v-btn>
        </v-list-item-icon>

        <v-list-item-icon :class="{ 'mx-5': $vuetify.breakpoint.mdAndUp }">
          <v-btn icon @click="togglePlaying" :loading="isLoading">
            <v-icon>{{ onbtnPlayChange }}</v-icon>
          </v-btn>
        </v-list-item-icon>

        <v-list-item-icon
          class="ml-0"
          :class="{ 'mr-3': $vuetify.breakpoint.mdAndUp }"
        >
          <v-btn icon @click="forward">
            <v-icon>mdi-fast-forward</v-icon>
          </v-btn>
        </v-list-item-icon>
      </v-list-item>
    </v-list>
  </v-card>
</template>
<script>
import { mapMutations, mapGetters } from "vuex";
export default {
  components: {},
  computed: {
    ...mapGetters({
      AudioPlayerData: "getAudioPlayerData",
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
  },
  data() {
    return {
      audio: null,
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
    };
  },
  fetchOnServer: false,

  mounted() {
    this.setupAudio();
    this.audio.src = this.AudioPlayerData.url;
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
        this.audio.src = val.url;
        this.loading = true;
        this.videoId = val.id;
      }
    },
  },
  methods: {
    setupAudio() {
      this.audio = new Audio();
      this.audio.autoplay = true;
      this.audio.playsinline = true;
      this.setupAudioEventListinners();
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
    },
    onAudioVolumeChange() {
      //      this.volume = this.audioB[this.audios.activeAudio].volume
    },
    onAudioEnded() {
      this.btns[0].btnPlay = "mdi-play";
      this.sliderValue = 0;
      //        this.hSliderOptions.value = 0;
      //        // console.log('end')
      //        if (this.audios.repeat) {
      //          this.setupAudioEventListinners(this.audios.activeAudio);
      //          this.play()
      //        }else{
      //          if (this.getAutoPlay){
      //            this.$root.$emit('autoplay', '')
      //          }
      //        }
      // webAudioPeakMeter.Stop()
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
  },
};
</script>
<style scoped >
.slider-transition {
  transition: none;
}
</style>
