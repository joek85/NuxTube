export const state = () => ({
  AudioPlayerData: {},
  showBottomSheet: false,
  SearchQuery: '',
  showVideoDialog: false,
  videoFullScreen: false,
  windowSize: 0,
  toggle_view: 0
});

export const mutations = {
  setAudioPlayerData(state, data ) {
    state.AudioPlayerData = data
  },
  showBottomSheet (state, show) {
    state.showBottomSheet = show
  },
  setSearchQuery (state, query){
    state.SearchQuery = query
  },
  showVideoDialog (state, show) {
    state.showVideoDialog = show
  },
  setVideoFullScreen (state, fullscreen) {
    state.videoFullScreen = fullscreen
  },
  setWindowSize (state, size) {
    state.windowSize = size
  },
  setToggle_view (state, toggle) {
    state.toggle_view = toggle
  }
};

export const getters = {
  getAudioPlayerData (state) {
    return state.AudioPlayerData
  },
  getBottomSheet (state) {
    return state.showBottomSheet
  },
  getSearchQuery (state) {
    return state.SearchQuery
  },
  getVideoDialog (state) {
    return state.showVideoDialog
  },
  getVideoFullScreen (state) {
    return state.videoFullScreen
  },
  getWindowSize (state) {
    return state.windowSize
  },
  getToggle_view (state) {
    return state.toggle_view
  }
};

export const actions = {
  storeSearchQuery ({commit}, query) {
    commit('setSearchQuery', query)
  },
  storeToggle_view ({commit}, toggle) {
    commit('setToggle_view', toggle)
  }
};
