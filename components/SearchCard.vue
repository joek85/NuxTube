<template>
  <v-row justify="space-around">
    <v-col cols="12">
      <v-card class="elevation-0 pa-2 grow">
        <v-row>
          <v-col cols="12" sm="2">
            <NuxtLink
              class="subheading"
              :to="{ name: 'player', query: { id: data.id } }"
            >
              <v-img aspect-ratio="1.7" :src="data.bestThumbnail.url">
                <template v-slot:placeholder>
                  <v-row class="fill-height pa-0">
                    <v-col cols="12">
                      <v-skeleton-loader type="image"></v-skeleton-loader>
                    </v-col>
                  </v-row>
                </template>
              </v-img>
            </NuxtLink>
          </v-col>
          <v-col cols="12" sm="10" class="pa-2">
            <h3 class="d-flex justify-space-between">
              <NuxtLink
                class="subheading"
                :to="{ name: 'player', query: { id: data.id } }"
              >
                {{ data.title }}</NuxtLink
              >
              <v-menu bottom left>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn dark icon v-bind="attrs" v-on="on">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item v-for="(item, i) in items" :key="i" link>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </h3>
            <v-card-title class="pa-0 pt-2">
              <NuxtLink
                class="nuxt-link-exact-active"
                :to="{
                  name: 'channel-id',
                  params: { id: data.author.channelID },
                }"
              >
                <v-avatar size="36">
                  <img :src="data.author.bestAvatar.url" />
                </v-avatar>
              </NuxtLink>
              <h5 class="ml-2">
                {{ data.author.name }}
              </h5>
            </v-card-title>
            <v-col class="pl-0">
              <v-chip
                v-if="data.duration"
                class="grey--text"
                outlined
                small
                color="accent"
                >{{ data.duration }}</v-chip
              >
              <v-chip v-if="data.isLive === true" small outlined color="red"
                >LIVE</v-chip
              >
              <v-chip class="grey--text" outlined small color="accent">
                <v-icon>mdi-play</v-icon>
                <span>{{ getPlayCounts(data.views) }}</span>
              </v-chip>
              <v-chip
                v-if="data.uploadedAt"
                class="grey--text"
                outlined
                small
                color="accent"
                >{{ data.uploadedAt }}</v-chip
              >
              <h3 class="subheading pt-2">
                {{ data.description }}
              </h3>
            </v-col>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import utils from "../utils/utils";
export default {
  props: {
    data: Object,
  },
  data() {
    return {
      items: [
        { title: "Click Me" },
        { title: "Click Me" },
        { title: "Click Me" },
        { title: "Click Me 2" },
      ],
    };
  },
  methods: {
    getPlayCounts(nb) {
      return utils.formatNumbers(nb);
    },
  },
};
</script>
<style lang="scss" scoped>
.nuxt-link-exact-active {
  color: transparent;
}
.grow {
  transition: all 0.25s ease-in-out;
}
.grow:hover {
  transform: scale(1.05);
}
</style>
