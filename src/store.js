import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    status: null,
    error: null
  },
  mutations: {
    setUser(state, user){
      state.user = user
    },
    removeUser(state){
      state.user = null
    },
    setStatus(state, status){
      state.status = status
    },
    setError(state, error){
      state.error = error
    }
  },
  actions: {
    signUpAction ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('setStatus', 'loading')
        firebase.auth().createUserWithEmailAndPassword(payload.username, payload.password)
          .then((response) => {
            commit('setUser', null)
            commit('setStatus', 'success')
            commit('setError', null)
            resolve('Success.')
          })
          .catch((error) => {
            commit('setStatus', 'failed')
            commit('setError', error.message)
            reject('Failed. Reason: ' + error.message)
          })
      })
    },

    signInAction ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('setStatus', 'loading')
        firebase.auth().signInWithEmailAndPassword(payload.username, payload.password)
          .then((response) => {
            commit(
              'setUser', 
              {
                uid: response.user.uid,
                username: response.user.email.slice(0, response.user.email.indexOf('@test.test'))
              }
            )
            commit('setStatus', 'success')
            commit('setError', null)
            resolve('Success.')
          })
          .catch((error) => {
            commit('setStatus', 'failed')
            commit('setError', error.message)
            reject('Failed. Reason: ' + error.message)
          })
      })
    },

    signOutAction ({ commit }) {
      return new Promise((resolve, reject) => {
        firebase.auth().signOut()
          .then(() => {
            commit('setUser', null)
            commit('setStatus', 'success')
            commit('setError', null)
            resolve('Success.')
          })
          .catch((error) => {
            commit('setStatus', 'failed')
            commit('setError', error.message)
            reject('Failed. Reason: ' + error.message)
          })
      })
    }
  },

  getters: {

    status (state) {
      return state.status
    },

    user (state) {
      return state.user
    },

    error (state) {
      return state.error
    }
  }
})
