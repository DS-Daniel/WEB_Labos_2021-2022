import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
   state: {
      currentTrack: null,
      playlist: {
         id: 0,
         tracks: [],
      },
   },
   mutations: {
      setCurrentTrack(state, track) {
         state.currentTrack = track;
      },
      setCurrentPlaylist(state, playlist) {
         if (playlist.id !== state.playlist.id) {
            state.playlist = { id: playlist.id, tracks: playlist.tracks }
         }
      }
   },
})