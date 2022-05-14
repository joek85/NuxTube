<template>
  <div class="pa-2">
    <v-card class="pa-2 mb-4" flat>
      <v-file-input
        v-model="files"
        show-size
        accept="audio/*, video/*"
        prepend-icon="mdi-folder"
        flat
        @change="onFilePicked"
      >
        <template v-slot:selection="{ text }">
          <v-chip color="secondary" label>
            {{ text }}
          </v-chip>
        </template>
      </v-file-input>
    </v-card>
    <v-card flat class="mb-4">
      <v-row>
        <v-col cols="12" sm="3">
          <v-card-title class="display-1">{{ getTime }}</v-card-title>
          <v-card-text class="body-1">{{ totalDuration }}</v-card-text>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card-actions class="">
            <v-btn :disabled="!ready" icon @click="skipBackward">
              <v-icon>mdi-skip-backward</v-icon>
            </v-btn>
            <v-btn :disabled="!ready" icon large @click="Backward">
              <v-icon>mdi-rewind</v-icon>
            </v-btn>

            <v-btn :disabled="!ready" icon @click="togglePlaying" large>
              <v-icon>{{ onbtnPlayChange }}</v-icon>
            </v-btn>

            <v-btn :disabled="!ready" icon large @click="Forward">
              <v-icon>mdi-fast-forward</v-icon>
            </v-btn>
            <v-btn :disabled="!ready" icon @click="skipForward">
              <v-icon>mdi-skip-forward</v-icon>
            </v-btn>
          </v-card-actions>
        </v-col>
        <v-col cols="12" sm="5">
          <v-row class="pa-4">
            <v-card flat class="">
              <v-card-text class="body-1 pa-1">Start</v-card-text>
              <v-card-title class="subtitle-1 pa-1">{{
                regionStart == 0 ? "-" : regionStart
              }}</v-card-title>
            </v-card>
            <v-card flat>
              <v-card-text class="body-1 pa-1">End</v-card-text>
              <v-card-title class="subtitle-1 pa-1">{{
                regionEnd == 0 ? "-" : regionEnd
              }}</v-card-title>
            </v-card>
            <v-card flat>
              <v-card-text class="body-1 pa-1">Duration</v-card-text>
              <v-card-title class="subtitle-1 pa-1">{{
                regionDuration == 0 ? "-" : regionDuration
              }}</v-card-title>
            </v-card>
          </v-row>
          <v-card-actions class="pa-0">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="secondary"
                  v-bind="attrs"
                  v-on="on"
                  icon
                  :disabled="!selected"
                  @click="removeRegion()"
                >
                  <v-icon>mdi-selection-off</v-icon>
                </v-btn>
              </template>
              <span>Remove Region</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  :disabled="!selected"
                  color="secondary"
                  v-bind="attrs"
                  v-on="on"
                  icon
                  @click="playregion(false)"
                >
                  <v-icon>mdi-play-box-outline</v-icon>
                </v-btn>
              </template>
              <span>Play Selected Region</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  :disabled="!selected"
                  color="secondary"
                  v-bind="attrs"
                  v-on="on"
                  icon
                  @click="playregion(true)"
                >
                  <v-icon>mdi-play-box-multiple-outline</v-icon>
                </v-btn>
              </template>
              <span>Play Selected Region In Loop</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  v-bind="attrs"
                  v-on="on"
                  icon
                  @click="zoomIn()"
                >
                  <v-icon>mdi-magnify-plus</v-icon>
                </v-btn>
              </template>
              <span>Zoom In</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  v-bind="attrs"
                  v-on="on"
                  icon
                  @click="zoomOut()"
                >
                  <v-icon>mdi-magnify-minus</v-icon>
                </v-btn>
              </template>
              <span>Zoom Out</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  v-bind="attrs"
                  v-on="on"
                  icon
                  @click="resetZoom()"
                >
                  <v-icon>mdi-magnify</v-icon>
                </v-btn>
              </template>
              <span>Zoom Reset</span>
            </v-tooltip>
            <v-spacer></v-spacer>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  :disabled="!ready"
                  color="primary"
                  v-bind="attrs"
                  v-on="on"
                  icon
                  @click="dialog = true"
                >
                  <v-icon>mdi-content-save-outline</v-icon>
                </v-btn>
              </template>
              <span>Export</span>
            </v-tooltip>
          </v-card-actions>
        </v-col>
      </v-row>
    </v-card>
    <v-card flat>
      <v-row>
        <!-- <v-col cols="1"> -->
        <!-- <v-card
            id="my-peak-meter"
            elevation="4"
            class=""
            height="500"
          ></v-card> -->
        <!-- </v-col> -->
        <v-col cols="12">
          <v-card flat>
            <v-card-title v-if="isLoading" class="d-flex justify-center">
              <v-progress-circular
                class=""
                indeterminate
                color="primary"
              ></v-progress-circular>
            </v-card-title>
            <div ref="timeline" id="timeline"></div>
            <div ref="waveform" id="waveform"></div>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
    <v-dialog v-model="dialog" persistent width="500">
      <v-card>
        <v-toolbar rounded dark dense class="primary pa-0">
          <v-card-title class="pa-0"> Export </v-card-title>
        </v-toolbar>
        <v-card class="pa-4" flat>
          <v-card-title class="pa-0 mb-4">{{
            file ? file.name : ""
          }}</v-card-title>
          <v-divider></v-divider>
          <v-card-subtitle class="pa-0 ml-1">Format</v-card-subtitle>
          <v-radio-group
            :disabled="rendering.started"
            v-model="format"
            row
            class=""
          >
            <v-radio label="Mp3" value="0"></v-radio>
            <v-radio label="Wav" value="1"></v-radio>
          </v-radio-group>
          <v-radio-group
            :disabled="rendering.started"
            v-model="channels"
            row
            class=""
          >
            <v-radio label="Mono" value="0"></v-radio>
            <v-radio label="Stereo" value="1"></v-radio>
          </v-radio-group>
          <v-divider></v-divider>
          <v-card-subtitle class="pa-0 ml-1">Bitrate</v-card-subtitle>
          <v-radio-group
            :disabled="rendering.started"
            v-model="bitrate"
            row
            class=""
          >
            <v-radio label="128kbps" value="0"></v-radio>
            <v-radio label="196kbps" value="1"></v-radio>
            <v-radio label="256kbps" value="2"></v-radio>
            <v-radio label="320kbps" value="3"></v-radio>
          </v-radio-group>
          <v-divider></v-divider>

          <v-card-subtitle class="pa-0 ml-1">Export type</v-card-subtitle>
          <v-radio-group
            :disabled="rendering.started"
            v-model="exportType"
            row
            class=""
          >
            <v-radio label="Export whole file" value="0"></v-radio>
            <v-radio
              :disabled="!selected"
              label="Export region"
              value="1"
            ></v-radio>
          </v-radio-group>
          <v-divider></v-divider>
        </v-card>
        <v-progress-linear :value="rendering.progress" height="25" striped>
          <strong>{{ Math.ceil(rendering.progress) }}%</strong>
        </v-progress-linear>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            :disabled="rendering.started"
            text
            @click="cancelExport()"
          >
            close
          </v-btn>
          <v-btn
            color="primary"
            :disabled="rendering.started"
            text
            @click="startExport()"
          >
            export
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
// let webAudioPeakMeter = require("web-audio-peak-meter");
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      format: "0",
      channels: "1",
      bitrate: "3",
      exportType: "0",
      dialog: false,
      wavesurfer: null,
      regions: null,
      loading: false,
      ready: false,
      btnPlay: "mdi-play",
      playing: false,
      time: this.convertTimeHHMMSS(0),
      totalDuration: this.convertTimeHHMMSS(0),
      regionStart: 0,
      regionEnd: 0,
      regionDuration: 0,
      selected: false,
      file: null,
      files: [],
      exportProgress: 0,
      audio: null,
      audioCtx: null,
      zoomLevels: [100, 200, 300, 500],
      zoomIndex: 0,
    };
  },
  watch: {},
  mounted() {
    this.initwaveSurfer();
  },
  destroyed() {
    if (this.wavesurfer) this.wavesurfer.destroy();
  },
  methods: {
    async initwaveSurfer() {
      let self = this;
      try {
        const waveSurfer = (await import("wavesurfer.js")).default;
        const timeline = (
          await import("wavesurfer.js/dist/plugin/wavesurfer.timeline")
        ).default;
        const cursor = (
          await import("wavesurfer.js/dist/plugin/wavesurfer.cursor")
        ).default;
        self.regions = (
          await import("wavesurfer.js/dist/plugin/wavesurfer.regions")
        ).default;

        self.wavesurfer = waveSurfer.create({
          container: this.$refs.waveform,
          height: 500,
          responsive: true,
          splitChannels: false,
          regionsMinLength: 5,
          skipLength: 5,
          cursorWidth: 2,
          cursorColor: "#9c27b0",
          progressColor: ["hsla(0, 100%, 50%, 0.0)"],
          waveColor: ["#f44336", "#b71c1c", "#ff8a80", "#d50000"],
          partialRender: true,
          plugins: [
            timeline.create({
              container: this.$refs.timeline,
              height: 25,
              primaryColor: "red",
              secondaryColor: "red",
              primaryFontColor: "red",
              secondaryFontColor: "red",
              fontSize: 14,
              formatTimeCallback: self.formatTimeCallback,
            }),
            self.regions.create({
              color: "hsla(270, 100%, 50%, 0.2)",
              maxRegions: 1,
              id: "region",
              preventContextMenu: true,
              dragSelection: {
                slop: 5,
              },
            }),
          ],
        });
        self.wavesurfer.on("ready", function () {
          self.loading = false;
          self.ready = true;
          self.totalDuration = self.convertTimeHHMMSS(
            self.wavesurfer.getDuration()
          );
        });
        self.wavesurfer.on("loading", function (progress) {});
        self.wavesurfer.on("seek", function () {
          self.time = self.convertTimeHHMMSS(self.wavesurfer.getCurrentTime());
        });
        self.wavesurfer.on("audioprocess", function (t) {
          self.time = self.convertTimeHHMMSS(t);
        });
        self.wavesurfer.on("play", function () {
          self.btnPlay = "mdi-pause";
          self.playing = true;
          //self.audioCtx.resume();
        });
        self.wavesurfer.on("pause", function () {
          self.btnPlay = "mdi-play";
          self.playing = false;
        });
        self.wavesurfer.on("region-created", function () {
          self.selected = true;
        });
        self.wavesurfer.on("region-removed", function () {
          self.selected = false;
          self.regionStart = "-";
          self.regionEnd = "-";
          self.regionDuration = "-";
        });
        self.wavesurfer.on("region-updated", function (region) {
          self.regionStart = self.convertTimeHHMMSS(region.start);
          self.regionEnd = self.convertTimeHHMMSS(region.end);
          self.regionDuration = self.convertTimeHHMMSS(
            region.end - region.start
          );
        });
        self.wavesurfer.on("interaction", function () {
          // self.wavesurfer.regions.clear();
        });
      } catch (error) {
        console.error(error);
      }
    },
    togglePlaying() {
      if (this.playing) {
        this.wavesurfer.pause();
      } else {
        this.wavesurfer.play();
      }
    },
    Backward() {
      this.wavesurfer.skipBackward();
    },
    Forward() {
      this.wavesurfer.skipForward();
    },
    skipBackward() {
      this.wavesurfer.seekTo(0);
    },
    skipForward() {
      this.wavesurfer.seekTo(1);
    },
    formatTimeCallback(seconds, pxPerSec) {
      seconds = Number(seconds);
      var minutes = Math.floor(seconds / 60);
      seconds = seconds % 60;

      // fill up seconds with zeroes
      var secondsStr = Math.round(seconds).toString();
      if (pxPerSec >= 25 * 10) {
        secondsStr = seconds.toFixed(2);
      } else if (pxPerSec >= 25 * 1) {
        secondsStr = seconds.toFixed(1);
      }

      if (minutes > 0) {
        if (seconds < 10) {
          secondsStr = "0" + secondsStr;
        }
        return `0${minutes}:${secondsStr}`;
      }
      return "00:" + secondsStr;
    },
    convertTimeHHMMSS(val) {
      let hhmmss = new Date(val * 1000).toISOString().substr(11, 12);
      return hhmmss.indexOf("00:") === 0 ? hhmmss.substr(3) : hhmmss;
    },
    removeRegion() {
      this.wavesurfer.regions.clear();
    },
    zoomIn() {
      this.wavesurfer.zoom(this.zoomLevels[this.zoomIndex]);
      this.zoomIndex++;
      if (this.zoomIndex > 3) this.zoomIndex = 3;
    },
    zoomOut() {
      this.zoomIndex--;
      if (this.zoomIndex < 0) {
        this.zoomIndex = 0;
        this.wavesurfer.zoom(0);
      } else {
        this.wavesurfer.zoom(this.zoomLevels[this.zoomIndex]);
      }
    },
    resetZoom() {
      this.wavesurfer.zoom(0);
    },
    onFilePicked(f) {
      if (f) {
        this.file = null;
        this.loading = true;
        this.ready = false;
        this.wavesurfer.stop();
        this.wavesurfer.empty();
        this.wavesurfer.destroy();
        this.audio = null;
        this.$nextTick(() => {
          this.initwaveSurfer();
        });
        setTimeout(() => {
          // this.audio = new Audio();
          // this.audio.autoplay = false;

          // this.audio.crossOrigin = "anonymous";
          // this.audio.src = "/media/My Passion/" + e.name;
          this.file = f;
          this.wavesurfer.loadBlob(f);

          // var myMeterElement = document.getElementById("my-peak-meter");
          // this.audioCtx = this.wavesurfer.backend.ac;
          // var sourceNode = this.audioCtx.createMediaElementSource(this.audio);

          // sourceNode.connect(this.audioCtx.destination);
          // var meterNode = webAudioPeakMeter.createMeterNode(
          //   sourceNode,
          //   this.audioCtx
          // );
          // webAudioPeakMeter.createMeter(myMeterElement, meterNode, {});
        }, 500);
      }
    },
    playregion(loop) {
      if (loop == true) {
        this.wavesurfer.regions.list.region.playLoop();
      } else if (loop == false) {
        this.wavesurfer.regions.list.region.play();
      }
    },
    cancelExport() {
      this.dialog = false;
    },
    startExport() {
      this.$axios
        .$get("/api/renderffmpeg", {
          params: {
            fname: this.file.name,
            format: this.getAudioFormats(),
            channels: this.getAudioChannels(),
            bitrate: this.getBitrate(),
            startTime: this.exportType == "0" ? 0 : this.regionStart,
            duration:
              this.exportType == "0" ? this.totalDuration : this.regionDuration,
          },
        })
        .then((response) => {
          console.log(response);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getAudioFormats() {
      switch (this.format) {
        case "0":
          return "mp3";
        case "1":
          return "wav";
        default:
          break;
      }
    },
    getAudioChannels() {
      switch (this.channels) {
        case "0":
          return 1;
        case "1":
          return 2;
        default:
          break;
      }
    },
    getBitrate() {
      switch (this.bitrate) {
        case "0":
          return 128;
        case "1":
          return 196;
        case "2":
          return 256;
        case "3":
          return 320;
        default:
          break;
      }
    },
  },
  computed: {
    ...mapGetters({
      rendering: "getRendering",
    }),
    isLoading() {
      return this.loading;
    },
    onbtnPlayChange() {
      return this.btnPlay;
    },
    getTime() {
      return this.time;
    },
  },
};
</script>

<style>
</style>