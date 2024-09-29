<template>
  <v-card max-width="1fr" class="banner px-5 py-4" style="position: relative;">
      <v-row dense>
        <v-col cols="12" md="6" class="d-flex justify-center">
          <div class="d-flex flex-no-wrap align-center">
            <div id="chart">
                <apexchart style="margin-left: -20px;" type="pie" width="300" :options="chartOptions" v-show="!loading" :series="series"></apexchart>
                <v-progress-circular
                  :size="180"
                  v-show="loading"
                  color="black"
                  indeterminate
                  :width="2"
                  style="z-index: 888;"
                ></v-progress-circular>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="6" class="d-flex align-center justify-start">
          <div style="width: inherit;">
            <v-autocomplete
              v-if="role === 'manager'"
              dense
              v-model="employee"
              label="Employee's"
              placeholder="select"
              :items="users.map(user => user.name)"
              class="search"
              outlined
              auto-select-first
              clearable
            ></v-autocomplete>
            <v-card-title class="my-2 py-0 px-0">Total Task : {{total}}</v-card-title>
            <v-card-subtitle class="my-0 py-0 px-0">as: {{employee === "" ? `Me` : employee === null ? `me` : `${employee}`}}</v-card-subtitle>
          </div>
        </v-col>
      </v-row>
  </v-card>
</template>

<script>
import axios from "axios";
import VueApexCharts from 'vue-apexcharts';

export default {
  name: 'PieChart',
  
  components: {
    apexchart: VueApexCharts,
  },
  
  data: () => ({
      headersManager: localStorage.getItem('token'),
      role: localStorage.getItem('roles'),
      tasks: [],
      series: [],
      users: [],
      names: [],
      total: null,
      employee: "",
      loading: false,
      
      chartOptions: {
        chart: {
          width: 380,
          type: 'pie',
        },
        dataLabels: {
          enabled: true,
          style: {
              fontSize: '10px',
              fontFamily: 'Helvetica, Arial, sans-serif',
          },
        },
        labels: ['Done', 'Undone', 'Failed', 'Pending', 'Cancel'],
        fill: {
          colors: ['#30E8AA', '#30A4FC', '#FF0025', '#FEBF44', '#FF687E']
        },
        legend: {
          show: true,
          itemMargin: {
              horizontal: -10,
              vertical: 3,
          },
        },
        colors: ['#30E8AA', '#30A4FC', '#FF0025', '#FEBF44', '#FF687E'],
        responsive: [{
          breakpoint: 280,
          options: {
            chart: {
              width: 300
            },
          }
        }]
        },
  }),


  methods: {
    setTask(data) {
      this.tasks = data;
    },
    searchEmpTasks(user) {
      const headers = {
        Accept: "application/json",
        Authorization: this.headersManager,
      };
      const selectedUser = this.users.find((user) => user.name === this.employee);
      if(this.employee === null || this.employee === "") {
        axios.get(`http://127.0.0.1:8080/api/tasks`,{headers})
        .then((response) => {
          let data_ = response.data.data;
          this.setTask(data_);
          
          let done = this.tasks.filter(task => task.status === 'done' || task.status === 'completed').length;
          let undone = this.tasks.filter(task => task.status === 'none').length;
          let failed = this.tasks.filter(task => task.status === 'failed').length;
          let pending = this.tasks.filter(task => task.status === 'pending').length;
          let cancel = this.tasks.filter(task => task.status === 'cancel').length;
          
          
          let seriesValue = [done, undone, failed, pending, cancel];
          this.series = seriesValue
          
          this.total = this.tasks.length;
        })
      } else {
        axios.get(`http://127.0.0.1:8080/api/employees/${selectedUser.id}/tasks`,{headers})
        .then((response) => {
          let data_ = response.data.data;
          this.setTask(data_);

          let done = this.tasks.filter(task => task.status === 'done' || task.status === 'completed').length;
          let undone = this.tasks.filter(task => task.status === 'none').length;
          let failed = this.tasks.filter(task => task.status === 'failed').length;
          let pending = this.tasks.filter(task => task.status === 'pending').length;
          let cancel = this.tasks.filter(task => task.status === 'cancel').length;

          
          let seriesValue = [done, undone, failed, pending, cancel];
          this.series = seriesValue
          
          this.total = this.tasks.length;
        })
      }
    },
  },


  mounted() {
    this.loading = true;
    const headers = {
      Accept: "application/json",
      Authorization: this.headersManager,
    };

    axios
      .get("http://127.0.0.1:8080/api/tasks", {
        headers,
      })
      .then((response) => {
        let data_ = response.data.data;
        this.setTask(data_);

        let done = this.tasks.filter(task => task.status === 'done' || task.status === 'completed').length;
        let undone = this.tasks.filter(task => task.status === 'none').length;
        let failed = this.tasks.filter(task => task.status === 'failed').length;
        let pending = this.tasks.filter(task => task.status === 'pending').length;
        let cancel = this.tasks.filter(task => task.status === 'cancel').length;

        
        let seriesValue = [done, undone, failed, pending, cancel];
        this.series = seriesValue
        
        this.total = this.tasks.length;
        this.loading = false;
        
      })
      .catch((error) => console.log(error));


      axios.get("http://127.0.0.1:8080/api/users",{headers})
        .then((response) => {
          let data_ = response.data.data;
          this.users = data_
          this.names = this.users.map((user) => user.name);
      })
  },
  computed: {
    
  },
  watch: {
    employee() {
      this.searchEmpTasks();
    },
  }
};
</script>

<style scoped>
.apexcharts-legend {
  overflow-y: scroll;
  margin-left: -50px;
  top: 0 !important;
}
.apexcharts-legend:root {
  overflow-y: scroll;
  margin-left: -50px;
  top: 10px !important;
}
.apexcharts-legend::-webkit-scrollbar {
  display: none;
}

.search {
  font-size: .8rem;
}
</style>