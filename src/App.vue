<template>

  <v-app>
    
    <v-content>

      <NavigationBar/>

      <router-view></router-view>

    </v-content>

  </v-app>

</template>

<script>
import NavigationBar from './components/NavigationBar';

export default {
  name: 'App',
  components: {
    NavigationBar,
  },
  data: () => ({
    //
  })
};
</script>
