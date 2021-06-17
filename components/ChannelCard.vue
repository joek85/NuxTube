<template>
  <v-row justify="space-around">
    <v-col cols="12">
      <v-card class="elevation-0 pa-2">
        <v-row>
          <v-col cols="12" sm="2">
            <v-card-title class="pa-2 align-center justify-center align-content-center">
              <NuxtLink :to="{name: 'channel-id', params: {id: data.channelID } }">
                <v-avatar size="96"
                          class="">
                  <v-img :src="data.bestAvatar.url"></v-img>
                </v-avatar>
              </NuxtLink>
            </v-card-title>

          </v-col>
          <v-col cols="12" sm="10" class="pa-0">
            <NuxtLink :to="{name: 'channel-id', params: {id: data.channelID } }">
                <v-card-title class="headline pa-1">{{data.name}}</v-card-title>
            </NuxtLink>
            <v-toolbar-title class="grey--text pa-1">{{data.subscribers + ' - ' + data.videos + ' videos'}}</v-toolbar-title>
            <v-toolbar-title class="pa-1">{{data.descriptionShort}}</v-toolbar-title>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>

</template>

<script>
    export default {
        props: {
            data: Object
        },
        data () {
            return {}
        },
        watch: {
        },
        created () {

        },
        mounted () {
        },
        methods: {

        },
        computed: {

        }
    }
</script>
