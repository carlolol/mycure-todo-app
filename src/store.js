import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    status: null,
    error: null,
    message: null,
    todos: [],
    showPopup: false
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
    },
    setMessage(state, message){
      state.message = message
    },
    setTodos(state, todos){
      state.todos = todos
    },
    addNewTodo(state, todo){
      state.todos.push(todo)
    },
    updateTodo(state, changedTodo){
      state.todos.splice(state.todos.findIndex(todo => todo.id === changedTodo.id), 1, changedTodo)
    },
    removeTodo(state, todoId){
      state.todos.splice(state.todos.findIndex(todo => todo.id === todoId), 1)
    },
    setShowPopup(state, showPopup){
      state.showPopup = showPopup
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
            commit('setMessage', 'Sign up success.')
            resolve('Success.')
          })
          .catch((error) => {
            commit('setStatus', 'failed')
            commit('setError', error.message)
            commit('setMessage', null)
            reject('Failed. Reason: ' + error.message)
          })
      })
    },

    signInAction ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('setStatus', 'loading')

        var handleChanges = function(data){
          var todo = data.val();
          todo.id = data.key;
          return todo;
        }

        firebase.auth().signInWithEmailAndPassword(payload.username, payload.password)
          .then((response) => {
            commit('setStatus', 'loading')

            var ref = firebase.database().ref('todo/' + response.user.uid);
            
            ref.on('child_added', (data) => {
              commit('addNewTodo', handleChanges(data));
            });

            ref.on('child_changed', (data) => {
              commit('updateTodo', handleChanges(data));
            });

            ref.on('child_removed', (data) => {
              commit('removeTodo', data.key);
            });

            commit(
              'setUser', 
              {
                uid: response.user.uid,
                username: response.user.email.slice(0, response.user.email.indexOf('@test.test'))
              }
            )
            commit('setStatus', 'success')
            commit('setError', null)
            commit('setMessage', 'Sign in success.')
            resolve('Success.')
            
          })
          .catch((error) => {
            commit('setStatus', 'failed')
            commit('setError', error.message)
            commit('setMessage', null)
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
            commit('setTodos', [])
            commit('setMessage', 'Sign out success.')
            resolve('Success.')
          })
          .catch((error) => {
            commit('setStatus', 'failed')
            commit('setError', error.message)
            commit('setMessage', null)
            reject('Failed. Reason: ' + error.message)
          })
      })
    },

    updatePopup({ commit }, payload){
      commit('setShowPopup', payload.showPopup)
    },

    createNewTodo({ commit }, payload){
      return new Promise((resolve, reject) => {
        var postData = {
          name: payload.name,
          description: payload.description,
          deadline: payload.deadline,
          status: 'uncompleted'
        };

        var ref = firebase.database().ref('todo/' + this.state.user.uid);
        var newPostKey = ref.push().key;

        firebase.database().ref('todo/' + this.state.user.uid + '/' + newPostKey)
          .set(postData)
          .then(() => {
            commit('setStatus', 'success')
            commit('setError', null)
            commit('setMessage', 'Todo creation success.')
            resolve('Success.')
          })
          .catch((error) => {
            commit('setStatus', 'failed')
            commit('setError', error.message)
            commit('setMessage', null)
            reject('Failed. Reason: ' + error.message)
          });


      // var updates = {};
      // updates['/todo/' + this.user.uid + '/' + newPostKey] = postData;

      // Get a key for a new Post.
      // var newPostKey = firebase.database().ref().child('posts').push().key;

      // // Write the new post's data simultaneously in the posts list and the user's post list.
      // var updates = {};
      // updates['/posts/' + newPostKey] = postData;
      // updates['/user-posts/' + uid + '/' + newPostKey] = postData;

      // return firebase.database().ref().update(updates);
      })
    },

    deleteTodo({ commit }, payload){
      return new Promise((resolve, reject) => {
        firebase.database().ref('todo/' + this.state.user.uid + '/' + payload.id).remove()
          .then(() => {
            commit('setStatus', 'success')
            commit('setError', null)
            commit('setMessage', 'Deleted todo successfully.')
            resolve('Success.')
          })
          .catch((error) => {
            commit('setStatus', 'failed')
            commit('setError', error.message)
            commit('setMessage', null)
            reject('Failed. Reason: ' + error.message)
          });
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
    },

    todos (state) {
      return state.todos
    },

    showPopup(state){
      return state.showPopup
    },

    getTodoById: (state) => (id) => {
      return state.todos.find(todo => todo.id === id)
    }

    // authStatus (state) {
    //   return firebase.auth().onAuthStateChanged(function(user) {
    //     if (user) {
    //       // User is signed in.
    //     }
    //   });
    // }
  }
})
