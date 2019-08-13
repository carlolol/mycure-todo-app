import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/database';

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

var firebaseConfig = {
  apiKey: "AIzaSyD9TCU5Z4x8AFOnZqXaeLik1jlffuUMbv0",
  authDomain: "mycure-todo-app-8d626.firebaseapp.com",
  databaseURL: "https://mycure-todo-app-8d626.firebaseio.com",
  projectId: "mycure-todo-app-8d626",
  storageBucket: "",
  messagingSenderId: "992016582609",
  appId: "1:992016582609:web:eac95b48823c7e19"
};
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const database = firebase.database();