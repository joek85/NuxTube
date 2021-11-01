import axios from 'axios'

export default {
  async searchsuggestion (text) {
    return await axios.get('/api/Search/suggestions', {
      params: {q: text}
    })
  }
}
