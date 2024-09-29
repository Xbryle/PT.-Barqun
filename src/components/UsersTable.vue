<template>
    <div>
        <v-card-title class="d-flex mb-1 px-0" style="position: relative; overflow-x: hidden;">
            <h2 style="font-weight: 600; font-size: 1.13rem">
                Users Management
            </h2>
            <v-spacer></v-spacer>
            <v-btn
            elevation="2"
            outlined
            rounded
            text
            color="black"
            style="background-color: transparent; scale: .85;"
            @click="addDialog = true"
            >Add User +</v-btn>
        </v-card-title>

        <v-dialog v-model="addDialog" max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="text-h5">New User</span>
                </v-card-title>
                
                <v-card-text class="py-0">
                    <v-container>
                        <v-text-field
                        v-model="email"
                        dense
                        outlined
                        label="Enter Email"
                        class="new-title"
                        style="width: 100%; height: fit-content;"
                        ></v-text-field>
                    </v-container>

                    <v-container class="my-0 py-0">
                        <span class="text-h7">Roles</span>
                    </v-container>
                    <v-radio-group v-model="radios" row dense class="my-0 py-0" style="width: fit-content;">
                        <v-radio
                            v-for="radio in radioRoles"
                            style="scale: .7; width: fit-content; padding: 0; margin: 0;"
                            :label="radio.label"
                            :value="radio.value"
                        ></v-radio>
                    </v-radio-group>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="blue darken-1"
                        text
                        @click="addDialog = false">
                        Cancel
                    </v-btn>
                    <v-btn
                        color="blue darken-1"
                        text
                        @click="addUser">
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        
        <!-- <v-dialog v-model="addDialog" max-width="500px">
            <v-card>
                <v-file-input
                    truncate-length="15"
                    v-model="sendImg"
                    accept="image/*"
                ></v-file-input>
                <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            color="blue darken-1"
                            text
                            @click="addDialog = false">
                            Cancel
                        </v-btn>
                        <v-btn
                            color="blue darken-1"
                            text
                            @click="addImg()">
                            Save
                        </v-btn>
                    </v-card-actions>
            </v-card>
        </v-dialog> -->

        <v-data-table
            style="background-color: #fffbfb"
            :headers="headers"
            :items="users"
            :search="search"
            :loading="tableLoading"
            loading-text="Loading... Please wait"
            class="elevation-1">

            <template v-slot:top>
                <v-toolbar flat style="background-color: #fffbfb">
                    <v-text-field
                        dense
                        v-model="search"
                        append-icon="fa-solid fa-magnifying-glass"
                        label="Search"
                        hide-details
                        outlined
                    ></v-text-field>
                </v-toolbar>

                <v-dialog v-model="dialogDelete" max-width="500px">
                    <v-card>
                        <v-card-title class="text-h5">Are you sure you want to delete this user?</v-card-title>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="dialogDelete = false">Cancel</v-btn>
                            <v-btn color="blue darken-1" text @click="deleteUserConfirm">OK</v-btn>
                            <v-spacer></v-spacer>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </template>

            <template v-slot:item.actions="{ item }">
                <v-icon small @click="deleteUser(item)">fa-solid fa-trash</v-icon>
            </template>
        
        </v-data-table>
        
    </div>
</template>

<script>
import axios from 'axios';
export default {
components: {
},

data: () => ({          
    headersManager: localStorage.getItem("token"),
    loadingCircle: false,
    tableLoading: false,
    addDialog: false,
    dialogDelete: false,
    users: [],
    headers: [
        { text: 'Id', value: 'id', sortable: false, align: 'start',},
        { text: 'Name', value: 'name',},
        { text: 'Email', value: 'email' },
        { text: 'Verified', value: 'email_verified_at'},
        { text: 'Roles', value: 'roles' },
        { text: 'Actions', value: 'actions', sortable: false },
    ],
    radioRoles: [
        {label: 'Manager', value: 'manager'},
        {label: 'Employee', value: 'employee'},

    ],
    search: "",
    email: "",
    radios: "",
    userId: "",
    sendImg: "",
}),

methods: {

mount() {
    const headers = {
        Accept: "application/json",
        Authorization: this.headersManager,
    };
    this.tableLoading = true;

    axios
    .get("http://127.0.0.1:8080/api/users", {
        headers,
    })
    .then((response) => {
        this.users = response.data.data;
        this.tableLoading = false;
    })
    .catch((error) => console.log(error.response.data));
},

addUser(){
    const headers = {
        Accept: "application/json",
        Authorization: this.headersManager,
    };
    axios
    .post("http://127.0.0.1:8080/api/users",
    { email: this.email, roles: [this.radios], r: "http://127.0.0.1:8081/set-profile" },
    {headers,}
    )
    .then((response) => {
        this.mount()
        console.log(response.data)
        this.addDialog = false;
    })
    .catch((error) => console.log(error.response.data));
},
deleteUser(item) {
    this.userId = item.id;
    console.log(this.userId);
    this.dialogDelete = true;
},
deleteUserConfirm () {
    const headers = {
        Accept: "application/json",
        Authorization: this.headersManager,
    };
    axios
    .delete(`http://127.0.0.1:8080/api/users/${this.userId}`,
        {headers,}
    )
    .then((response) => {
        this.mount();
        console.log(response.data)
        this.userId = "";
        console.log(this.userId);
        this.dialogDelete = false;
    })
    .catch((error) => console.log(error));
},

// addImg() {
//   const headers = {
//     Accept: "application/json",
//     Authorization: this.headersManager,
//   };

//   const file = this.sendImg;
//   if (!file || !file.type.startsWith('image/')) {
//     console.error('Kolom avatar harus berupa file gambar yang valid');
//     return;
//   }

//   const formData = new FormData();
//   formData.append('image', file);

//   axios
//     .post("http://127.0.0.1:8080/api/auth/profile?_method=PATCH", formData, { headers })
//     .then((response) => {
//       console.log(response);
//       this.addDialog = false;
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// }

},

mounted() {
    this.mount();
},

computed: {

},

}
</script>

<style scoped>

.new-title .v-input__slot::before, .v-input__slot::after {
  display: grid;
}

.grid-template {
  display: grid;
  grid-template-columns: 0.5fr 87% 1fr;
  gap: 8px;
  align-items: center;
  padding-right: 10px;
}

.scroller {
  overflow-y: scroll;
}
.scroller::-webkit-scrollbar {
  display: none;
}

.v-dialog::-webkit-scrollbar {
  display: none;
}

.details-pop {
  z-index: 9999;
  display: grid;
  background-color: #ffffff;
  padding: 0 25px;
  padding-bottom: 30px;
  padding-top: 10px;
}
#subtask::placeholder {
  color: #000000;
  font-weight: 500;
}
.grid-template {
  display: grid;
  grid-template-columns: 0.5fr 87% 1fr;
  gap: 10px;
  align-items: center;
}

.delete-subtask {
  display: flex;
  margin-left: 50%;
  margin-top: -2px;
}

.doned {
  animation: doned 0.2s ease-out;
  color: #25bb00;
  margin-top: 2px;
}
.noned {
  margin-top: 2px;
  animation: noned 0.2s ease-out;
}
@keyframes doned {
  0% {
    scale: 0;
  }
  100% {
    scale: 1;
  }
}
@keyframes noned {
  0% {
    scale: 0;
  }
  100% {
    scale: 1;
  }
}

input[type="datetime-local"]::-webkit-inner-spin-button,
input[type="datetime-local"]::-webkit-calendar-picker-indicator {
  /* display: none;
    -webkit-appearance: none; */
  margin: 0;
}
input[type="datetime-local"]::-webkit-datetime-edit {
  display: none;
}

</style>