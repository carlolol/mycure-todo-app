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
              <v-toolbar-title>Login</v-toolbar-title>
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

            <v-card-actions>

              <v-spacer></v-spacer>

              <v-btn 
                rounded 
                color="primary"
                class="px-10"
                @click="validate"
                :loading="isSubmitting"
              >
                Login
              </v-btn>

            </v-card-actions>

            <v-divider class="my-5"></v-divider>

            <div class="text-center">

              <v-card flat>
              
                <v-card-title class="subtitle-1 font-weight-black pt-0">
                  
                  <v-spacer></v-spacer>
                  Don't have an account yet?
                  <v-spacer></v-spacer>

                </v-card-title>

                <v-card-actions>

                  <v-spacer></v-spacer>

                  <v-btn 
                    outlined 
                    rounded
                    class="px-5 mb-5"
                    router
                    to="/signup"
                  >
                    Create an account
                  </v-btn>

                  <v-spacer></v-spacer>

                </v-card-actions>
                
              </v-card>
            </div>

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
        v => !!v || 'Please enter your username',
      ],
      passwordRules: [
        v => !!v || 'Please enter your password',
      ],
      isSubmitting: false
    }),
    computed: {
      ...mapGetters([
        'status',
        'error'
      ])
    },
    methods: {
      validate () {
        if (this.$refs.form.validate()) {
          this.isSubmitting = true;
          
          const user = {
            username: this.username + this.dummyDomain,
            password: this.password
          };
          
          this.$store.dispatch('signInAction', user)
            .then((e) => {
              this.isSubmitting = false;
              this.$router.push('/home');
            })
            .catch((error) => {
              this.isSubmitting = false;
              console.log(error);
            });
        }
      }
    }
  }
</script>