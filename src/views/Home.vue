<template>
  <v-content>
    <v-row 
      justify="center"
      align="center"
    >
      <v-col 
        cols="10" 
        md="6"
        align-self="center"
        class="pb-0"
      >
      </v-col>
    </v-row>
      

    <v-container 
      fluid
      class="pt-0"
    >
      <v-row 
        justify="center"
        align="center"
      >
        <v-col
          v-for="todo in todos"
          :key="todo.id"
          align-self="center"
          cols="12"
          sm="8"
          md="4"
        >
          <v-card
            class="px-2 py-0 ma-0"
            outlined
          >
            <v-toolbar
              color="white"
              flat
              class="subtitle-1"
            >
              <v-toolbar-title>
                {{ todo.name }}
              </v-toolbar-title>

              <v-spacer></v-spacer>

              <v-tooltip bottom>
                
                <template v-slot:activator="{ on }">
                  <v-btn 
                    fab
                    text
                    x-small
                    @click.stop="updateIsEdit(true, todo.id)"
                    v-on="on"
                  >
                    <v-icon>mdi-pencil-outline</v-icon>
                  </v-btn>
                </template>

                <span>Edit</span>
              </v-tooltip>

              <v-tooltip bottom>

                <template v-slot:activator="{ on }">
                  <v-btn 
                    fab
                    text
                    x-small
                    color="orange"
                    @click.stop="deleteTodo(todo.id)"
                    :loading="isLoading"
                    v-on="on"
                  >
                    <v-icon>mdi-trash-can-outline</v-icon>
                  </v-btn>
                </template>
                
                <span>Delete</span>
              </v-tooltip>

            </v-toolbar>

            <v-divider class="my-0"></v-divider>

            <v-card-text class="body-2">
              {{ todo.description }}
            </v-card-text>

            <v-card-actions class="pb-0">

              <v-chip 
                small 
                outlined
                color="warning"
              >
                <v-icon 
                  small 
                  left
                >
                  mdi-timer
                </v-icon>
                {{ formatDate(todo.deadline) }}
              </v-chip>

              <v-spacer></v-spacer>

              <v-chip 
                small 
                :color="getColor(todo.status)" 
                class="white--text caption my-2"
                @click="updateTodoStatus(todo.id, todo.status==='uncompleted' ? 'completed' : 'uncompleted')"
              >
                {{ todo.status }}
              </v-chip>

            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
  import format from 'date-fns/format'
  import {mapActions, mapGetters} from 'vuex';

  export default {

    data: () => ({
      showMoreOptions: false,
      isLoading: false
    }),

    computed: {

      ...mapGetters([
        'todos',
        'getTodoById'
      ])

    },

    methods: {

      getColor: (status) => {
        return status==="completed" ? "#4caf50" : "#f37125";
      },

      formatDate(date){
        return format(date, 'MMM D, YYYY')
      },

      updatePopup(showPopup){
        this.$store.dispatch('updatePopup', {showPopup: showPopup})
      },
      
      updateIsEdit(isEdit, id){
        this.$store.dispatch('updateIsEdit', {isEdit: isEdit, id: id});
        this.updatePopup(isEdit);
      },

      deleteTodo(id) {
        this.isLoading = true;

        this.$store.dispatch('deleteTodo', {id: id})
          .then((e) => {
            this.isLoading = false;
          })
          .catch((error) => {
            this.isLoading = false;
          })
      },

      updateTodoStatus(id, status) {
        this.$store.dispatch('updateTodoStatus', {id: id, status: status})
          .then((e) => {
            
          })
          .catch((error) => {
            console.log(error)
          })
      }

    }
  };
</script>
