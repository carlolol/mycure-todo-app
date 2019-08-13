<template>
  <v-content>
    <v-container fluid>

      <v-row
        align="center"
        justify="center"
      >

        <v-col
          cols="12"
          sm="8"
          md="4"
        >

          <v-card elevation="5">

            <v-toolbar
              color="primary"
              dark
              flat
            >

              <v-toolbar-title class="ml-n3">

                <v-btn 
                  fab
                  text
                  small
                  router
                  to="/"
                >
                  <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
                Create an Account
              </v-toolbar-title>

            </v-toolbar>

            <v-card-text class="pb-0">

              <v-form ref="form">

                <v-text-field
                  label="Username"
                  name="username"
                  prepend-icon="mdi-account"
                  type="text"
                  v-model="username"
                  :rules="usernameRules"
                >
                </v-text-field>

                <v-text-field
                  id="password"
                  label="Password"
                  name="password"
                  prepend-icon="mdi-lock"
                  type="password"
                  v-model="password"
                  :rules="passwordRules"
                >
                </v-text-field>

              </v-form>
              
            </v-card-text>
            
            <v-card-actions class="pb-7">

              <v-spacer></v-spacer>

              <v-btn 
                rounded 
                color="primary"
                class="px-8"
                @click="validate"
                :loading="isSubmitting"
              >
                Sign Up
              </v-btn>

            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex';

  export default {
    props: {
      
    },
    data: () => ({
      username: "",
      password: "",
      dummyDomain: "@test.email",
      usernameRules: [
        v => !!v || 'Username is required',
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => (v && v.length > 5) || 'Password length must be greater than 5 characters'
      ],
      isSubmitting: false
    }),
    methods: {
      validate () {
        if (this.$refs.form.validate()) {
          this.isSubmitting = true;

          const user = {
            username: this.username + this.dummyDomain,
            password: this.password
          };
          
          this.$store.dispatch('signUpAction', user)
            .then(() => {
              this.isSubmitting = false;
              this.$router.push('/');
            })
            .catch((error) => {
              this.isSubmitting = false;
              console.log(error)
            });

          // auth.createUserWithEmailAndPassword(this.username + this.dummyDomain, this.password).then((e) => {
          //   console.log('User creation success');
          //   this.isSubmitting= false;
          //   this.$router.push('/');
          // }).catch((error) => {
          //   // Handle Errors here.
          //   var errorCode = error.code;
          //   var errorMessage = error.message;
            
          //   console.log(errorCode, errorMessage);
          //   this.isSubmitting= false;
          //   // ...
          // });
        }
      }
    }
  }
</script>