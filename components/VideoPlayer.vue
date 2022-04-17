<template >
  <v-card flat >
    <v-col class="d-flex justify-center flex-column pa-0">
      <vue-plyr :key="videoId" :style="{'height': getHeight}">
        <div class="plyr__video-embed">
          <iframe
            style="border: transparent"
            :src="`https://www.youtube.com/embed/${videoId + params}`"
            allowfullscreen
            allowtransparency
            allow="autoplay"
          ></iframe>
        </div>
      </vue-plyr>
    </v-col>
  </v-card>
</template>

<script>

  export default {
    components: {

    },
    props: {videoId:''},
    data() {
      return {
        height:'',
        params: '?amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1'
      }
    },
    mounted(){
      if (this.getFullScreen) {
        document.documentElement.classList.add('overflow-y-hidden')
      }
    },
    destroyed () {
      console.log('video destoyed')

    },
    methods: {

    },
    computed: {
      getFullScreen() {
        return this.$store.getters.getVideoFullScreen
      },
      getVideoId () {
        return this.$store.getters.getAudioPlayerData.id
      },
      getHeight () {
        return this.getFullScreen ? this.$store.getters.getWindowSize - 64 + 'px' : '100%';
      },
      getIframeHeight () {
        return this.getFullScreen ? this.$store.getters.getWindowSize + 'px' : ''
      }
    }
  }
</script>
<style scoped>
  .plyr {
    height: inherit;
    --plyr-color-main: red;
  }

</style>

