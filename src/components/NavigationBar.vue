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

      <v-btn 
        text
        @click="signOut"
        :loading="isSigningOut"
        v-show="!!user"
      >
        <span>Sign Out</span>
        <v-icon right>mdi-exit-to-app</v-icon>
      </v-btn>
    </v-toolbar>
  </nav>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex';

  export default {
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

        // auth.signOut().then((e) => {
        //   console.log(auth);
        //   console.log(auth.currentUser);
        //   console.log(auth.currentUser.email);
        //   this.isSigningOut = false;
        //   this.$router.push('/');
        // }).catch((error) => {
        //   var errorCode = error.code;
        //   var errorMessage = error.message;

        //   this.isSigningOut = false;
        //   console.log(errorCode, errorMessage);
        // });
        
        // this.$router.push('/');
      }
    }
  };
</script>
