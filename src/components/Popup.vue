<template>
  <v-dialog 
    max-width="600px" 
    v-model="showPopup"
    persistent
    class="ma-0"
  >

    <v-card>
      <v-card-text>
        <v-form ref="form">
          <v-text-field
            placeholder="Title"
            name="title"
            type="text"
            v-model="title"
            :rules="inputRules"
            id="title"
            required
          />

          <v-textarea
            placeholder="Description"
            name="description"
            type="text"
            v-model="description"
            :rules="inputRules"
            id="description"
            required
          />

          <v-menu>
            <template v-slot:activator="{ on }">
              <v-layout 
                column 
                align-start
              >
                <v-flex shrink>
                  <v-text-field 
                    v-on="on" 
                    placeholder="Deadline" 
                    append-outer-icon="mdi-calendar-range"
                    :rules="inputRules"
                    :value="formattedDate"
                    id="deadline"
                  />
                </v-flex>
              </v-layout>
              
            </template>
            <v-date-picker v-model="deadline"></v-date-picker>
          </v-menu>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
          color="red"
          text
          @click="updatePopup"
        >
          Cancel
        </v-btn>

        <v-btn
          color="green darken-1"
          text
          @click="submit"
          :loading="isSubmitting"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>

  </v-dialog>
</template>

<script>
  import format from 'date-fns/format'
  import {mapActions, mapGetters} from 'vuex';

  export default {
    data() {
      return {
        dialog: false,
        title: "",
        description: "",
        deadline: "",
        isSubmitting: false,
        inputRules: [
          v => !!v || 'This field is required'
        ]
      }
    },
    computed: {
      ...mapGetters([
        'showPopup'
      ]),
      formattedDate() {
        return this.deadline ? format(this.deadline, 'Do MMM YYYY') : ''
      }
    },
    methods: {
      updatePopup(){
        this.dialog = false;
        this.$store.dispatch('updatePopup', {showPopup: this.dialog});
        this.reset();
      },
      // clearData(){
      //   this.title = "";
      //   this.description = "";
      //   this.deadline = "";
      // },
      reset() {
        this.$refs.form.reset();
      },
      submit() {
        if(this.$refs.form.validate()){
          this.isSubmitting = true;

          const todo = {
            name: this.title,
            description: this.description,
            deadline: format(this.deadline, 'Do MMM YYYY')
          };

          this.$store.dispatch('createNewTodo', todo)
            .then((e) => {
              this.isSubmitting = false;
              this.updatePopup();
            })
            .catch((error) => {
              this.isSubmitting = false;
              this.updatePopup();
              console.log(error);
            });
        }
      }
    }
  }
</script>
