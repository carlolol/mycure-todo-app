<template>
  <nav>
    <v-snackbar 
      v-model="snackbar" 
      :timeout="4000" 
      top 
      color="success"
    >
      <span>Account created successfully.</span>
      <v-btn 
        fab 
        text 
        x-small 
        @click="snackbar = false"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>

    <v-toolbar class="elevation-0">
      <v-toolbar-title>MyCure Todo App</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-menu offset-y>

        <template v-slot:activator="{ on }">
          <v-btn 
            color="grey" 
            text v-on="on" 
            v-show="user"
            :loading="isSigningOut"
            fab
          >
            <v-icon>mdi-chevron-down</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item 
            @click.stop="updatePopup(true)"
          >
            <v-icon left>mdi-pencil-plus-outline</v-icon>
            <span>New Note</span>
          </v-list-item>

          <v-list-item 
            @click="signOut"
          >
            <v-icon left>mdi-exit-to-app</v-icon>
            <span>Sign Out</span>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar>
    <Popup/>
  </nav>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex';
  import Popup from '@/components/Popup'

  export default {
    components: {
      Popup
    },
    data: () => ({
      snackbar: false,
      isSigningOut: false
    }),
    computed: {
      // isUserLoggedIn() {
      //   return !!this.$store.getters.user
      // }
      ...mapGetters([
        'user'
      ])
    },
    methods: {
      signOut(){
        this.isSigningOut = true;

        this.$store.dispatch('signOutAction')
          .then(() => {
            this.isSigningOut = false;
            this.$router.push('/');
          })
          .catch((error) => {
            this.isSigningOut = false;
            console.log(error)
          });
      },
      updatePopup(showPopup){
        this.$store.dispatch('updatePopup', {showPopup: showPopup})
      }
    }
  };
</script>
