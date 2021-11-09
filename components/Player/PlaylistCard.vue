<template>
  <v-card class="mb-6">
    <v-card-title>
      {{ data.title }}
    </v-card-title>
    <v-card-subtitle>
      {{ data.estimatedItemCount }} videos - {{ formatViews(data.views) }} views
      - {{ data.lastUpdated }}
    </v-card-subtitle>

    <v-list max-height="400" style="overflow-y: auto" >
        <v-list-item-group >
            <template v-for="(item, index) in data.items">
        <v-divider :key="index"></v-divider>
        <v-list-item :key="item.title" :to="{name: 'player', query: {id: item.id}}">
          <v-list-item-icon>
              <v-img width="96" height="56" :src="item.bestThumbnail.url">
                <template v-slot:placeholder>
                  <v-row class="fill-height">
                    <v-col cols="12">
                      <v-skeleton-loader type="image"></v-skeleton-loader>
                    </v-col>
                  </v-row>
                </template>
              </v-img>
        
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-html="item.title"></v-list-item-title>
            <v-list-item-subtitle
              v-html="item.author.name"
            ></v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-list-item-action-text
              v-text="item.duration"
            ></v-list-item-action-text>
            <!-- <v-icon color="primary"> mdi-play </v-icon> -->
          </v-list-item-action>
        </v-list-item>
      </template>
        </v-list-item-group>
      
    </v-list>
  </v-card>
</template>
<script>
import utils from "../../utils/utils";
export default {
  props: {
    data: {},
  },
  methods: {
    formatViews(viewCount) {
      return utils.formatNumbers(viewCount);
    },
  },
};
</script>