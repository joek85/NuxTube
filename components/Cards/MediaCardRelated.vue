<template>
  <v-card class="pa-2 grow" flat>
    <v-row>
      <v-col cols="12" xl="4">
        <NuxtLink :to="{ name: 'player', query: { id: videoId } }">
          <v-img class="" aspect-ratio="1.7" :src="thumbnail.url.split('?')[0]">
            <template v-slot:placeholder>
              <v-row class="fill-height">
                <v-col cols="12">
                  <v-skeleton-loader type="image"></v-skeleton-loader>
                </v-col>
              </v-row>
            </template>
          </v-img>
        </NuxtLink>
      </v-col>
      <v-col cols="12" xl="8">
        <v-card class="d-flex" flat tile>
          <v-card-title class="pa-0 subtitle-1" v-snip="{ lines: 2 }">{{
            title
          }}</v-card-title>
          <v-card class="ml-auto" flat tile>
            <v-menu v-if="noMenu === false" bottom left>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(item, i) in items"
                  :key="i"
                  link
                  @click.prevent="menuClick(i)"
                >
                  <v-icon small class="pa-2 pl-0">{{ item.icon }}</v-icon>
                  <v-list-item-title> {{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-card>
        </v-card>
        <v-list-item two-line class="pa-0">
          <v-list-item-avatar v-if="authorThumbnail">
            <NuxtLink
              class="nuxt-link-exact-active"
              :to="{ name: 'channel-id', params: { id: channelId } }"
            >
              <v-avatar size="36">
                <img :src="authorThumbnail.url" />
              </v-avatar>
            </NuxtLink>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ authorName }}</v-list-item-title>
            <v-list-item-subtitle v-if="playCounts"
              >{{ playCounts + " - " + published + " - " + duration }}
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-chip v-if="isLive === true" dark small color="red">LIVE</v-chip>
          </v-list-item-action>
        </v-list-item>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import utils from "../../utils/utils";
export default {
  props: {
    videoId: "",
    thumbnail: "",
    title: "",
    channelId: "",
    authorThumbnail: "",
    authorName: "",
    playCounts: 0,
    published: "",
    duration: 0,
    isLive: false,
    noMenu: false,
  },
  data() {
    return {
      items: [
        { title: "Download", icon: "mdi-cloud-download" },
        { title: "Add to favorite", icon: "mdi-star" },
        { title: "Hide", icon: "mdi-eye-off" },
        { title: "Block", icon: "mdi-cancel" },
      ],
    };
  },
  methods: {
    getPlayCounts(nb) {
      return utils.formatNumbers(nb);
    },
    convertTime(time) {
      return utils.convertTime(time);
    },
    menuClick(index) {
      switch (index) {
        case 0:
          this.$root.$emit("Dialog", { id: this.videoId });
          break;
        case 2:
          this.$root.$emit("hideVideo", this.videoId);
          break;
        case 3:
          this.$root.$emit("blockVideo", this.videoId);
          break;
      }
    },
  },
};
</script>
<style lang="scss">
.grow {
  transition: all 0.25s ease-in-out;
}
.grow:hover {
  transform: scale(1.05);
}
.trunc {
  max-width: 50vw;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
