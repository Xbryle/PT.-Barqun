<template>
    <div>
        <v-snackbar
            v-model="snackbar"
            absolute
            centered
            :timeout="1000"
            class="snack"
            style="z-index: 9999"
            >
            {{ massage }}
        </v-snackbar>
        <v-autocomplete
            v-if="role === 'manager'"
            dense
            v-model="viewEmployee"
            label="View Employee's Tasks"
            placeholder="select"
            :items="users.map(user => user.email)"
            class="search mb-4"
            outlined
            auto-select-first
            clearable
            @blur="viewEmpTasksMount()"
        ></v-autocomplete>
        <div class="d-flex mb-3" style="width: 100%;">
            <v-dialog v-model="dialog" max-width="500px">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn
                            style="scale: .77;"
                            color="primary"
                            dark
                            v-bind="attrs"
                            @click="clearTemporaryData()"
                            v-on="on">
                            New Task
                            </v-btn>
                        </template>
                        <v-card>
                            <v-card-title>
                                <span class="text-h5">New Item</span>
                            </v-card-title>
                            
                            <v-card-text class="py-0">
                                <v-container>
                                    <v-text-field
                                    v-model="newTaskTitle"
                                    dense
                                    outlined
                                    label="Enter Title"
                                    class="new-title"
                                    style="width: 100%; height: fit-content;"
                                    ></v-text-field>
                                </v-container>

                                <v-container>
                                    <v-text-field
                                    v-model="addNote"
                                    dense
                                    outlined
                                    label="Enter Note (optional)"
                                    class="new-title"
                                    style="width: 100%; height: fit-content;"
                                    ></v-text-field>
                                </v-container>

                                <v-container class="my-0 py-0">
                                    <span class="text-h7">Interval</span>
                                </v-container>
                                <v-radio-group v-model="radios" row dense class="my-0 py-0" style="width: fit-content;">
                                    <v-radio
                                        v-for="radio in radioInterval"
                                        style="scale: .7; width: fit-content; padding: 0; margin: 0;"
                                        :label="radio.label"
                                        :value="radio.value"
                                    ></v-radio>
                                </v-radio-group>

                                <v-container>
                                    <span class="text-h7">Subtask (optional)</span>

                                    <v-col
                                        cols="12"
                                        style="position: relative"
                                        class="px-0"
                                        v-for="sub in temporaryChild"
                                        :key="sub.content">
                                        <div class="grid-template">
                                        <i
                                            style="cursor: pointer; width: fit-content"
                                            class="noned fa-regular fa-circle"
                                        ></i>
                                        <input
                                            :style="
                                            sub.status === 'done'
                                                ? { textDecoration: 'line-through' }
                                                : { textDecoration: 'none' }
                                            "
                                            v-model="sub.content"
                                            contenteditable="false"
                                            type="text"
                                            id="subtask"
                                            style="outline: none; width: 100%"
                                            name="note"
                                            disabled
                                        />
                                        <i
                                            style="font-size: 0.7rem; cursor: pointer"
                                            class="delete-subtask delete-icon fa-solid fa-trash"
                                            @click="deleteTemporaryChild(sub)"
                                        ></i>
                                        </div>
                                    </v-col>
    
                                    <v-col cols="12" class="px-0">
                                        <i class="fa-regular fa-circle mr-3"></i>
                                        <!-- <i class="fa-solid fa-circle-check mr-4"></i> -->
                                        <input
                                            v-model="subtask"
                                            type="text"
                                            placeholder="Add New Subtask"
                                            id="add-subtask"
                                            style="outline: none; width: 90%"
                                            name="add-subtask"
                                            @blur="addTemporaryChild()"
                                            @keydown="enterSubtaskTempo($event)"
                                        />
                                    </v-col>
                                </v-container>

                                <v-container>
                                    <span class="text-h7">Create for employee (optional)</span>
                                    <v-autocomplete
                                        v-if="role === 'manager'"
                                        dense
                                        v-model="employee"
                                        label="Employee's"
                                        placeholder="select"
                                        :items="users.map(user => user.email)"
                                        class="search mt-1"
                                        outlined
                                        auto-select-first
                                        clearable
                                    ></v-autocomplete>
                                </v-container>

                            </v-card-text>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn
                                    color="blue darken-1"
                                    text
                                    @click="dialog = false">
                                    Cancel
                                </v-btn>
                                <v-btn
                                    color="blue darken-1"
                                    text
                                    @click="addTask">
                                    Save
                                </v-btn>
                            </v-card-actions>
                        </v-card>
            </v-dialog>

            <v-spacer></v-spacer>
            
            <v-text-field
                dense
                v-model="search"
                append-icon="fa-solid fa-magnifying-glass"
                label="Search"
                hide-details
                outlined
            ></v-text-field>
        </div>
        
        <v-data-table
            style="background-color: #fffbfb"
            :headers="headers"
            :items="filtered"
            :search="search"
            :loading="tableLoading"
            loading-text="Loading... Please wait"
            class="elevation-1">

            <!-- header -->
            <template v-slot:top>
                <v-toolbar flat style="background-color: #f9f9f9;">
                    <v-select
                    :items="selectInterval"
                    label="Select Interval"
                    v-model="selectedInterval"
                    @blur="mount()"
                    ></v-select>

                    <v-dialog v-model="dialogDelete" max-width="500px">
                        <v-card>
                            <v-card-title class="text-h5">Are you sure you want to delete this task?</v-card-title>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="dialogDelete = false">Cancel</v-btn>
                                <v-btn color="blue darken-1" text @click="deleteTaskConfirm()">OK</v-btn>
                                <v-spacer></v-spacer>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-toolbar>
            </template>

            <!-- items -->
            <template v-slot:item.truncatedContent="{item}">
                <v-edit-dialog
                :return-value.sync="item.truncatedContent">
                {{ item.truncatedContent }}
                <template v-slot:input>
                    <input
                        :style="item.status === 'done' ? { textDecoration: 'line-through' } : { textDecoration: 'none' }"
                        style="outline: none; width: max-content; min-width: none;"
                        v-model="item.title"
                        label="Edit"
                        single-line
                        counter
                        class="my-2"
                        @blur="updateTitle(item)"
                        @input="handleInputTitle"
                        :disabled="item.is_assigner === true"/>
                </template>
                </v-edit-dialog>
            </template>

            <template v-slot:item.end_at="{item}">
                {{ item.end_at !== null ? item.end_at : '-' }}
            </template>

            <template v-slot:item.childrens_total="{item}">
                <v-edit-dialog :return-value.sync="item.childrens_total">
                    <v-btn depressed color="black" retain-focus-on-click tile plain @click="getChildrens(item)">
                        {{ item.childrens_total }}
                    </v-btn>
                    <template v-slot:input>
                        <v-progress-circular
                        indeterminate
                        color="primary"
                        v-show="loadingSubtask"
                        ></v-progress-circular>
                        <v-col
                            cols="12"
                            style="position: relative"
                            class="px-0"
                            v-for="sub in childrens"
                            :key="sub.id">
                            <div class="grid-template">
                                <i
                                style="cursor: pointer; width: fit-content"
                                class="noned fa-regular fa-circle"
                                @click="setDoneSub(item, sub)"
                                v-if="sub.status === 'none'"></i>
                                <i
                                style="cursor: pointer; width: fit-content"
                                class="doned fa-solid fa-circle-check"
                                @click="setDoneSub(item, sub)"
                                v-else></i>

                                <input
                                :style="sub.status === 'done' ? { textDecoration: 'line-through' } : { textDecoration: 'none' }"
                                v-model="sub.content"
                                contenteditable="true"
                                type="text"
                                style="outline: none;"
                                @blur="updateSubtask(item, sub)"
                                @input="handleInput">

                                <i
                                style="font-size: 0.7rem; cursor: pointer"
                                class="delete-subtask delete-icon fa-solid fa-trash"
                                @click="deleteSubTask(item, sub)"
                                ></i>
                            </div>
                        </v-col>
                    </template>
                </v-edit-dialog>
            </template>

            <template v-slot:item.status="{ item }">
                    <v-chip :color="getColor(item.status)" dark style="border-radius: 5px; font-size: .8rem;" @click="setDoneTask(item)">
                        {{ item.status === "none" ? "undone" : item.status && item.status === "completed" ? "done" : item.status }}
                    </v-chip>
            </template>

            <template v-slot:item.actions="{ item }">
                <v-icon
                    small
                    @click="sendDetails(item)"
                    class="mr-2">fa-solid fa-pencil</v-icon>
                <v-icon
                    small @click="deleteTaskMessage(item)">fa-solid fa-trash</v-icon>
            </template>

            <!-- no data -->
            <template v-slot:no-data>
                <v-btn
                    color="primary">
                    Reset
                </v-btn>
            </template>

        </v-data-table>
        
        <v-dialog v-model="showDialog" max-width="600px">

            <v-progress-circular
            v-show="loadingCircle"
            indeterminate
            style="z-index: 888; position: absolute; top: 45%; left: 50%;"
            ></v-progress-circular>

            <v-container class="details-pop" v-for="task in details" :key="task.id">


            <v-subheader class="px-0 d-flex mb-n4">
                <h4 style="font-weight: 500" class="mr-3">{{ task.interval }}</h4>
                <v-spacer></v-spacer>

                <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <i
                    v-on="on"
                    v-bind="attrs"
                    @click="deleteTask(task)"
                    style="font-size: 0.9rem; cursor: pointer; z-index: 888"
                    class="delete-icon fa-solid fa-trash mr-4"
                    ></i>
                </template>
                <span>Delete</span>
                </v-tooltip>

                <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <i
                    v-on="on"
                    v-bind="attrs"
                    @click="cancleTask(task)"
                    v-if="
                        task.status === 'undone' ||
                        task.status === 'pending' ||
                        task.status === 'none'
                    "
                    style="font-size: 0.9rem; cursor: pointer; z-index: 888"
                    class="cancle-icon fa-solid fa-ban mr-4"
                    ></i>
                </template>
                <span>Cancle</span>
                </v-tooltip>

                <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <i
                    v-on="on"
                    v-bind="attrs"
                    @click="showDialog = false"
                    style="font-size: 1.1rem; cursor: pointer; z-index: 888"
                    class="close-icon fa-solid fa-xmark"
                    ></i>
                </template>
                <span>Close</span>
                </v-tooltip>
            </v-subheader>

            <v-textarea
                id="tittle"
                @blur="updateTitle(task)"
                rows="1"
                placeholder="Add Title"
                style="font-size: 1.3rem; outline: none; font-weight: 600"
                class="mb-5 bottom-border-area"
                v-model="taskTitle"
                auto-grow
                :disabled="task.assigner !== null"
            ></v-textarea>

            <v-subheader class="mt-n5 py-0 px-0">
                <h4
                style="font-weight: 600; margin-top: -1px; font-size: 0.8rem"
                class="mr-2">
                end at {{ endDate }}
                </h4>
                <input
                v-if="task.interval === 'none' && task.assigner === null"
                v-model="endDate"
                type="datetime-local"
                style="font-weight: 400; font-size: 0.7rem"
                @blur="updateDateEnd(task)"
                />
            </v-subheader>

            <v-subheader class="mt-n5 py-0 px-0">
                <h4
                style="font-weight: 600; margin-top: -1px; font-size: 0.8rem"
                class="mr-2"
                >
                start at {{ startDate }}
                </h4>
                <!-- <v-btn fab small><i class="fa-regular fa-calendar-days"></i></v-btn> -->
                <input
                v-model="startDate"
                type="datetime-local"
                style="font-weight: 400; font-size: 0.7rem"
                @blur="updateDateStart(task)"
                v-if="!['done', 'failed', 'cancel'].includes(task.status) && task.assigner === null"
                />
            </v-subheader>

            <v-subheader class="px-0 py-0 mb-n5">NOTE</v-subheader>

            <v-textarea
                id="note"
                @blur="updateNote(task)"
                rows="1"
                placeholder="Add Note"
                class="mb-2 bottom-border-area"
                v-model="note"
                auto-grow
            ></v-textarea>

            <v-subheader class="px-0 py-0">SUBTASK</v-subheader>

            <v-col
                cols="12"
                style="position: relative"
                class="px-0"
                v-for="sub in childrens"
                :key="sub.id">
                <div class="grid-template">
                <i
                    style="cursor: pointer; width: fit-content"
                    class="noned fa-regular fa-circle"
                    @click="setDoneSub(task, sub)"
                    v-if="sub.status === 'none'"
                ></i>
                <i
                    style="cursor: pointer; width: fit-content"
                    class="doned fa-solid fa-circle-check"
                    @click="setDoneSub(task, sub)"
                    v-else
                ></i>
                <input
                    :style="
                    sub.status === 'done'
                        ? { textDecoration: 'line-through' }
                        : { textDecoration: 'none' }
                    "
                    v-model="sub.content"
                    contenteditable="true"
                    type="text"
                    id="subtask"
                    style="outline: none; width: 100%"
                    name="note"
                    @blur="updateSubtask(task, sub)"
                    @input="handleInput"
                    :disabled="task.assigner !== null"
                />
                <i
                    style="font-size: 0.7rem; cursor: pointer"
                    class="delete-subtask delete-icon fa-solid fa-trash"
                    @click="deleteSubTask(task, sub)"
                ></i>
                </div>
            </v-col>

            <v-col cols="12" class="px-0" v-if="task.assigner === null">
                <i class="fa-regular fa-circle mr-3"></i>
                <!-- <i class="fa-solid fa-circle-check mr-4"></i> -->
                <input
                v-model="subtask"
                type="text"
                placeholder="Add New Subtask"
                id="add-subtask"
                style="outline: none; width: 90%"
                name="add-subtask"
                @blur="addSubtask(task)"
                @keydown="enterSubtask($event, task)"
                />
            </v-col>
            </v-container>
        </v-dialog>
    </div>
</template>

<script>
import axios from 'axios';
export default {
components: {
},

data: () => ({          
    headersManager: localStorage.getItem("token"),
    role: localStorage.getItem('roles'),
    assigner: false,
    dialog: false,
    loadingSubtask: false,
    showDialog: false,
    loadingCircle: false,
    tableLoading: false,
    dialogDelete: false,
    snackbar: false,
    tasks: [],
    filtered: [],
    desserts: [],
    childrens: [],
    users: [],
    details: {},
    temporaryChild: [],
    headers: [
        { text: 'Title', value: 'truncatedContent', sortable: false, align: 'start',},
        { text: 'Start', value: 'start_at' },
        { text: 'End', value: 'end_at'},
        { text: 'Subtasks', value: 'childrens_total' },
        { text: 'Interval', value: 'interval' },
        { text: 'Status', value: 'status' },
        { text: 'Actions', value: 'actions', sortable: false },
    ],
    radioInterval: [
        {label: 'Casual', value: 'none'},
        {label: 'Daily', value: 'daily'},
        {label: 'Weekly', value: 'weekly'},
        {label: 'Monthly', value: 'monthly'},
    ],
    selectInterval: ['All', 'Casual', 'Dailys', 'Weeklys', 'Monthlys'],
    selectedInterval: "All",
    newTaskTitle: "",
    subtaskTitle: "",
    subtask: "",
    taskTitle: "",
    employee: "",
    viewEmployee: "",
    radios: "",
    note: "",
    addNote: "",
    search: "",
    taskId: "",
    massage: "",
    radioGroup: 1,
}),

methods: {

// mount
truncatedTitle() {
  this.filtered = this.tasks.filter((task) => task.title.length);
  for (let i = 0; i < this.filtered.length; i++) {
    if (this.filtered[i].title.length > 10) {
        const truncatedTitle = this.filtered[i].title.slice(0, 10) + "....";
        this.filtered[i].truncatedContent = truncatedTitle;
    } else {
        const truncatedTitle = this.filtered[i].title;
        this.filtered[i].truncatedContent = truncatedTitle;
    }
  }
},
mount() {
  const headers = {
    Accept: "application/json",
    Authorization: this.headersManager,
  };

  if(this.selectedInterval === "All") {
      axios
        .get("http://127.0.0.1:8080/api/tasks", {
          headers,
        })
        .then((response) => {
            let data_ = response.data.data;
            this.tasks = data_;
            this.loading = false;
            this.tableLoading = false;
            this.truncatedTitle();
            this.sortTasksMount();
            this.statusMount();
        })
        .catch((error) => console.log(error.response.data));
  } else if(this.selectedInterval === "Casual") {
        axios
            .get("http://127.0.0.1:8080/api/tasks?filter[interval]=none", {
            headers,
            })
            .then((response) => {
                let data_ = response.data.data;
                this.tasks = data_;
                this.loading = false;
                this.tableLoading = false;
                this.truncatedTitle();
                this.sortTasksMount();
                this.statusMount();
            })
            .catch((error) => console.log(error.response.data));
  } else if(this.selectedInterval === "Dailys") {
        axios
            .get("http://127.0.0.1:8080/api/tasks?filter[interval]=daily", {
            headers,
            })
            .then((response) => {
                let data_ = response.data.data;
                this.tasks = data_;
                this.loading = false;
                this.tableLoading = false;
                this.truncatedTitle();
                this.sortTasksMount();
                this.statusMount();
            })
            .catch((error) => console.log(error.response.data));
  } else if(this.selectedInterval === "Weeklys") {
        axios
            .get("http://127.0.0.1:8080/api/tasks?filter[interval]=weekly", {
            headers,
            })
            .then((response) => {
                let data_ = response.data.data;
                this.tasks = data_;
                this.loading = false;
                this.tableLoading = false;
                this.truncatedTitle();
                this.sortTasksMount();
                this.statusMount();
            })
            .catch((error) => console.log(error.response.data));
  } else if(this.selectedInterval === "Monthlys") {
        axios
            .get("http://127.0.0.1:8080/api/tasks?filter[interval]=monthly", {
            headers,
            })
            .then((response) => {
                let data_ = response.data.data;
                this.tasks = data_;
                this.loading = false;
                this.tableLoading = false;
                this.truncatedTitle();
                this.sortTasksMount();
                this.statusMount();
            })
            .catch((error) => console.log(error.response.data));
  }
},
sortTasksMount() {
    const pinnedTasks = this.tasks.filter((task) => task.is_pinned === true || task.is_pinned === 'true');
    const undoneTasks = this.tasks.filter((task) => !task.is_pinned === true && task.status === "undone" || !task.is_pinned === true && task.status === "none");
    const pendingTasks = this.tasks.filter((task) => !task.is_pinned === true && task.status === "pending" || !task.is_pinned === 'true' && task.status === "pending");
    const cancelTasks = this.tasks.filter((task) => !task.is_pinned === true && task.status === "cancel" || !task.is_pinned === 'true' && task.status === "cancel");
    const failedTasks = this.tasks.filter((task) => !task.is_pinned === true && task.status === "failed" || !task.is_pinned === 'true' && task.status === "failed");
    const doneTasks = this.tasks.filter((task) => !task.is_pinned === true && task.status === "done" || !task.is_pinned === 'true' && task.status === "done" || !task.is_pinned === 'true' && task.status === "completed" || !task.is_pinned === true && task.status === "completed");

    const sortedPinned = pinnedTasks.sort((a, b) => {return new Date(b.start_at) - new Date(a.start_at);});
    const sortedUndone = undoneTasks.sort((a, b) => {return new Date(b.start_at) - new Date(a.start_at);});

    this.filtered = [...sortedPinned, ...sortedUndone, ...pendingTasks, ...cancelTasks, ...failedTasks, ...doneTasks];
    return this.filtered
},
statusMount() {
    const today = new Date();
    this.filtered.forEach((task) => {
        const endDay = parseInt(task.end_at[0] + task.end_at[1]);
        const endMonth = parseInt(task.end_at[3] + task.end_at[4]);
        const endYear = parseInt(
            task.end_at[6] + task.end_at[7] + task.end_at[8] + task.end_at[9]
            );
            const endHour = parseInt(task.end_at[11] + task.end_at[12]);
            const endMinute = parseInt(task.end_at[14] + task.end_at[15]);
            
            const formattedEndDate = `${endYear}-${endMonth}-${endDay}T${endHour}:${endMinute}:00`;
            const datedFormatedEndDate = new Date(formattedEndDate);
    if (
        (datedFormatedEndDate < today && task.status === "none") ||
        (datedFormatedEndDate < today && task.status === "undone")
        ) {
        const headers = {
            Accept: "application/json",
            Authorization: this.headersManager,
        };
        axios
        .patch(
            `http://127.0.0.1:8080/api/tasks/${task.id}`,
            { status: "failed" },
            { headers }
        )
        .then((response) => {
            console.log(response.status);
        })
        .catch((error) => {
            console.log(error.response.data);
        });
    }
    });
},
getColor(status) {
    if (status === 'done' || status === 'completed') return '#00c52bec'
    else if (status === 'none' || status === 'undone') return 'gray'
    else if (status === 'failed') return 'red'
    else if (status === 'pending') return 'orange'
    else if (status === 'cancel') return 'black'
},

cancleTask(task) {
    const headers = {
    Authorization: this.headersManager,
    };

    if(task.assigner === null) {
        this.assigner = false;
    } else {
        this.assigner = true;
    }
    if(task.is_assigner !== undefined) {
        this.assigner = task.is_assigner;
    }

    if(this.assigner === false) {
        const all = document.getElementById(`task-${task.id}`);
        axios
        .patch(
            `http://127.0.0.1:8080/api/tasks/${task.id}`,
            { status: "cancel" },
            { headers }
        )
        .then((response) => {
            this.mount()
            this.showDialog = false;
            console.log(response.status);
        })
        .catch((error) => console.log(error.response.data));
    } else {
        this.massage = "Cannot Delete Task Create by Assigner"
        this.snackbar = true;
    }
},

addTask() {
  const headers = {
    Authorization: this.headersManager,
  };

  if(this.newTaskTitle !== "" || this.radios !== "") {
    if(this.employee === "" || this.employee === null) {
        axios
          .post(
            `http://127.0.0.1:8080/api/tasks`,
            { title: this.newTaskTitle, interval: `${this.radios}`, note: this.addNote },
            { headers, withCredentials: false }
          )
          .then((response) => {
            let data_ = response.data.data;
            this.dialog = false;
            this.mount();
            for(let i = 0; i < this.temporaryChild.length; i++){
                axios
                  .post(
                    `http://127.0.0.1:8080/api/tasks/${data_.id}/childrens`,
                    { content: this.temporaryChild[i].content },
                    { headers, withCredentials: false }
                  )
                  .then((response) => {
                    this.mount();
                  })
                  .catch((error) => console.log(error.response.data));
            }
          })
          .catch((error) => console.log(error.response.data));
    } else {
        const getUserId  = this.users.find((user) => user.email === this.employee).id
        axios
            .post(
            `http://127.0.0.1:8080/api/employees/${getUserId}/tasks`,
            { title: this.newTaskTitle, interval: `${this.radios}` },
            { headers, withCredentials: false }
            )
            .then((response) => {
            let data_ = response.data.data;
            this.dialog = false;
            this.mount();
            for(let i = 0; i < this.temporaryChild.length; i++){
                axios
                  .post(
                    `http://127.0.0.1:8080/api/employees/${getUserId}/tasks/${data_.id}/childrens`,
                    { content: this.temporaryChild[i].content },
                    { headers, withCredentials: false }
                  )
                  .then((response) => {
                    this.mount();
                  })
                  .catch((error) => console.log(error.response.data));
            }
            })
            .catch((error) => console.log(error.response.data));
    }
  }
},
deleteTask(task) {
    const headers = {
        Authorization: this.headersManager,
    };

    if(task.assigner === null) {
        this.assigner = false;
    } else {
        this.assigner = true;
    }
    if(task.is_assigner !== undefined) {
        this.assigner = task.is_assigner;
    }

    this.dialogDelete = false;
    
    if(this.assigner === false) {
        const findTask = this.filtered.find((tasks) => tasks.id === task.id);
        const index = this.filtered.findIndex((task) => task.id === findTask.id);
        this.filtered.splice(index, 1);
        this.showDialog = false;

        // delete data
        axios
            .delete(`http://127.0.0.1:8080/api/tasks/${task.id}`, {
            headers,
            withCredentials: false,
            })
            .then((response) => {
                let data_ = response.status;
                this.taskId = "";
            })
            .catch((error) => console.log(error.response.data));
    } else {
      this.massage = "Cannot Delete Task Create by Assigner"
      this.snackbar = true;
    }
},
setDoneTask(item) {
const headers = {
  Authorization: this.headersManager,
};
if (item.status === "cancel" || item.status === "failed" || item.status === "pending") {

} else {
  if (item.status !== "done") {
        item.status = "done";
        item.is_pinned = false;
        axios
        .patch(
            `http://127.0.0.1:8080/api/tasks/${item.id}`,
            { status: "done", is_pinned: "false" },
            { headers }
        )
        .then((response) => {
        })
        .catch((error) => {
            console.log(error.response);
        });
  } else if (item.status === "done") {
        item.status = "undone";
        item.is_pinned = false;
        axios
        .patch(
            `http://127.0.0.1:8080/api/tasks/${item.id}`,
            { status: "none" },
            { headers }
        )
        .then((response) => {
        })
        .catch((error) => {
            console.log(error.response.data);
        });
  }
}
},
handleInputTitle(event) {
    // Ambil nilai dari input field "Kolom title harus berupa karakter"
    const value = event.target.value;

    // Simpan nilai ke reactive variable
    this.taskTitle = value;
},
updateTitle(item) {
    const headers = {
        Authorization: this.headersManager,
    };

    if(this.taskTitle !== "") {
        axios
        .patch(
            `http://127.0.0.1:8080/api/tasks/${item.id}`,
            { title: this.taskTitle },
            { headers }
        )
        .then((response) => {
            let data_ = response.data;
            this.mount();
        })
        .catch((error) => console.log(error.response.data));
    }
},
updateNote(task) {
    const headers = {
        Authorization: this.headersManager,
    };
    axios
    .patch(
        `http://127.0.0.1:8080/api/tasks/${task.id}`,
        { note: this.note },
        { headers }
    )
    .then((response) => {
        let data_ = response.data;
        console.log(data_);
    })
    .catch((error) => console.log(error.response.data));
},
getChildrens(item) {
    this.loadingSubtask = true;
    this.childrens = [];
    const headers = {
        Authorization: this.headersManager,
    };

    if(this.viewEmployee === "" || this.viewEmployee === null || this.viewEmployee === undefined){
        axios
        .get(`http://127.0.0.1:8080/api/tasks/${item.id}`, { headers })
        .then((response) => {
            let data = response.data.data.childrens;
            this.childrens = data;
            this.loadingSubtask = false;
        })
        .catch((error) => console.log(error.response.data));
    } else {
        const getUserId  = this.users.find((user) => user.email === this.viewEmployee).id
        axios
        .get(`http://127.0.0.1:8080/api/employees/${getUserId}/tasks/${item.id}`, { headers })
        .then((response) => {
            let data = response.data.data.childrens;
            this.childrens = data;
            this.loadingSubtask = false;
        })
        .catch((error) => console.log(error.response.data));
    }

},
setDoneSub(item, sub) {
    const headers = {
    Authorization: this.headersManager,
    };
    const getSubtask = this.childrens.find((subnote) => subnote.id === sub.id);
    const getTask = this.filtered.find((tasks) => tasks.id === item.id);
    if (sub.status !== "done") {
        getSubtask.status = "done";
        axios
            .patch(
            `http://127.0.0.1:8080/api/tasks/${item.id}/childrens/${sub.id}`,
            { status: "done" },
            { headers }
            )
            .then((response) => {
            let data_ = response.status;
            })
            .catch((error) => console.log(error.response.data));
    } else {
        getSubtask.status = "none";
        axios
            .patch(
            `http://127.0.0.1:8080/api/tasks/${item.id}/childrens/${sub.id}`,
            { status: "none" },
            { headers }
            )
            .then((response) => {
            let data_ = response.status;
            })
            .catch((error) => console.log(error.response.data));
    }
},
handleInput(event) {
    // Ambil nilai dari input field
    const value = event.target.value;

    // Simpan nilai ke reactive variable
    this.subtaskTitle = value;
},
updateSubtask(item, sub) {
    const headers = {
        Authorization: this.headersManager,
    };
    if(this.subtaskTitle !== "") {
        axios
        .patch(
            `http://127.0.0.1:8080/api/tasks/${item.id}/childrens/${sub.id}`,
            { content: this.subtaskTitle },
            { headers }
        )
        .then((response) => {
            let data_ = response.status;
        })
        .catch((error) => console.log(error.response.data));
    }
},
enterSubtask(event, task) {
if (event.keyCode === 13) {
  this.addSubtask(task);
  this.subtask = "";
}
},
addSubtask(task) {
    const headers = {
    Authorization: this.headersManager,
    };

    if(this.subtask !== "") {
        if(this.employee === "" || this.employee === null) {
            axios
                .post(
                `http://127.0.0.1:8080/api/tasks/${task.id}/childrens`,
                { content: this.subtask },
                { headers }
                )
                .then((response) => {
                console.log(response.status);
                axios
                    .get(`http://127.0.0.1:8080/api/tasks/${task.id}`, { headers })
                    .then((response) => {
                    let data_ = response.data;
                    this.details = data_;
                    let note = this.details.data.note;
                    this.note = note;
            
                    let data2 = response.data.data.childrens;
                    this.childrens = data2;
                    })
                    .catch((error) => console.log(error.response.data));
                })
                .catch((error) => console.log(error.response.data));
            
                this.subtask = "";
        } else {
            console.log("for employee")
            const getUserId  = this.users.find((user) => user.email === this.employee).id
            axios
                .post(
                `http://127.0.0.1:8080/api/employees/${getUserId}/tasks/${task.id}/childrens`,
                { content: this.subtask },
                { headers, withCredentials: false }
                )
                .then((response) => {
                    let data_ = response.data;
                    this.details = data_;
            
                    let data2 = response.data.data.childrens;
                    this.childrens = data2;
                })
                .catch((error) => console.log(error.response.data));
        }
    }
},
deleteSubTask(item, sub) {
    const headers = {
        Authorization: this.headersManager,
    };

    const getSubnote = this.childrens.find((subnote) => subnote.id === sub.id);
    const index = this.childrens.findIndex((subnote) => subnote.id === getSubnote.id);
    this.childrens.splice(index, 1);

    const getTask = this.filtered.find((tasks) => tasks.id === item.id);

    axios
    .delete(
        `http://127.0.0.1:8080/api/tasks/${item.id}/childrens/${sub.id}`,
        {
        headers,
        withCredentials: false,
        }
    )
    .then((response) => {
        let data_ = response.status;
        this.mount()
    })
    .catch((error) => console.log(error.response.data));
},
enterSubtask(event, task) {
    if (event.keyCode === 13) {
        this.addSubtask(task);
        this.subtask = "";
    }
},
enterSubtaskTempo(event) {
    if (event.keyCode === 13) {
        this.addTemporaryChild();
        this.subtask = "";
    }
},
addTemporaryChild() {
    if(this.subtask !== "") {
        this.temporaryChild.push({content: this.subtask});
        this.subtask = "";
    }
},
deleteTemporaryChild(sub) {
    const index = this.childrens.findIndex((subtask) => subtask.content === sub.content);
    this.temporaryChild.splice(index, 1);
},
clearTemporaryData() {
    this.newTaskTitle = "";
    this.radios = "";
    this.subtask = "";
    this.employee = "";
    this.addNote = "";
    this.temporaryChild = [];
},

deleteTaskMessage(item) {
    this.taskId = item.id;
    this.dialogDelete = true;
},
deleteTaskConfirm () {
    const headers = {
        Authorization: this.headersManager,
    };

    const findTask = this.filtered.find((tasks) => tasks.id === this.taskId);
    const index = this.filtered.findIndex((task) => task.id === findTask.id);
    // if(task.assigner === null) {
    //     this.assigner = false;
    // } else {
    //     this.assigner = true;
    // }
    // if(task.is_assigner !== undefined) {
    //     this.assigner = task.is_assigner;
    // }

    if(findTask.is_assigner === false) {
        this.filtered.splice(index, 1);

        this.dialogDelete = false;

        // delete data
        axios
            .delete(`http://127.0.0.1:8080/api/tasks/${this.taskId}`, {
            headers,
            withCredentials: false,
            })
            .then((response) => {
            let data_ = response.status;
            this.taskId = "";
            })
            .catch((error) => console.log(error.response.data));
    } else {
        this.massage = "Cannot Delete Task Create by Assigner"
        this.snackbar = true;
    }
},

sendDetails(item) {
    this.details = {};
    this.showDialog = true;
    this.loadingCircle = true;
    const headers = {
        Authorization: this.headersManager,
    };

    if(this.viewEmployee === "" || this.viewEmployee === null || this.viewEmployee === undefined) {
      axios
        .get(`http://127.0.0.1:8080/api/tasks/${item.id}`, { headers })
        .then((response) => {
          this.loadingCircle = false;
    
          let data_ = response.data;
          this.details = data_;
    
          let note = this.details.data.note;
          this.note = note;
    
          let taskTitle = this.details.data.title;
          this.taskTitle = taskTitle;
    
          let data2 = response.data.data.childrens;
          this.childrens = data2;
    
          let endDate = response.data.data.end_at;
          this.endDate = endDate;
    
          let startDate = response.data.data.start_at;
          this.startDate = startDate;
        })
        .catch((error) => console.log(error.response.data));
    } else {
        const getUserId  = this.users.find((user) => user.email === this.viewEmployee).id
        axios
            .get(`http://127.0.0.1:8080/api/employees/${getUserId}/tasks/${item.id}`, { headers })
            .then((response) => {
            this.loadingCircle = false;
        
            let data_ = response.data;
            this.details = data_;
        
            let note = this.details.data.note;
            this.note = note;
        
            let taskTitle = this.details.data.title;
            this.taskTitle = taskTitle;
        
            let data2 = response.data.data.childrens;
            this.childrens = data2;
        
            let endDate = response.data.data.end_at;
            this.endDate = endDate;
        
            let startDate = response.data.data.start_at;
            this.startDate = startDate;
            })
            .catch((error) => console.log(error.response.data));
  }

},

viewEmpTasksMount() {
  const headers = {
    Accept: "application/json",
    Authorization: this.headersManager,
  };

  if(this.viewEmployee === "" || this.viewEmployee === null || this.viewEmployee === undefined){
    this.mount();
  } else {
      const getUserId  = this.users.find((user) => user.email === this.viewEmployee).id
      axios
        .get(`http://127.0.0.1:8080/api/employees/${getUserId}/tasks`, {
          headers,
        })
        .then((response) => {
            let data_ = response.data.data;
            this.tasks = data_;
            this.loading = false;
            this.tableLoading = false;
            this.truncatedTitle();
            this.sortTasksMount();
            this.statusMount();
        })
        .catch((error) => console.log(error.response.data));
  }
},

},

mounted() {
    this.tableLoading = true;
    this.loading = true;
    const headers = {
        Accept: "application/json",
        Authorization: this.headersManager,
    };

    this.mount();

    setTimeout(()=> {
        axios
            .get("http://127.0.0.1:8080/api/users", { headers })
            .then((response) => {
                this.users = response.data.data;
            })
            .error((error) => {
                console.log(error.response.data);
            });
    },0)

    window.addEventListener("resize", () => {
        this.mount();
    });
},

computed: {
  sortedTasks() {
    const pinnedTasks = this.tasks.filter((task) => task.is_pinned === true || task.is_pinned === 'true');
    const undoneTasks = this.tasks.filter((task) => !task.is_pinned === true && task.status === "undone" || !task.is_pinned === true && task.status === "none");
    const pendingTasks = this.tasks.filter((task) => !task.is_pinned === true && task.status === "pending" || !task.is_pinned === 'true' && task.status === "pending");
    const cancelTasks = this.tasks.filter((task) => !task.is_pinned === true && task.status === "cancel" || !task.is_pinned === 'true' && task.status === "cancel");
    const failedTasks = this.tasks.filter((task) => !task.is_pinned === true && task.status === "failed" || !task.is_pinned === 'true' && task.status === "failed");
    const doneTasks = this.tasks.filter((task) => !task.is_pinned === true && task.status === "done" || !task.is_pinned === 'true' && task.status === "done" || !task.is_pinned === 'true' && task.status === "completed" || !task.is_pinned === true && task.status === "completed");
    
    const sortedPinned = pinnedTasks.sort((a, b) => {return new Date(b.start_at) - new Date(a.start_at);});
    const sortedUndone = undoneTasks.sort((a, b) => {return new Date(b.start_at) - new Date(a.start_at);});
    
    this.filtered = [...sortedPinned, ...sortedUndone, ...pendingTasks, ...cancelTasks, ...failedTasks, ...doneTasks];
    return this.filtered
  },
},

watch: {
  selectedInterval() {
    this.mount();
  }
}

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