<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      temporary
      app
    >
      <v-card color="red" tile class=" pa-2" height="140">
        <v-card-title class="justify-center pa-0 pt-4">
          <v-avatar
            color="secondary"
            size="68"
          ></v-avatar>
        </v-card-title>
          <v-card-title class=" justify-center pa-1">NUXTUBE</v-card-title>
      </v-card>
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      app
      dark
      color="primary">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <h3 class="pa-2">{{title}}</h3>
        <v-row class="d-flex justify-center">
          <v-col cols="6" class="">
            <v-form @submit="doSearch" class="mt-5">
                <v-text-field
                  class=""
                  label="Search..."
                  append-icon="mdi-magnify"
                  color="secondary"
                  v-model="searchQuery"
                ></v-text-field>
            </v-form>
          </v-col>
        </v-row>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
      <v-footer app color="transparent" class="pa-0" v-if="showBottomSheet">
        <transition name="bottom-sheet-transition">
          <div class="v-dialog v-bottom-sheet v-dialog--active v-dialog--persistent">
            <AudioPlayer></AudioPlayer>
          </div>
        </transition>
      </v-footer>
  </v-app>
</template>

<script>
  import AudioPlayer from '../components/AudioPlayer.vue'
  import { mapState, mapGetters } from 'vuex'
export default {
  components: {
    AudioPlayer,
  },
  data () {
    return {
      clipped: true,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Home',
          to: '/'
        },
        {
          icon: 'mdi-history',
          title: 'History',
          to: '/history'
        }
      ],
      miniVariant: false,
      title: 'NuxTube',
      searchQuery: '',
    }
  },
  methods: {
    doSearch (event) {
      event.preventDefault();
      if (this.searchQuery.length > 0){
        this.$router.push({name: 'search', query: {q: this.searchQuery}});
      }
    }
  },
  computed: mapGetters({
    showBottomSheet: 'getBottomSheet'
  }),

}
</script>
