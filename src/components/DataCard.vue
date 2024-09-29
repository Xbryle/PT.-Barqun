<template>
    <div>
        
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
    dialog: false,
    dialogDelete: false,
    loadingSubtask: false,
    showDialog: false,
    loadingCircle: false,
    tableLoading: false,
    permitDelete: false,
    tasks: [],
    filtered: [],
    desserts: [],
    childrens: [],
    users: [],
    names: [],
    details: {},
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
    newTaskTitle: "",
    subtaskTitle: "",
    subtask: "",
    taskTitle: "",
    employee: "",
    radios: "",
    note: "",
    search: "",
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
  axios
    .get("http://127.0.0.1:8080/api/tasks", {
      headers,
    })
    .then((response) => {
      let data_ = response.data.data;
      this.tasks = data_;
      this.truncatedTitle();
      this.sortTasksMount();
      this.statusMount();
    })
    .catch((error) => console.log(error));
},
sortTasksMount() {
    const pinnedTasks = this.tasks.filter((task) => task.is_pinned === true || task.is_pinned === 'true');
    const undoneTasks = this.tasks.filter((task) => !task.is_pinned === true && task.status === "undone" || !task.is_pinned === true && task.status === "none");
    const pendingTasks = this.tasks.filter((task) => !task.is_pinned === true && task.status === "pending" || !task.is_pinned === 'true' && task.status === "pending");
    const cancelTasks = this.tasks.filter((task) => !task.is_pinned === true && task.status === "cancel" || !task.is_pinned === 'true' && task.status === "cancel");
    const failedTasks = this.tasks.filter((task) => !task.is_pinned === true && task.status === "failed" || !task.is_pinned === 'true' && task.status === "failed");
    const doneTasks = this.tasks.filter((task) => !task.is_pinned === true && task.status === "done" || !task.is_pinned === 'true' && task.status === "done");

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
    if (status === 'done') return '#00c52bec'
    else if (status === 'none' || status === 'undone') return 'gray'
    else if (status === 'failed') return 'red'
    else if (status === 'pending') return 'orange'
    else if (status === 'cancel') return 'black'
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
            { title: this.newTaskTitle, interval: `${this.radios}` },
            { headers, withCredentials: false }
          )
          .then((response) => {
            let data_ = response.data.data;
            this.dialog = false;
            this.mount();
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
            })
            .catch((error) => console.log(error.response.data));
    }
  }
},
deleteTask(item) {
    const headers = {
        Authorization: this.headersManager,
    };

    this.dialogDelete = true;

    if(this.permitDelete === true) {
        const findTask = this.filtered.find((tasks) => tasks.id === item.id);
        const index = this.filtered.findIndex((task) => task.id === findTask.id);
        this.filtered.splice(index, 1);
    
        // delete data
        axios
            .delete(`http://127.0.0.1:8080/api/tasks/${item.id}`, {
            headers,
            withCredentials: false,
            })
            .then((response) => {
            let data_ = response.status;
            })
            .catch((error) => console.log(error.response.data));
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

      axios
        .get(`http://127.0.0.1:8080/api/tasks/${item.id}`, { headers })
        .then((response) => {
          let data = response.data.data.childrens;
          this.childrens = data;
          this.loadingSubtask = false;
        })
        .catch((error) => console.log(error.response.data));
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
            console.log(data_);
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
            console.log(data_);
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

sendDetails(item) {
  this.details = {};
  this.showDialog = true;
  this.loadingCircle = true;
  const headers = {
    Authorization: this.headersManager,
  };

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
},


},

mounted() {
    this.tableLoading = true;
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
            let data = response.data.data;
            this.tasks = data;
            this.loading = false;
            this.tableLoading = false;
            this.truncatedTitle();
            this.sortTasksMount();
            this.statusMount();
        })
        .catch((error) => console.log(error));

    setTimeout(()=> {
        axios
            .get("http://127.0.0.1:8080/api/users", { headers })
            .then((response) => {
                this.users = response.data.data;
                this.names = this.users.map((user) => user.name);
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
    const doneTasks = this.tasks.filter((task) => !task.is_pinned === true && task.status === "done" || !task.is_pinned === 'true' && task.status === "done");
    
    const sortedPinned = pinnedTasks.sort((a, b) => {return new Date(b.start_at) - new Date(a.start_at);});
    const sortedUndone = undoneTasks.sort((a, b) => {return new Date(b.start_at) - new Date(a.start_at);});
    
    this.filtered = [...sortedPinned, ...sortedUndone, ...pendingTasks, ...cancelTasks, ...failedTasks, ...doneTasks];
    return this.filtered
  },
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