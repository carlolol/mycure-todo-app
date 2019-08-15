<template>
  <v-dialog 
    max-width="600px" 
    v-model="showPopup"
    persistent
    class="ma-0"
  >

    <v-card>

      <v-card-title>
        <h5 v-if="showIsEdit">Edit Note</h5>
        <h5 v-else>New Note</h5>
      </v-card-title>

      <v-card-text>
        <v-form ref="form">
          <v-text-field
            placeholder="Title"
            name="title"
            type="text"
            v-model="titleValue"
            :rules="inputRules"
          />

          <v-textarea
            placeholder="Description"
            name="description"
            type="text"
            v-model="descriptionValue"
            :rules="inputRules"
          />

          <v-menu >
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
                    v-model="deadline"
                    readonly
                    v-if="deadline"
                  />
                  <v-text-field 
                    v-on="on" 
                    placeholder="Deadline" 
                    append-outer-icon="mdi-calendar-range"
                    :rules="inputRules"
                    :value="deadlineValue"
                    readonly
                    v-else
                  />
                </v-flex>
              </v-layout>
            </template>
            <v-date-picker 
              v-model="deadline" 
              no-title
              v-if="deadline"
            ></v-date-picker>
            <v-date-picker 
              v-model="deadlineValue" 
              no-title
              v-else
            ></v-date-picker>
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
  // import format from 'date-fns/format'
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
        'showPopup',
        'showIsEdit',
        'idToShow',
        'getTodoById'
      ]),

      // formattedDate() {
      //   return this.deadline ? format(this.deadline, 'MMM D, YYYY') : ''
      // },

      titleValue: {
        get(){
          return this.showIsEdit ? this.getTodoById(this.idToShow).name : this.title
        },
        set(value){
          this.title = value
        }
      },

      descriptionValue: {
        get(){
          // console.log('getting: ' + this.description)
          return this.showIsEdit ? this.getTodoById(this.idToShow).description : this.description
        },
        set(value){
          // console.log('before updating: ' + this.description)
          // console.log('value: ' + value)
          this.description = value
          // console.log('after updating: ' + this.description)
        }
      },

      deadlineValue: {
        get(){
          // console.log('getting: ' + this.deadline)
          // this.showIsEdit ? console.log('gotten from VueX') : console.log('gotten locally')
          return this.showIsEdit ? this.getTodoById(this.idToShow).deadline : this.deadline

          // console.log('current value: ' + this.deadline)
          // if(this.showIsEdit){
          //   console.log('First parse: ' + Date.parse(this.getTodoById(this.idToShow).deadline))
          //   console.log('Second parse: ' + Date.UTC(0, 0, 0, 0, 0, 0, Date.parse(this.getTodoById(this.idToShow).deadline)))
          //   console.log('Third parse: ' + Date(Date.UTC(0, 0, 0, 0, 0, 0, Date.parse(this.getTodoById(this.idToShow).deadline))))
          //   console.log('Manual format: ' + format(Date(Date.UTC(0, 0, 0, 0, 0, 0, Date.parse(this.getTodoById(this.idToShow).deadline))), 'YYYY-MM-DD'))
          //   console.log('Formatted function: ' + this.formattedDate)
          // }
          
          // this.showIsEdit ? this.updateDeadline(format(Date(Date.UTC(0, 0, 0, 0, 0, 0, Date.parse(this.getTodoById(this.idToShow).deadline))), 'YYYY-MM-DD')) : null
          // return this.showIsEdit ? 
          //   format(Date(Date.UTC(0, 0, 0, 0, 0, 0, Date.parse(this.getTodoById(this.idToShow).deadline))), 'YYYY-MM-DD') : 
          //   this.deadline
        },
        set(value){
          // console.log('before updating: ' + this.deadline)
          // console.log('value: ' + value)
          this.deadline = value
          // console.log('after updating: ' + this.deadline)
        }
      }

    },
    
    methods: {
      
      // updateDeadline(value){
      //   this.deadline = value
      // },

      updatePopup(){
        this.dialog = false;
        this.$store.dispatch('updatePopup', {showPopup: this.dialog});
        this.$store.dispatch('updateIsEdit', {showPopup: this.dialog});
        this.reset();
      },

      reset() {
        this.deadline="";
        this.$refs.form.reset();
      },

      submit() {
        if(this.$refs.form.validate()){
          this.isSubmitting = true;
          const todo = {
            name: this.title,
            description: this.description,
            deadline: this.deadline,
            status: this.showIsEdit ? this.getTodoById(this.idToShow).status : 'uncompleted',
            id: this.idToShow
            // deadline: format(this.deadline, 'MMM D, YYYY')
          };

          this.$store.dispatch(this.showIsEdit ? 'updateTodo' : 'createNewTodo', todo)
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
