<template>
  <v-expansion-panels class="mb-2" flat>
    <v-expansion-panel>
      <v-expansion-panel-header class="text-uppercase font-weight-bold">
        Chapters
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-list max-height="400" style="overflow-y: auto">
          <v-list-item-group v-model="selected">
            <template v-for="(item, index) in chapters">
              <v-list-item
                :key="item.start_time"
                @click="GoToChapter(item.start_time)"
              >
                <v-list-item-icon v-if="$vuetify.breakpoint.xlOnly">
                  <v-img width="96" height="56" :src="thumbnail">
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
                  <v-list-item-subtitle class="font-weight-bold pt-2">
                    <a v-html="convertTime(item.start_time)"></a>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-divider :key="index"></v-divider>
            </template>
          </v-list-item-group>
        </v-list>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
<script>
import utils from "../../utils/utils";
import { mapMutations, mapGetters } from "vuex";

export default {
  props: {
    chapters: [],
    thumbnail: "",
  },
  mounted() {
    this.$store.commit(
      "setChapterDurations",
      this.$props.chapters.map((c) => {
        return c.start_time;
      })
    );
  },
  data() {
    return {
      selected: 0
    };
  },
  computed: {
    // ...mapGetters({
    //   selected: "getChapterSelectedItem",
    // }),
    getSelected() {
      return this.selected
    }
  },
  methods: {
    convertTime(time) {
      return utils.convertTime(time);
    },
    GoToChapter(time) {
      this.$root.$emit("seek", { time: time });
      this.$store.commit("setChapterSelectedItem", this.getSelected)
    },
  },
};
</script>