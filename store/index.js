export const state = () => ({
  AudioPlayerData: {},
  showBottomSheet: false,
  SearchResults: [],
  showVideoDialog: false,
  videoFullScreen: false,
  windowSize: 0
});

export const mutations = {
  setAudioPlayerData(state, data ) {
    state.AudioPlayerData = data
  },
  showBottomSheet (state, show) {
    state.showBottomSheet = show
  },
  setSearchResults (state, results){
    state.SearchResults = results
  },
  showVideoDialog (state, show) {
    state.showVideoDialog = show
  },
  setVideoFullScreen (state, fullscreen) {
    state.videoFullScreen = fullscreen
  },
  setWindowSize (state, size) {
    state.windowSize = size
  }
};

export const getters = {
  getAudioPlayerData (state) {
    return state.AudioPlayerData
  },
  getBottomSheet (state) {
    return state.showBottomSheet
  },
  getSearchResults (state) {
    return state.SearchResults
  },
  getVideoDialog (state) {
    return state.showVideoDialog
  },
  getVideoFullScreen (state) {
    return state.videoFullScreen
  },
  getWindowSize (state) {
    return state.windowSize
  }
};

export const actions = {
  storeSearchResults ({commit}, s) {
    commit('setSearchResults', s)
  }
};
