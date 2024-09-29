<template>
  <v-app style="font-family: 'poppins'; background-color: #e8e9f0;">
    <!-- :style="{$vuetify.theme.dark === true ? {BackgroundColor: "#fff"}:{BackgroundColor: "#000"}}" -->
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  data: () => ({
    title: 'Barqun TMT',
  }),
  methods: {
    
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700&display=swap');
body {
  background-color: #E8E9F0; 
}
</style>
