<template>
  <div style="width: 100%; position: inline; overflow: visible !important;">
    
    <v-snackbar
      v-model="snackbar"
      absolute
      bottom
      :timeout="1000"
      class="snack"
      style="z-index: 9999;"
    >
        {{massage}}
    </v-snackbar>

    <v-dialog v-model="showDialog" max-width="600px">

      <v-progress-circular
        v-show="loadingCircle"
        indeterminate
        style="z-index: 888; position: absolute; top: 45%; left: 50%;"
      ></v-progress-circular>

      <v-container class="details-pop" v-for="task in details" :key="task.id">
        <v-subheader class="px-0 d-flex mb-n4">
          <h4 style="font-weight: 500" class="mr-3">Weekly</h4>
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
                    v-if="task.status === 'undone' || task.status === 'pending' || task.status === 'none'"
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
                    @click="pinnedTask(task)"
                    v-if="task.status === 'undone' || task.status === 'pending' || task.status === 'none'"
                    style="font-size: 0.9rem; cursor: pointer; z-index: 888"
                    class="pinned-icon fa-solid fa-thumbtack mr-8"
                  ></i>
              </template>
              <span>Pin</span>
          </v-tooltip>

          <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                  <i
                    v-on="on"
                    v-bind="attrs"
                    @click="closeDetails"
                    style="font-size: 1.1rem; cursor: pointer; z-index: 888"
                    class="close-icon fa-solid fa-xmark"
                  ></i>
              </template>
              <span>Close</span>
          </v-tooltip>

        </v-subheader>

        <v-textarea id="tittle" :disabled="task.assigner !== null" @blur="updateTitle(task)" rows="1" placeholder="Add Title" style="font-size: 1.3rem; outline: none; font-weight: 600" class="mb-5 bottom-border-area" v-model="taskTitle" auto-grow></v-textarea>

        <v-subheader class="mt-n5 py-0 px-0">
          <h4
            style="font-weight: 600; margin-top: -1px; font-size: 0.8rem"
            class="mr-2"
          >
            end at
          </h4>
          <h4 style="font-weight: 600; font-size: 0.7rem">{{ task.end_at }}</h4>
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

        <v-textarea id="note" @blur="updateNote(task)" rows="1" placeholder="Add Note" class="mb-2 bottom-border-area" v-model="note" auto-grow></v-textarea>


        <v-subheader class="px-0 py-0">SUBTASK</v-subheader>

        <v-col
          cols="12"
          style="position: relative"
          class="px-0"
          v-for="sub in subTasks"
          :key="sub.id"
        >
        <div class="grid-template">
          <i
            style="cursor: pointer; width: fit-content;"
            class="noned fa-regular fa-circle"
            @click="setDoneSub(task, sub)"
            v-if="sub.status === 'none'"
          ></i>
          <i
            style="cursor: pointer; width: fit-content;"
            class="doned fa-solid fa-circle-check"
            @click="setDoneSub(task, sub)"
            v-else
          ></i>
            <input
              :style="sub.status === 'done' ? { textDecoration: 'line-through' } : { textDecoration: 'none' }"
              v-model="sub.content"
              contenteditable="true"
              type="text"
              id="subtask"
              style="outline: none; width: 100%;"
              name="note"
              @blur="updateSubtask(task, sub)"
              @input="handleInput"
              :disabled="task.assigner !== null"
            />
            <i
              style="font-size: 0.7rem; cursor: pointer;"
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

    <v-col cols="12" class="mt-n5 outer-add-task">
      <div
        class="input-task d-flex align-center pr-5"
        style="position: relative"
      >
        <i style="font-size: 1.1rem" class="fa-solid fa-list-check mr-4"></i>
        <input
          type="text"
          v-model="newTaskTitleWeekly"
          @keydown="addWeekly($event)"
          placeholder="Add Title"
        />
      </div>
    </v-col>

    <div
      style="width: 100%; height: 270px; position: relative"
      class="py-0 scroller px-3"
    >

      <v-col
        cols="12"
        class="mb-3 task"
        v-for="task in sortedTasks"
        :key="task.id"
        v-bind:id="`task-${task.id}`"
      >
        <div class="d-flex" style="position: relative">
          <div @click="setDone(task)" class="d-flex align-center" style="width: 100%;">
            <i
              class="fa-regular fa-square mr-4"
              :style="
                task.status !== 'done'
                  ? { display: 'inline' }
                  : { display: 'none' }
              "
            ></i>
            <i
              class="fa-solid fa-square-check mr-4"
              :style="
                task.status === 'done'
                  ? { display: 'inline' }
                  : { display: 'none' }
              "
            ></i>
            <div style="width: 100%;">
              <v-list-item-title class="py-0 my-0 d-flex"
                style="cursor: pointer; font-size: 1rem; font-weight: 400;"
                :style="task.status === 'done'
                      ? { textDecoration: 'line-through' }
                      : { textDecoration: 'none' }">{{ task.truncatedContent }}
                  
              </v-list-item-title>
  

              <v-list-item-subtitle style="font-size: 0.7rem; display: flex;">
                <span v-if="task.end_at !== null">end</span>
                <span v-if="task.end_at !== null" class="ms-1" style="color: green">{{ task.end_at }} </span>
                <div v-if="task.childrens_total !== 0" class="ms-1" style="display: flex; width: inherit; justify-content: start; align-items: center; padding: 0;">
                  <i style="cursor: pointer; width: fit-content; scale: .7; margin-right: 2px; margin-top: 0.5px;"
                    class="fa-solid fa-square-check"></i>
                  <v-list-item-subtitle class="px-0 py-0" style="font-size: .5rem; color: #000000;">{{task.childrens_done}}/{{task.childrens_total}}</v-list-item-subtitle>
                </div>
              </v-list-item-subtitle>
            </div>
          </div>

          <div style="position: relative">
              <v-list-item-subtitle
                class="status"
                :style="taskStatusColor(task)"
                >{{ task.status === "none" ? "undone" : task.status && task.status === "completed" ? "done" : task.status }}</v-list-item-subtitle>

            <div div class="d-flex" style="justify-content: end; align-items: center; padding-right: 15px;">
              <i
                v-if="task.is_pinned === true || task.is_pinned === 'true'"
                style="font-size: 0.8rem; cursor: pointer;"
                class="pre-pinned-icon fa-solid fa-thumbtack mr-n1"
              ></i>
              <i
                id="more"
                class="fa-solid fa-ellipsis-vertical ml-3 more"
                size="15px"
                @click="showDetails(task)"
                v-click-outside="() => remove(task)"
              ></i>
            </div>

            <div
              v-if="task.id"
              v-bind:id="`details-${task.id}`"
              class="details"
            >
              <v-btn
                @click="sendDetails(task)"
                class="btn-detail"
                style="text-transform: none; letter-spacing: 0"
                ><i
                  style="font-size: 0.8rem"
                  class="fa-solid fa-circle-info mr-1"
                ></i
                >Detail</v-btn
              >
              <v-btn
                @click="deleteTask(task)"
                class="btn-delete"
                style="text-transform: none; letter-spacing: 0"
                ><i style="font-size: 0.7rem" class="fa-solid fa-trash mr-1"></i
                >Delete</v-btn
              >
            </div>

          </div>
        </div>
      </v-col>

      <v-progress-linear
        :active="loading"
        indeterminate
        absolute
        bottom
        rounded
        height="1px"
        color="black"
        style="z-index: 888; width: 100%;"
      ></v-progress-linear>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
data: () => ({
  headersManager: localStorage.getItem('token'),
  weeklys: [],
  filtered: [],
  subTasks: [],
  newestTask: {},
  details: {},
  newTaskTitleWeekly: "",
  endDate: "",
  note: "",
  subtask: "",
  taskTitle: "",
  subtaskTitle: "",
  startDate: "",
  massage: "",
  assigner: false,
  showDialog: false,
  looped: true,
  snackbar: false,
  loading: false,
  loadingCircle: false,
}),

methods: {

// mount
truncatedTitle() {
  this.filtered = this.weeklys.filter((task) => task.title.length);
  for (let i = 0; i < this.filtered.length; i++) {
    if(window.innerWidth > 400 && window.innerWidth < 1100) {
      if(this.filtered[i].title.length > 13){
        const truncatedTitle = this.filtered[i].title.slice(0, 13) + '....';
        this.filtered[i].truncatedContent = truncatedTitle;
      } else {
        const truncatedTitle = this.filtered[i].title;
        this.filtered[i].truncatedContent = truncatedTitle;
      }
    } else if(window.innerWidth < 400) {
      if(this.filtered[i].title.length > 8){
        const truncatedTitle = this.filtered[i].title.slice(0, 8) + '....';
        this.filtered[i].truncatedContent = truncatedTitle;
      } else {
        const truncatedTitle = this.filtered[i].title;
        this.filtered[i].truncatedContent = truncatedTitle;
      }
    } else if(window.innerWidth > 1100) {
      if(this.filtered[i].title.length > 25){
        const truncatedTitle = this.filtered[i].title.slice(0, 25) + '....';
        this.filtered[i].truncatedContent = truncatedTitle;
      } else {
        const truncatedTitle = this.filtered[i].title;
        this.filtered[i].truncatedContent = truncatedTitle;
      }
    }
  }
},
mount() {
  const headers = {
    Accept: "application/json",
    Authorization: this.headersManager,
  };
  axios
  .get("http://127.0.0.1:8080/api/tasks?filter[interval]=weekly", {
    headers,
  })
  .then((response) => {
    let data_ = response.data.data;
    this.weeklys = data_;
    this.loading = false;
    this.truncatedTitle();
  })
  .catch((error) => console.log(error));
},
sortTasksMount() {
  const pinnedTasks = this.weeklys.filter((task) => task.is_pinned === true || task.is_pinned === 'true');
  const undoneTasks = this.weeklys.filter((task) => !task.is_pinned === true && task.status === "undone" || !task.is_pinned === true && task.status === "none");
  const pendingTasks = this.weeklys.filter((task) => !task.is_pinned === true && task.status === "pending" || !task.is_pinned === 'true' && task.status === "pending");
  const cancelTasks = this.weeklys.filter((task) => !task.is_pinned === true && task.status === "cancel" || !task.is_pinned === 'true' && task.status === "cancel");
  const failedTasks = this.weeklys.filter((task) => !task.is_pinned === true && task.status === "failed" || !task.is_pinned === 'true' && task.status === "failed");
  const doneTasks = this.weeklys.filter((task) => !task.is_pinned === true && task.status === "done" || !task.is_pinned === 'true' && task.status === "done" || !task.is_pinned === 'true' && task.status === "completed" || !task.is_pinned === true && task.status === "completed");
  
  const sortedPinned = pinnedTasks.sort((a, b) => {return new Date(b.start_at) - new Date(a.start_at);});
  const sortedUndone = undoneTasks.sort((a, b) => {return new Date(b.start_at) - new Date(a.start_at);});
  
  this.filtered = [...sortedPinned, ...sortedUndone, ...pendingTasks, ...cancelTasks, ...failedTasks, ...doneTasks];
  return this.filtered
},

// tools
closeDetails() {
  if(this.showDialog === true) {
    this.showDialog = false;
  }else {
    this.showDialog = true;
  }
},
showDetails(task) {
  const detailsElement = document.getElementById(`details-${task.id}`);
  detailsElement.classList.toggle("details-show");
},
remove(task) {
  const detailsElement = document.getElementById(`details-${task.id}`);
  const clickTarget = event.target;

  // Check if the click target is a descendant of the `.details` element
  if (clickTarget === detailsElement || detailsElement.contains(clickTarget)) {
    return;
  }

  // Remove the `.details-show` class from the `.details` element
  detailsElement.classList.remove("details-show");
},

// task
taskStatusColor(task) {
if (task.status === "undone" || task.status === "none") {
    return { backgroundColor: "gray" };
}
return task.status === "done" || task.status === "completed"
    ? { backgroundColor: "#00c52bec" }
    : task.status === "pending"
    ? { backgroundColor: "orange" }
    : { backgroundColor: "red" };
},
addWeekly(event) {
  // Check if the pressed key is the Enter key.
  if (event.keyCode === 13) {
    // Call the method to add the data to the API.
    this.addWeeklyTask();
    this.newTaskTitleWeekly = "";
  }
},
addWeeklyTask() {
  const headers = {
    Authorization: this.headersManager,
  };
  const unpinnedTask = this.filtered.filter((task) => task.is_pinned === false);
  this.newestTask = {};

  axios
    .post(
      `http://127.0.0.1:8080/api/tasks?filter[interval]=weekly`,
      { title: this.newTaskTitleWeekly, interval: "weekly" },
      { headers, withCredentials: false }
    )
    .then((response) => {
      let data_ = response.data.data;
      axios
        .get("http://127.0.0.1:8080/api/tasks?filter[interval]=weekly", {
          headers,
        })
        .then((response) => {
          let data_ = response.data.data;
          this.weeklys = data_;
          this.loading = false;
          this.truncatedTitle();
          this.sortTasksMount();

          setTimeout(() => {
            const biggestIdData = this.weeklys.sort((a, b) => b.id - a.id)[0];
            this.newestTask = biggestIdData;
            const all = document.getElementById(`task-${biggestIdData.id}`);
            all.style.transform = 'translateY(0)';
            // for (let i = 0; i <= unpinnedTask.length; i++) {
            //   const tasks = document.querySelector(`#task-${unpinnedTask[i].id}`);
            //   tasks.classList.add("others-task-in");
            //   setTimeout(() => {
            //     tasks.classList.remove("others-task-in");
            //   }, 800);
            // }
          }, 0);

        })
        .catch((error) => console.log(error));
    })
    .catch((error) => console.log(error.response.data));
},
setDone(task) {
  const all = document.getElementById(`task-${task.id}`);
  
  const headers = {
    Authorization: this.headersManager,
  };
  if (task.status === "cancel" || task.status === "failed" || task.status === "pending") {
    this.snackbar = true;
    this.massage = "Not Allowed";
  } else {
    if (task.status !== "done") {
      all.style.scale = '0';
      setTimeout(()=>{
        task.status = "done";
        task.is_pinned = false;
        setTimeout(()=>{
          all.style.scale = '1';
          setTimeout(()=>{
            axios
              .patch(
                `http://127.0.0.1:8080/api/tasks/${task.id}`,
                { status: "done", is_pinned: "false" },
                { headers }
              )
              .then((response) => {
                console.log(response.status)
              })
              .catch((error) => {
                if(error.response.status === 403) {
                  this.snackbar = true;
                  this.massage = "Not Allowed";
                }
                console.log(error.response)
              });
          },310)
        },200)
      },310)

    } else if (task.status === "done") {
        all.style.scale = '0';
        setTimeout(()=>{
          task.status = "undone";
          task.is_pinned = false;
          setTimeout(()=>{
            all.style.scale = '1';
            setTimeout(()=>{
              axios
                .patch(
                  `http://127.0.0.1:8080/api/tasks/${task.id}`,
                  { status: "none" },
                  { headers }
                )
                .then((response) => {
                    console.log(response.status)
                })
                .catch((error) => {
                  if(error.response.status === 403) {
                    this.snackbar = true;
                    this.massage = "Not Allowed";
                  }
                  console.log(error.response.data)
                });
            },310)
          },200)
        },310)
    }
  }
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

  if (this.assigner === false) {
    const all = document.getElementById(`task-${task.id}`);
    axios
    .patch(
      `http://127.0.0.1:8080/api/tasks/${task.id}`,
      { status: "cancel" },
      { headers }
      )
      .then((response) => {
        all.style.scale = '0';
        let data_ = response.data.data;
        console.log(data_);
        task.status = "cancel";
        this.showDialog = false;
        console.log(response.status)
        this.massage = "Task Canceled";
        this.snackbar = true;
        axios
        .get("http://127.0.0.1:8080/api/tasks?filter[interval]=weekly", {
          headers,
        })
        .then((response) => {
          let data_ = response.data.data;
          this.weeklys = data_;

          this.truncatedTitle()
          this.sortTasksMount()
          setTimeout(()=>{
            all.style.scale = '1';
          },100)
        })
        .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error.response.data));
  } else {
    this.massage = "Cannot Cancle Task Create by Assigner"
    this.snackbar = true;
  }
},
pinnedTask(task) {
  const headers = {
    Authorization: this.headersManager,
  };
  const all = document.getElementById(`task-${task.id}`);
  const findTask = this.weeklys.find((tasks) => tasks.id === task.id);
  if(findTask.is_pinned === false) {
    console.log('if false')
    all.classList.add('task-pin-out');
    this.showDialog = false;
    setTimeout(() => {
      all.classList.remove('task-pin-out');
      setTimeout(()=>{
        all.classList.add('task-pin-in');
        setTimeout(() => {
          all.classList.remove('task-pin-in');
        },401)
      },0)
      const updateTask = { ...findTask };
      updateTask.is_pinned = true;
      const index = this.weeklys.findIndex((task) => task.id === findTask.id);
      this.weeklys.splice(index, 1, updateTask);
      this.truncatedTitle()
      this.sortTasksMount()
      this.massage = "Task Pinned";
      this.snackbar = true;
      console.log(findTask)

        axios
          .patch(
            `http://127.0.0.1:8080/api/tasks/${task.id}`,
            { is_pinned: 'true' },
            { headers }
          )
          .then((response) => {
            console.log(response.status)
          })
          .catch((error) => console.log(error.response.data));
    }, 401)
    
  } else if(findTask.is_pinned === true) {
    console.log('if true')
    all.classList.add('task-pin-out');
    this.showDialog = false;
    setTimeout(() => {
      all.classList.remove('task-pin-out');
      setTimeout(()=>{
        all.classList.add('task-pin-in');
        setTimeout(() => {
          all.classList.remove('task-pin-in');
        },401)
      },0)
      const updateTask = { ...findTask };
      updateTask.is_pinned = false;
      const index = this.weeklys.findIndex((task) => task.id === findTask.id);
      this.weeklys.splice(index, 1, updateTask);
      this.truncatedTitle()
      this.sortTasksMount()
      this.massage = "Task Unpinned";
      this.snackbar = true;
      console.log(findTask)
        axios
          .patch(
            `http://127.0.0.1:8080/api/tasks/${task.id}`,
            { is_pinned: 'false' },
            { headers }
          )
          .then((response) => {
            console.log(response.status)
          })
          .catch((error) => console.log(error.response.data));
    }, 401)
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

  if(this.assigner === false) {
    const all = document.getElementById(`task-${task.id}`);
    const currentTask = this.filtered.find((tasks) => tasks.id === task.id);
    const currentIndex = this.filtered.findIndex((tasks) => tasks.id === currentTask.id);
    const adjustedIndex = currentIndex === 0 ? currentIndex : currentIndex + 1;
    const slicedAndMappedTasks = this.filtered.slice(adjustedIndex);
    
    // fake delete
    all.style.scale = ".5";
    setTimeout(() => {
      all.style.transform = "translateX(100%)";
      all.style.opacity = "0";
      setTimeout(()=>{
        for (let i = 0; i < slicedAndMappedTasks.length; i++) {
          const tasks = document.querySelector(`#task-${slicedAndMappedTasks[i].id}`);
          tasks.classList.add("others-task-out");
          setTimeout(() => {
            this.showDialog = false;
            tasks.classList.remove("others-task-out");
            const findTask = this.weeklys.find((tasks) => tasks.id === task.id);
            const index = this.weeklys.findIndex((task) => task.id === findTask.id);
            this.weeklys.splice(index, 1);
          }, 400);
        }
      },400)
    }, 400);
    // delete data
    axios
      .delete(`http://127.0.0.1:8080/api/tasks/${task.id}`, {
        headers,
        withCredentials: false,
      })
      .then((response) => {
        let data_ = response.status;
      })
      .catch((error) => console.log(error.response.data));
  } else {
      this.massage = "Cannot Delete Task Create by Assigner"
      this.snackbar = true;
    }
},

// task details
setDetails(data) {
  this.details = data;
},
setSubTasks(data) {
  this.subTasks = data;
},
sendDetails(task) {
  this.assigner = false;
  this.details = {};
  this.showDialog = true;
  this.loadingCircle = true;
  const headers = {
    Authorization: this.headersManager,
  };
  setTimeout(() => {
    this.assigner = task.is_assigner;
  },0)
  axios
    .get(`http://127.0.0.1:8080/api/tasks/${task.id}`, { headers })
    .then((response) => {
      this.loadingCircle = false;

      let data_ = response.data;
      this.details = data_;

      let note = this.details.data.note;
      this.note = note;

      let taskTitle = this.details.data.title;
      this.taskTitle = taskTitle;

      let data2 = response.data.data.childrens;
      this.subTasks = data2;

      let startDate = response.data.data.start_at;
      this.startDate = startDate;

    })
    .catch((error) => console.log(error.response.data));
},
updateNote(task) {
  const headers = {
    Authorization: this.headersManager,
  };

  // let id = this.details.data.id;
  // console.log(id);
  axios
    .patch(
      `http://127.0.0.1:8080/api/tasks/${task.id}`,
      { note: this.note },
      { headers }
    )
    .then((response) => {
      let data_ = response.data;
      console.log(data_);
      console.log("done");
      // task.note = this.note;
    })
    .catch((error) => console.log(error.response.data));
},
updateTitle(task) {
  const headers = {
    Authorization: this.headersManager,
  };
  axios
    .patch(
      `http://127.0.0.1:8080/api/tasks/${task.id}`,
      { title: this.taskTitle },
      { headers }
    )
    .then((response) => {
      let data_ = response.data;
      console.log(data_);
      console.log("done");
      this.mount()
    })
    .catch((error) => console.log(error.response.data));
},
updateDateStart(task) {
  const today = new Date();

  const startDate = new Date(this.startDate);
  const formattedStartDate = `${startDate.getDate()}-${
    startDate.getMonth() + 1
  }-${startDate.getFullYear()} ${
    startDate.getHours() < 10 ? "0" + startDate.getHours() : startDate.getHours()
  }:${
    startDate.getMinutes() < 10
      ? "0" + startDate.getMinutes()
      : startDate.getMinutes()
  }`;

  const headers = {
    Authorization: this.headersManager,
  };

  if (startDate > today) {
    axios
      .patch(
        `http://127.0.0.1:8080/api/tasks/${task.id}`,
        { start_at: this.startDate, status: "pending" },
        { headers }
      )
      .then((response) => {
        this.startDate = `${formattedStartDate}`;
        this.mount();
      })
      .catch((error) => console.log(error.response.data));
  } else if (startDate < today) {
    axios
      .patch(
        `http://127.0.0.1:8080/api/tasks/${task.id}`,
        { start_at: this.startDate, status: "none" },
        { headers }
      ) 
      .then((response) => {
        this.startDate = `${formattedStartDate}`;
        this.mount();
      })
      .catch((error) => console.log(error.response.data));
  } else {
    axios
      .patch(
        `http://127.0.0.1:8080/api/tasks/${task.id}`,
        { start_at: this.startDate, status: "none" },
        { headers }
      )
      .then((response) => {
        this.startDate = `${formattedStartDate}`;
        this.mount();
      })
      .catch((error) => console.log(error.response.data));
    }
},
enterSubtask(event, task) {
  if (event.keyCode === 13) {
    // Call the method to add the data to the API.
    this.addSubtask(task);
    this.subtask = "";
  }
},
addSubtask(task) {
  const headers = {
    Authorization: this.headersManager,
  };

  const getTask = this.weeklys.find((tasks) => tasks.id === task.id);
  getTask.childrens_total = getTask.childrens_total + 1;

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
          this.subTasks = data2;

          this.showDialog = true;
        })
        .catch((error) => console.log(error.response.data));
    })
    .catch((error) => console.log(error.response.data));

    this.subtask = "";
},
handleInput(event) {
  // Ambil nilai dari input field
  const value = event.target.value;

  // Simpan nilai ke reactive variable
  this.subtaskTitle = value;
},
updateSubtask(task, sub) {
  const headers = {
    Authorization: this.headersManager,
  };
  axios
    .patch(
      `http://127.0.0.1:8080/api/tasks/${task.id}/childrens/${sub.id}`,
      { title: this.subtaskTitle },
      { headers }
    )
    .then((response) => {
      let data_ = response.data;
      console.log(data_);
      console.log("done");
      console.log(this.subtaskTitle);
      // task.note = this.note;
    })
    .catch((error) => console.log(error.response.data));
},
deleteSubTask(task, sub) {
  const headers = {
    Authorization: this.headersManager,
  };

  const getSubnote = this.subTasks.find((subnote) => subnote.id === sub.id);
  const index = this.subTasks.findIndex((subnote) => subnote.id === getSubnote.id);
  this.subTasks.splice(index, 1);

  const getTask = this.weeklys.find((tasks) => tasks.id === task.id);
  getTask.childrens_total = getTask.childrens_total - 1;

  axios
    .delete(
      `http://127.0.0.1:8080/api/tasks/${task.id}/childrens/${sub.id}`,
      {
        headers,
        withCredentials: false,
      }
    )
    .then((response) => {
      let data_ = response.status;
    })
    .catch((error) => console.log(error.response.data));
},
setDoneSub(task, sub) {
  const headers = {
    Authorization: this.headersManager,
  };
  const getSubnote = this.subTasks.find((subnote) => subnote.id === sub.id);
  const getTask = this.weeklys.find((tasks) => tasks.id === task.id);
  if (sub.status !== "done") {
    getSubnote.status = "done";
    getTask.childrens_done = getTask.childrens_done + 1;
    axios
      .patch(
        `http://127.0.0.1:8080/api/tasks/${task.id}/childrens/${sub.id}`,
        { status: "done" },
        { headers }
      )
      .then((response) => {
        let data_ = response.status;
      })
      .catch((error) => console.log(error.response.data));
  } else {
    getSubnote.status = "none";
    getTask.childrens_done = getTask.childrens_done - 1;
    axios
      .patch(
        `http://127.0.0.1:8080/api/tasks/${task.id}/childrens/${sub.id}`,
        { status: "none" },
        { headers }
      )
      .then((response) => {
        let data_ = response.status;
      })
      .catch((error) => console.log(error.response.data));
  }
},

checkEndDate() {
  const today = new Date();
  this.weeklys.forEach((task) => {
      const endDay = parseInt(task.end_at[0] + task.end_at[1]);
      const endMonth = parseInt(task.end_at[3] + task.end_at[4]);
      const endYear = parseInt(
        task.end_at[6] + task.end_at[7] + task.end_at[8] + task.end_at[9]
      );
      const endHour = parseInt(task.end_at[11] + task.end_at[12]);
      const endMinute = parseInt(task.end_at[14] + task.end_at[15]);

      const formattedEndDate = `${endYear.toString().padStart(4, '0')}-${endMonth.toString().padStart(2, '0')}-${endDay.toString().padStart(2, '0')}T${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
      const datedFormatedEndDate = new Date(formattedEndDate);

      const headers = {
        Accept: "application/json",
        Authorization: this.headersManager,
      };
      if ((datedFormatedEndDate < today && task.status === "none") ||
        (datedFormatedEndDate < today && task.status === "undone")) {
        axios
          .patch(
            `http://127.0.0.1:8080/api/tasks/${task.id}`,
            { status: "failed" },
            { headers }
          )
          .then((response) => {
            console.log(response.status);
            this.mount();
          })
          .catch((error) => {
            console.log(error.response.data);
          });
      }
  });
},


    
},

mounted() {
  this.loading = true;
    const headers = {
      Accept: "application/json",
      Authorization: this.headersManager,
    };

    axios
      .get("http://127.0.0.1:8080/api/tasks?filter[interval]=weekly", {
        headers,
      })
      .then((response) => {
        let data_ = response.data.data;
        this.weeklys = data_;
        this.loading = false;
        this.truncatedTitle();
        this.sortTasksMount();
        setTimeout(() => {
          const task = document.querySelectorAll(".task");
          for (let i = 0; i <= task.length; i++) {
            task[i].style.transform = 'translateY(0)';
          }
        }, 0);
        this.checkEndDate();
      })
      .catch((error) => console.log(error));
},

computed: {
  sortedTasks() {
      const pinnedTasks = this.weeklys.filter((task) => task.is_pinned === true || task.is_pinned === 'true');
      const undoneTasks = this.weeklys.filter((task) => !task.is_pinned === true && task.status === "undone" || !task.is_pinned === true && task.status === "none");
      const pendingTasks = this.weeklys.filter((task) => !task.is_pinned === true && task.status === "pending" || !task.is_pinned === 'true' && task.status === "pending");
      const cancelTasks = this.weeklys.filter((task) => !task.is_pinned === true && task.status === "cancel" || !task.is_pinned === 'true' && task.status === "cancel");
      const failedTasks = this.weeklys.filter((task) => !task.is_pinned === true && task.status === "failed" || !task.is_pinned === 'true' && task.status === "failed");
      const doneTasks = this.weeklys.filter((task) => !task.is_pinned === true && task.status === "done" || !task.is_pinned === 'true' && task.status === "done" || !task.is_pinned === 'true' && task.status === "completed" || !task.is_pinned === true && task.status === "completed");
      
      const sortedUndone = undoneTasks.sort((a, b) => {return new Date(b.start_at) - new Date(a.start_at);});
      
      this.filtered = [...pinnedTasks, ...sortedUndone, ...pendingTasks, ...cancelTasks, ...failedTasks, ...doneTasks];
      return this.filtered
  },
},

}
</script>

<style scoped>

.task {
  position: relative;
  box-shadow: 0 1px 2px #00000053;
  border: 1px solid #edecec;
  border-radius: 15px;
  padding: 0 15px;
  padding-right: 0;
  cursor: pointer;
  transform: translateY(-500%);
  transition: all 0.4s ease;
}

.task-in {
  animation: taskIntro 0.4s ease;
}
@keyframes taskIntro {
  0% {
    z-index: 999;
    opacity: 0;
    transform: translateY(-500%);
  }
  99% {
    z-index: 999;
  }
  100% {
    z-index: 1;
    opacity: 1;
    transform: translateY(0);
  }
}

.others-task-in {
  animation: othersTaskIntro 0.4s ease;
}
@keyframes othersTaskIntro {
  0% {
    transform: translateY(-70px);
  }
  100% {
    transform: translateY(0);
  }
}

.others-task-out {
  animation: othersTaskOutro 0.4s ease;
}
@keyframes othersTaskOutro {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-70px);
  }
}

.task-pin-in {
  animation: taskPinIn 0.4s ease forwards;
}
@keyframes taskPinIn {
  0% {
    scale: 0;
  }
  100% {
    scale: 1;
  }
}
.task-pin-out {
  animation: taskPinOut 0.4s ease forwards;
}
@keyframes taskPinOut {
  0% {
    scale: 1;
  }
  100% {
    scale: 0;
  }
}

.input-task {
  position: relative;
  box-shadow: 0 1px 2px #00000053;
  border: 1px solid #edecec;
  border-radius: 10px;
  padding: 10px 15px;
  padding-right: 0;
  cursor: pointer;
  transition: all 0.1s ease-out;
}
.input-task input {
  width: 100%;
  outline: none;
}
.input-task input:focus .input-task {
  border: 1px solid blue;
}

.task:hover {
  box-shadow: 0 3px 3px #00000053;
  /* transform: translateY(-1px); */
}

.more {
  z-index: 20;
  color: #000000;
  padding: 10px;
  width: min-content;
  background-color: transparent;
  position: relative;
  right: 0;
}

.pre-pinned-icon {
  color: rgb(255, 115, 0);
}
.more:hover {
  color: #4b97f0;
}

.status {
  border-radius: 0 15px 0 15px;
  padding: 1px 15px;
  padding-bottom: 3px;
  display: flex;
  align-items: center;
  font-size: 0.7rem;
  color: #ffffff;
}

.add-task {
  transition: all 0.1s ease-out;
}
.add-task:hover {
  color: #5841e5;
}

input.add-daily {
  background-color: #ffffff;
  box-shadow: 0 1px 1px #00000089;
  border: 1px solid #0000001a;
  border-radius: 10px;
  max-width: 150px;
  height: fit-content;
  font-size: 0.8rem;
  padding: 0 10px;
  outline: none;
}
input.add-daily:focus {
  border: 1px solid #5800faba;
}

.details {
  display: flex;
  position: absolute;
  top: 15%;
  right: 110%;
  z-index: -1;
  gap: 10px;
  opacity: 0;
  scale: 0.9;
  transition: all 0.1s ease;
}
.details-show {
  display: flex;
  opacity: 1;
  scale: 1;
  z-index: 1;
}

.btn-detail {
  transition: all 0.1s ease;
}
.btn-delete {
  transition: all 0.1s ease;
}
.btn-detail:hover {
  background-image: linear-gradient(to top right, #5841e5, #4b97f0);
  color: #ffffff;
}
.btn-delete:hover {
  background-image: linear-gradient(to top right, #5841e5, #4b97f0);
  color: #ffffff;
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
  grid-template-columns: .5fr 87% 1fr;
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


@keyframes a {
  0% {
    scale: 0;
  }
  100% {
    scale: 1;
  }
}


.weeklys-intro-animation {
  /* animation: intro .3s ease forwards; */
}
.weeklys-outro-animation {
  /* animation: outro .3s ease forwards; */
}

@keyframes intro {
  0% {
    opacity: 0;
    scale: .5;
  }
  100% {
    opacity: 1;
    scale: 1;
  }
}
@keyframes outro {
  0% {
    opacity: 1;
    scale: 1;
  }
  100% {
    opacity: 0;
    scale: .5;
  }
}

.snack {
  bottom: 10%;
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