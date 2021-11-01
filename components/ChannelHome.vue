<template>
  <v-row >
    <v-col cols="12" class=""
           v-for="item in data"
           :key="item.title">
    <component :is="getCardType(item.type)" :type="(item.videos ? item.videos.type : '')" :data="item"/>
    </v-col>
  </v-row>
</template>
<script>

  import ShelfCard from '../components/ShelfCard'
  import ChannelCard from  '../components/ChannelCard.vue'
  import ChannelFeaturedCard from '../components/ChannelFeaturedCard.vue'
  export default {
    components: {
      ShelfCard,
      ChannelCard,
      ChannelFeaturedCard
    },
    props: {
      data: [],
    },
    data() {
      return {

      }
    },
    mounted() {
      // console.log(this.$props.data)
    },
    methods: {
      getCardType (type) {
        switch (type){
          case 'shelf':
            return 'ShelfCard';
          case 'channelVideo':
            return 'ChannelCard';
          case 'channelFeaturedVideos':
            return 'ChannelFeaturedCard'
        }
      },
    }
  }
</script>
