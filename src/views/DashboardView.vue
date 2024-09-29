<template>
  <div class="dashContain py-0">
    <NavigationDrawer />
    <v-row style="position: inline;">
      <v-col cols="12" md="8" style="position: inline;">
        <PieChart />
        <ListTask/>
      </v-col>
      <v-col cols="12" md="4" style="position: inline">
        <ListNote/>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import NavigationDrawer from '@/components/SidebarView.vue';
import ListTask from "./lists/taskList.vue" 
import ListNote from "./lists/noteList.vue"
import router from '@/router';
import PieChart from '@/components/PieChart.vue'
export default {
  name: "projectsView",
  data: () => ({
    headersManager: localStorage.getItem('token'),
    dialog: false,
    username: localStorage.getItem("username"),
    email: localStorage.getItem("email"),
    fill: true,
    padding: 8,
    radius: 10,
    value: [0, 2, 5, 9, 5, 10, 3, 5, 0, 0, 1, 8, 2, 9, 0],
    width: 2,
    massage: "",
    role: localStorage.getItem('roles')
  }),


  components: {
    ListTask,
    ListNote,
    NavigationDrawer,
    PieChart,
  },


  methods: {

  },


  mounted() {

  },

  computed: {
    
  },
  // computed: mapState(['snackbar']),
};
</script>


<style scoped>
.search-box {
  position: relative;
}
.search-box .search {
  padding: 5px 15px;
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0 3px 3px #00000053;
  font-size: 0.8rem;
}
.search-box i {
  position: absolute;
  z-index: 4;
  right: 0;
}

.banner {
  border-radius: 10px;
}

.dashContain {
  position: relative;
  padding-left: 30px;
  padding-right: 30px;
  font-family: "poppins";
  padding-top: 10px;
}

.svg1 {
  width: 150px;
}

</style>