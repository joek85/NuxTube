import axios from 'axios'

export default {
  async searchSuggestion (text) {
    return await axios.get('/api/Search/suggestions', {
      params: {q: text}
    })
  },
  async fetchHistory (date) {
    return await axios.get('/api/history', {
      params: {date: date}
    })
  },
  async removeHistoryItem (ids) {
    return await axios.get('/api/history/remove', {
      params: {ids: ids}
    })
  }
}
