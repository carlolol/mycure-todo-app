<template>
  <v-content>
    <v-container fluid>

      <v-row
        align="center"
        justify="center"
      >

        <v-col
          cols="10"
          sm="7"
          md="5"
          lg="4"
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
                  @click="goBack()"
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
                  @keyup.enter="validate"
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
                  @keyup.enter="validate"
                >
                </v-text-field>

              </v-form>

              <p 
                class="my-2 pl-5 red--text caption"
                v-if="hasError"
              >
                {{ errorMessage }}
              </p>
              
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
      isSubmitting: false,
      hasError: false,
      errorMessage: ""
    }),
    methods: {
      goBack() {
        this.$router.go(-1);
      },
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
              this.hasError = false;
              this.errorMessage = "";
              this.$router.push('/');
            })
            .catch((error) => {
              this.isSubmitting = false;
              this.hasError = true;
              this.errorMessage = error;
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