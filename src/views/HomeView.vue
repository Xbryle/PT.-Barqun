<template >
  <div class="app" >
      <Dashboard />
  </div>  
</template>

<script>
  import Sidebar from '../components/SidebarView.vue'
  import Dashboard from './DashboardView.vue'

  export default {
    name: 'homeView',
    title: 'Barqun TMT',

    components: {
      Sidebar,
      Dashboard,
    },
  }
</script>

<style>
body {
  background-color: #E8E9F0; 
  font-family: 'poppins';
}
html {
  overflow-y: scroll;
}
html::-webkit-scrollbar {
  display: none;
}
.theme--light.v-input--is-disabled input, .theme--light.v-input--is-disabled textarea {
  color: rgb(0, 0, 0);
  cursor: pointer;
}

.theme--light.v-text-field--filled > .v-input__control > .v-input__slot {
  background: rgb(255 255 255 / 0%);
}

.v-input__slot {
  margin-bottom: 0;
}

.bottom-border-area .v-input__slot::before, .v-input__slot::after {
  display: none;
}


.v-text-field__details {
  display: none;
}
.scroll {
  height: 67%;
  position: relative;
  overflow: auto;
}
.scroller::-webkit-scrollbar {
  display: none;
}
.v-menu__content {
  overflow-x: visible;
  overflow-y: visible;
  contain: none;
}

</style>
