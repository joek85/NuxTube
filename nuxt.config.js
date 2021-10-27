import colors from 'vuetify/es5/util/colors'

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - NuxTube',
    title: 'NuxTube',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  target: 'server',
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/vue-youtube.js',
    {src:'~/plugins/vue-plyr.js', mode: 'client'}
  ],
  loading: {
    color: '#673ab7',
    height: '4px',
    continuous: false
  },
  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
  ],
  serverMiddleware: {
    '/api': '~/api'
  },
  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          // primary: colors.red.darken2,
          // accent: colors.grey.darken3,
          // secondary: colors.amber.darken3,
          // info: colors.teal.lighten1,
          // warning: colors.amber.base,
          // error: colors.deepOrange.accent4,
          // success: colors.green.accent3
          primary: '#f44336',
          secondary: '#673ab7',
          accent: '#464646',
          error: '#ff9800',
          warning: '#ff5722',
          info: '#4caf50',
          success: '#8bc34a'
        },
        light: {
          primary: '#f44336',
          secondary: '#673ab7',
          accent: '#464646',
          error: '#ff9800',
          warning: '#ff5722',
          info: '#4caf50',
          success: '#8bc34a'
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
  router: {
    routes: [
      {
        path: '/',
        component: 'pages/index.vue',
        name: 'index',
        children: [
          {
            path: '',
            component: 'pages/player/index.vue',
            name: 'player',
          },
          {
            path: ':id',
            component: 'pages/player/_id.vue',
            name: 'player-id'
          },
          {
            path: '',
            component: 'pages/channel/index.vue',
            name: 'channel',
          },
          {
            path: ':id',
            component: 'pages/channel/_id.vue',
            name: 'channel-id'
          },
          {
            path: '',
            component: 'pages/playlist/index.vue',
            name: 'channel',
          },
          {
            path: ':id',
            component: 'pages/playlist/_id.vue',
            name: 'playlist-id'
          }
        ]
      },

    ]
  }

}
