<template>
  <v-card flat>
    <v-card-title class=""> {{ data.title }}</v-card-title>
    <v-slide-group show-arrows>
      <v-slide-item class="ma-2"
                    v-for="(refinement, index) in data.searchRefinments"
                    :key="index">
        <v-card class="pa-2" width="220">
          <v-row>
            <v-col cols="12">
              <NuxtLink class="subheading " :to="{name: 'search-query', query: {q: refinement.query}}">
                <v-img
                  aspect-ratio="1.7"
                  :src="refinement.thumbnail.url">
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
            <v-col cols="12" class="d-flex flex-column justify-space-between">
              <v-card-title class="pa-0 text-wrap">{{refinement.query}}</v-card-title>
            </v-col>
          </v-row>
        </v-card>
      </v-slide-item>
    </v-slide-group>
  </v-card>
</template>

<script>
    export default {
       props: {
         data: ''
       },
      components: {

      }
    }
</script>

<style scoped>

</style>
