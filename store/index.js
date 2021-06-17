export const state = () => ({
  AudioPlayerData: {},
  showBottomSheet: false,
  SearchResults: []
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
  }
};

export const actions = {
  storeSearchResults ({commit}, s) {
    commit('setSearchResults', s)
  }
};
