<template>
    <div>
      <v-navigation-drawer v-model="drawer" dark app class="navi mt-3 ml-3" width="200" height="97vh" style="box-shadow: none; background-image: linear-gradient(to top right, #5841e5, #1916D0); z-index: 999;">
          <div class="text-center mt-5 mb-12">
              <v-btn fab color="white" x-large>
                  <img width="50px" src="../assets/barqun2.png" alt="">
              </v-btn>
          </div>
  
          <v-list flat color="transparent" v-for="page in items" :key="page.name">
              <router-link :to="page.to" class="" style="text-decoration: none; text-transform: none; color: #fff;">
                  <v-btn text style="text-transform: none; padding: 30px 40px;" width="100%" class="d-flex justify-start mb-2">
                          <v-icon class="mr-2">{{page.icons}}</v-icon>
                          <p style="font-weight: 500; letter-spacing: 1px; display: flex; align-self: center;" class="mb-0">{{ page.name }}</p>
                  </v-btn>
              </router-link>
          </v-list>
  
          <v-list flat color="transparent" v-if="role === 'manager'">
              <router-link to="/users" class="" style="text-decoration: none; text-transform: none; color: #fff;">
                  <v-btn text style="text-transform: none; padding: 30px 40px;" width="100%" class="d-flex justify-start mb-2">
                          <v-icon class="mr-3">fa-solid fa-user</v-icon>
                          <p style="font-weight: 500; letter-spacing: 1px; display: flex; align-self: center;" class="mb-0">Users</p>
                  </v-btn>
              </router-link>
          </v-list>
  
          <div style="position: absolute; bottom: 20px; margin-left: auto; margin-right: auto; left: 0; right: 0; text-align: center;">
              <v-btn @click="logout" text style="text-transform: none; padding: 30px 40px;" width="100%">
                  <v-icon>fas fa-sign-out-alt</v-icon>
                  <p style="font-weight: bold; letter-spacing: 1px; display: flex; align-self: center;" class="mb-0 ml-2">Log out</p>
              </v-btn>
          </div>
      </v-navigation-drawer>
  
      <v-app-bar class="my-0" style="background-color: transparent; box-shadow: none; margin-bottom: 10px;">
          <v-app-bar-nav-icon class="ms-n6" media="(max-width: 1024px)" @click="drawer = !drawer"></v-app-bar-nav-icon>
  
          <v-spacer></v-spacer>
  
          <v-menu bottom min-width="200px" rounded offset-y>
              <template v-slot:activator="{ on }">
                  <v-btn icon x-small v-on="on">
                      <v-avatar color="brown" size="30">
                          <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John">
                      </v-avatar>
                  </v-btn>
              </template>
              <v-card>
                  <v-list-item-content class="justify-center">
                      <div class="mx-auto text-center">
                          <v-avatar color="brown" class="mb-3">
                              <span class="white--text text-h5"></span>
                          </v-avatar>
                          <h3>{{ username }}</h3>
                          <p class="text-caption mt-1">
                              {{ email }}
                          </p>
                          <v-divider class="my-3"></v-divider>
                          <v-btn depressed rounded text @click="dialog = true">
                              Edit Account
                          </v-btn>
                          <v-divider class="my-3"></v-divider>
                          <v-btn depressed rounded text @click="logout">
                              Logout
                          </v-btn>
                      </div>
                  </v-list-item-content>
              </v-card>
          </v-menu>
  
          <v-dialog v-model="dialog" persistent max-width="400px">
              <v-card>
                  <v-card-title>
                      <span class="text-h5">User Profile</span>
                  </v-card-title>
                  <v-card-text>
                      <v-container class="mb-5" style="display: grid; justify-items: center;">
                          <v-avatar size="100">
                          <img src="https://cdn.vuetifyjs.com/images/john.jpg" :alt="username">
                          </v-avatar>
                      </v-container>
                      <v-row>
                          <v-col cols="12" sm="12">
                              <v-text-field outlined label="Enter new username" v-model="changeName" required style="width: 200%;"></v-text-field>
                          </v-col>
                      </v-row>
                  </v-card-text>
                  <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="dialog = false">
                          Close
                      </v-btn>
                      <v-btn color="blue darken-1" text @click="updateName">
                          Save
                      </v-btn>
                  </v-card-actions>
              </v-card>
          </v-dialog>
  
      </v-app-bar>
    </div>
  </template>
  
  <script>
  import router from '@/router';
  import axios from 'axios';
  export default {
  data: () => ({
      items: [
          {icons: 'widgets', to: '/', name: 'Dashboard'},
          {icons: 'fa-solid fa-chart-simple', to: '/tasks', name: 'Tasks'},
          {icons: 'fa-solid fa-pen-to-square', to: '/notes', name: 'Notes'},
          // {icons: 'fas fa-cogfas fa-cog', to: '/setting', name: 'Setting'},
      ],
      drawer: true,
      dialog: false,
      username: localStorage.getItem('username'),
      email: localStorage.getItem('email'),
      headersManager: localStorage.getItem("token"),
      role: localStorage.getItem('roles'),
      changeName: "",
  }),
  methods: {
      logout() {
          localStorage.removeItem("authenticated")
          localStorage.removeItem("token")
          router.push('/login');
      },
      updateName(){
          const headers = {
              Authorization: this.headersManager,
          };
          if(this.changeName !== "") {
              axios
                  .post(
                      `http://127.0.0.1:8080/api/auth/profile?_method=PATCH`,
                      { name: this.changeName },
                      { headers}
                  )
                  .then((response)=>{
                      this.dialog = false;
                  })
                  .catch((error) => {
                      console.log(error.response.data)
                  })
          }
      },
  },
  
  mounted(){
  },
  
  computed: {
      mount() {
          if (window.innerWidth > 1250) {
              return this.drawer = true;
          } else {
              return this.drawer = true;
          }
      }
  }
  }
  </script>
  
  <style scoped>
  .navi {
      border-radius: 10px;
  }
  </style>