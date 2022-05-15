export const state = () => ({
  AudioPlayerData: {},
  PlayerPlaylist: {},
  showBottomSheet: false,
  SearchQuery: '',
  showVideoDialog: false,
  videoFullScreen: false,
  windowSize: 0,
  toggle_view: 0,
  isPlaylist: false,
  PlaylistIndex: 0,
  PlaylistInfo: { id: '', PlaylistLength: 0 },
  SearchContinuation: { clickTrackingParams: '', token: '' },
  ChapterSelectedItem: 0,
  ChapterDurations: [],
  DownloadInfos: {},
  isDownloading: false,
  downloads: [],
  rendering: {
    started: false,
    ended: false,
    progress: 0
  },
  MixInfo: { listId: '', MixLength: 0 },
  MixIndex: 0,
  isMix: false,
});

export const mutations = {
  setAudioPlayerData(state, data) {
    state.AudioPlayerData = data
  },
  showBottomSheet(state, show) {
    state.showBottomSheet = show
  },
  setSearchQuery(state, query) {
    state.SearchQuery = query
  },
  showVideoDialog(state, show) {
    state.showVideoDialog = show
  },
  setVideoFullScreen(state, fullscreen) {
    state.videoFullScreen = fullscreen
  },
  setWindowSize(state, size) {
    state.windowSize = size
  },
  setToggle_view(state, toggle) {
    state.toggle_view = toggle
  },
  setPlayerPlaylist(state, playlist) {
    state.PlayerPlaylist = playlist
  },
  setIsPlaylist(state, isPlaylist) {
    state.isPlaylist = isPlaylist
  },
  setPlaylistInfo(state, info) {
    state.PlaylistInfo = info
  },
  setPlaylistIndex(state, index) {
    state.PlaylistIndex = index
  },
  setSearchContinuation(state, continuation) {
    state.SearchContinuation = continuation
  },
  setChapterSelectedItem(state, ChapterSelectedItem) {
    state.ChapterSelectedItem = ChapterSelectedItem
  },
  setChapterDurations(state, ChapterDurations) {
    state.ChapterDurations = ChapterDurations
  },
  setDownloadInfos(state, infos) {
    state.DownloadInfos = infos
  },
  SOCKET_download_start(state, { starttime, uid }) {
    state.isDownloading = true
    state.downloads.push({
      stateTime: starttime,
      uid: uid,
      progress: {},
      infos: state.DownloadInfos
    })
  },
  SOCKET_download_end(state) {
    state.isDownloading = false
  },
  SOCKET_download_error(state, error) {
    state.isDownloading = false
  },
  SOCKET_download_progress(state, progress) {
    let obj = state.downloads.find(x => x.uid === progress.uid);
    let index = state.downloads.indexOf(obj);
    state.downloads[index].progress = progress
  },
  SOCKET_rendering_start(state) {
    state.rendering.started = true
  },
  SOCKET_rendering_progress(state, progress) {
    state.rendering.progress = progress
  },
  SOCKET_rendering_end(state) {
    state.rendering.ended = true
    state.rendering.started = false
  },
  setMixInfo(state, info) {
    state.MixInfo = info
  },
  setMixIndex(state, index) {
    state.MixIndex = index
  },
  setIsMix(state, isMix) {
    state.isMix = isMix
  },
};

export const getters = {
  getAudioPlayerData(state) {
    return state.AudioPlayerData
  },
  getBottomSheet(state) {
    return state.showBottomSheet
  },
  getSearchQuery(state) {
    return state.SearchQuery
  },
  getVideoDialog(state) {
    return state.showVideoDialog
  },
  getVideoFullScreen(state) {
    return state.videoFullScreen
  },
  getWindowSize(state) {
    return state.windowSize
  },
  getToggle_view(state) {
    return state.toggle_view
  },
  getPlayerPlaylist(state) {
    return state.PlayerPlaylist
  },
  getIsPlaylist(state) {
    return state.isPlaylist
  },
  getPlaylistInfo(state) {
    return state.PlaylistInfo
  },
  getPlaylistIndex(state) {
    return state.PlaylistIndex
  },
  getSearchContinuation(state) {
    return state.SearchContinuation
  },
  getChapterSelectedItem(state) {
    return state.ChapterSelectedItem
  },
  getChapterDurations(state) {
    return state.ChapterDurations
  },
  getDownloadInfos(state) {
    return state.DownloadInfos
  },
  getisDownloading(state) {
    return state.isDownloading
  },
  getDownloads(state) {
    return state.downloads
  },
  getRendering(state) {
    return state.rendering
  },
  getIsMix(state) {
    return state.isMix
  },
  getMixInfo(state) {
    return state.MixInfo
  },
  getMixIndex(state) {
    return state.MixIndex
  },
};

export const actions = {
  storeSearchQuery({ commit }, query) {
    commit('setSearchQuery', query)
  },
  storeToggle_view({ commit }, toggle) {
    commit('setToggle_view', toggle)
  },
};
