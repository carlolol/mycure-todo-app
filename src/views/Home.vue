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
      <!-- <v-text-field
        label="Title"
        solo
        class="pb-0"
        :v-show="showMoreOptions"
      ></v-text-field>
      <v-text-field
        label="Create New Todo"
        solo
        class="pb-0"
        @click="showMoreOptions=true"
      ></v-text-field> -->
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
          <!-- <v-flex
            lg2
            md3
            sm4
            xs6
          > -->
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
                <v-btn 
                  fab
                  text
                  x-small
                  @click.stop="updatePopup(true)"
                >
                  <v-icon>mdi-pencil-outline</v-icon>
                </v-btn>
                <v-btn 
                  fab
                  text
                  x-small
                  color="orange"
                  @click.stop="deleteTodo(todo.id)"
                  :loading="isLoading"
                >
                  <v-icon>mdi-trash-can-outline</v-icon>
                </v-btn>
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
                  {{ todo.deadline }}
                </v-chip>

                <v-spacer></v-spacer>

                <v-chip 
                  small 
                  :color="getColor(todo.status)" 
                  class="white--text caption my-2"
                >
                  {{ todo.status }}
                </v-chip>

              </v-card-actions>
            </v-card>
          <!-- </v-flex> -->
          
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
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
      updatePopup(showPopup){
        this.$store.dispatch('updatePopup', {showPopup: showPopup})
      },
      deleteTodo(id) {
        this.isLoading = true;

        this.$store.dispatch('deleteTodo', {id: id})
          .then((e) => {
            this.isLoading = false;
          })
          .catch((error) => {
            this.isLoading = false;
            console.log(error);
          })
      }
    }
  };
</script>
