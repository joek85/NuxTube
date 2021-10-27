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
  export default {
    components: {
      ShelfCard
    },
    props: {
      data: [],
    },
    data() {
      return {

      }
    },
    mounted() {
      console.log(this.$props.data)
    },
    methods: {
      getCardType (type) {
        console.log(type)
        switch (type){
          case 'shelf':
            return 'ShelfCard';
        }
      },
    }
  }
</script>
