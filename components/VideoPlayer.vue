<template>
  <!--<youtube :video-id="videoId" ref="youtube" :fitParent="true" resize/>-->
  <v-container style=" height: 90%">

        <!--<vue-plyr :key="videoId" >-->

            <iframe
              style="height: 100%; width: inherit; border: transparent"
              :src="`https://www.youtube.com/embed/${videoId + params}`"
              allowfullscreen
              allowtransparency
              allow="autoplay"
            ></iframe>

        <!--</vue-plyr>-->

  </v-container>

</template>

<script>

  export default {
    components: {

    },
    props: {videoId:''},
    data() {
      return {
        params: '?amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1'
      }
    },
    mounted(){
      if (this.getFullScreen) {
        document.documentElement.classList.add('overflow-y-hidden')
      }
      console.log('video mounted')
    },
    destroyed () {
      console.log('video destoyed')

    },
    unmounted(){
      console.log('video Unmounted')
    },
    methods: {

    },
    computed: {
      player() {
        // return this.$refs.youtube.player
      },
      getFullScreen() {
        return this.$store.getters.getVideoFullScreen
      }
    }
  }
</script>
<style >

  .plyr__video-embed {

    /*width: 44%;*/

  }
  .plyr-video-background {
    background: #673ab7;
  }
</style>

