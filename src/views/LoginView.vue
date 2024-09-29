<template>
  <v-app>
    <v-card class="pa-4 transparent">
      <v-main class="d-flex justify-center align-center" style="background-color: #e8e9f0">
        <v-col cols="12" sm="8" class="mx-auto">
          <div class="centered-container">
            <v-row>
              <v-col cols="12" md="6" justify="center">
                <img class="img" src="../assets/bq.png" alt="barqun">
              </v-col>

              <v-col cols="12" md="6">
                <v-card class="recback">
                  <v-card-text class="mt-10">
                    <v-row justify="center">
                      <v-col cols="12" md="10">
                        <v-form @submit.prevent="submitHandler" ref="form">
                          <v-card-text>
                            <v-text-field class="mt-1 mb-5" outlined rounded dense v-model="email" :rules="emailRules" type="email" label="Email" required />
                            <v-text-field
                              v-model="password"
                              outlined
                              rounded
                              dense
                              :rules="passwordRules"
                              :type="passwordShow ? 'text' : 'password'"
                              label="Password"
                              :append-icon="passwordShow ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'"
                              @click:append="passwordShow = !passwordShow"
                              required
                              class="mb-3"
                            />

                            <!-- <v-select outlined rounded dense :items="roles" density="comfortable" label="Role"></v-select> -->

                            <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
                              <v-checkbox label="Remember me" color="blue"></v-checkbox>
                              <div class="text-caption text-decoration-none text-blue">
                                <router-link to="/Pass">Forgot password?</router-link>
                              </div>
                            </div>

                            <!-- <router-link to="/dashboard" style="text-decoration: none; text-transform: none"> -->
                            <!-- <v-btn dense block tile :loading="loading" type="submit" color="blue" style="border-radius: 30px" class="justify-center mb-10 mt-5">
                              <span class="white--text px-8" @click="login">Login</span>
                            </v-btn> -->
                            <!-- </router-link> -->

                            <v-btn @click="login" dense block tile :loading="loading" type="submit" color="blue" style="border-radius: 30px" class="justify-center mb-10 mt-5">
                              <span class="white--text px-8">Login</span>
                            </v-btn>
                          </v-card-text>
                        </v-form>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-main>
    </v-card>
  </v-app>
</template>

<script>
import router from '@/router';
import axios from 'axios'
export default {
  name: "HomeView",

  data: () => ({
    user: [],
    loading: false,
    snackbar: false,
    passwordShow: false,
    email: "",
    emailRules: [(v) => !!v || "E-mail is required", (v) => /.+@.+\..+/.test(v) || "E-mail must be valid"],
    password: "",
    passwordRules: [(v) => !!v || "Password is required", (v) => (v && v.length >= 6) || "Password must be 6 characters or more"],
    roles: ["Manager", "Employee"],
  }),

  methods: {
    submitHandler() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.snackbar = true;
        }, 3000);
      }
    },

  login() {
      axios
        .post('http://127.0.0.1:8080/api/auth/login', { email: this.email, password: this.password })
        .then((response) => {
          // console.log(response.data);
          const token = 'Bearer ' + response.data.data.accessToken;
          const name = response.data.data.user.name;
          const email = response.data.data.user.email;
          const roles = response.data.data.user.roles;

          localStorage.setItem('authenticated', true);
          localStorage.setItem('token', token);
          localStorage.setItem('username', name);
          localStorage.setItem('email', email);
          localStorage.setItem('roles', roles);
          router.push({ name: 'homeView' });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    mounted() {
    }
  },
};
</script>

<style scoped>
.centered-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  max-width: 100%;
}

.img {
  display: flex;
  justify-content: center;
  width: 350px;
  margin-top: 80px;
}

.recback {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100px 100px 100px 0px;
}

.centered-link {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 9px;
}
</style>
