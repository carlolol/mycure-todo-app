import Vue from 'vue';
import Vuex from 'vuex';
import firebase from 'firebase/app';

Vue.use(Vuex)

export default new Vuex.Store({
  
  state: {
    user: null,
    status: null,
    error: null,
    message: null,
    todos: [],
    showPopup: false,
    isEdit: false,
    idToShow: null
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
    setIdToShow(state, idToShow){
      state.idToShow = idToShow
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
    },
    setIsEdit(state, isEdit){
      state.isEdit = isEdit
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

    updateIsEdit({ commit }, payload){
      commit('setIsEdit', payload.isEdit)
      commit('setIdToShow', payload.id)
    },

    createNewTodo({ commit }, payload){
      return new Promise((resolve, reject) => {
        var postData = {
          name: payload.name,
          description: payload.description,
          deadline: payload.deadline,
          status: payload.status
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
    },

    updateTodo({ commit }, payload){
      return new Promise((resolve, reject) => {
        var postData = {
          name: payload.name,
          description: payload.description,
          deadline: payload.deadline,
          status: payload.status
        };

        firebase.database().ref('todo/' + this.state.user.uid + '/' + payload.id)
          .update(postData)
          .then(() => {
            commit('setStatus', 'success')
            commit('setError', null)
            commit('setMessage', 'Todo update success.')
            resolve('Success.')
          })
          .catch((error) => {
            commit('setStatus', 'failed')
            commit('setError', error.message)
            commit('setMessage', null)
            reject('Failed. Reason: ' + error.message)
          });
      })
    },

    updateTodoStatus({ commit }, payload){
      return new Promise((resolve, reject) => {
        var postData = {
          status: payload.status
        };

        firebase.database().ref('todo/' + this.state.user.uid + '/' + payload.id)
          .update(postData)
          .then(() => {
            commit('setStatus', 'success')
            commit('setError', null)
            commit('setMessage', 'Todo update success.')
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

    showIsEdit(state){
      return state.isEdit
    },

    getTodoById: (state) => (id) => {
      // console.log(state.todos.find(todo => todo.id === id))
      return state.todos.find(todo => todo.id === id)
    },

    idToShow(state){
      return state.idToShow
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
