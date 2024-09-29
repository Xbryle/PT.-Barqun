<template>
  <div>
    <v-card
    id="banner"
          height="723px"
          max-height="723px"
          class="banner py-3 px-7"
          style="position: relative; box-shadow: 0px 3px 5px #888888"
        >
          <v-card-title class="d-flex mb-3 px-0">
            <h2 class="mr-1" style="font-weight: 600; font-size: 1.3rem">
              Notes
            </h2>
            <v-icon color="black" size="25">mdi mdi-plus-circle-outline</v-icon>
            <v-spacer></v-spacer>
            <i class="fa-regular fa-square-plus" @click="showAddNote" style="cursor: pointer; z-index: 1;"></i>
          </v-card-title>

          <div
            class="scroller"
            style="
              overflow-y: scroll;
              overflow-x: visible;
              height: 85%;
              padding: 5px 5px;
            "
          >

            <v-card
              class="note-add mb-5"
              style="border-radius: 10px; cursor: pointer; position: relative;"
              v-if="addNoteInput === true"
            >
              <v-card-subtitle class="py-1">
                <v-textarea rows="1" placeholder="Add Note" @keydown="addNoteKey($event)" class="add-note py-0 px-1 bottom-border-area" v-model="addNoteContent" auto-grow ref="addNoteTextarea">
                  <template v-slot:prepend-inner>
                      <v-icon size="medium" style="margin-top: 1px; margin-left: -3px; margin-right: 3px;">fa-solid fa-marker</v-icon>
                  </template>
                </v-textarea>
              </v-card-subtitle>
            </v-card>

            <v-card
              class="note mb-5"
              style="border-radius: 10px; cursor: pointer; position: relative;"
              v-for="note in sortedNotes"
              :key="note.id"
              v-bind:id="`note-${note.id}`"
            >
            <i
              style="font-size: 0.8rem; cursor: pointer;"
              class="fa-solid fa-thumbtack mr-4 pinned-note"
              v-if="note.status === 'pinned'"
            ></i>
            <i size="15px" color="#000000" style="position: absolute; width: 20px; display: flex; justify-content: center; top: 10px; right: 1%; z-index: 1;" class="fa-solid fa-ellipsis-vertical" @click="showDetails(note)" v-click-outside="() => remove(note)"
                ></i>
              <v-card-title style="font-size: 1rem">
                <v-textarea id="titleTextarea" @blur="updateNoteTitle(note)" rows="1" placeholder="Add Title" class="add-title bottom-border-area py-0 px-1 mb-1" v-model="note.title" auto-grow></v-textarea>
                <v-spacer></v-spacer>
              </v-card-title>
              <v-card-subtitle>
                <v-textarea id="noteTextarea" @blur="updateNote(note)" rows="1" placeholder="Add Note" class="add-note bottom-border-area py-0 px-1" v-model="note.content" auto-grow></v-textarea>
              </v-card-subtitle>

              <div
                v-if="note.id"
                v-bind:id="`mores-${note.id}`"
                class="mores"
              >
                <v-btn
                  @click="pinNote(note)"
                  class="btn-detail1 d-flex"
                  style="text-transform: none; letter-spacing: 0"
                  ><i
                  style="font-size: 0.7rem"
                  class="fa-solid fa-thumbtack mr-1"
                  ></i>Unpin</v-btn
                >
                <v-btn
                  @click="deleteNote(note)"
                  class="btn-delete1"
                  style="text-transform: none; letter-spacing: 0"
                  ><i style="font-size: 0.7rem" class="fa-solid fa-trash mr-1"></i
                  >Delete</v-btn
                >
              </div>

            </v-card>

          </div>
          <v-progress-linear
            :active="loading"
            indeterminate
            rounded
            height="1px"
            color="black"
            style="z-index: 888; bottom: -30px;"
          ></v-progress-linear>
      </v-card>
  </div>
</template>

<script>
import axios from "axios"
export default {
    data: () => ({
        notes: [],
        addNoteContent: "",
        addNoteTitle: "",
        addNoteInput: false,
        headersManager: localStorage.getItem('token'),
        loading: false,
    }),

    methods: {

      mounted() {
        const headers = {
          Authorization: this.headersManager,
        };

        axios
        .get("http://127.0.0.1:8080/api/notes", { headers })
        .then((response) => {
            let data_ = response.data.data;
            this.setNotes(data_);
            const notesById = this.notes.sort((a, b) => b.id - a.id);
        })
        .catch((error) => console.log(error));
      },

      showDetails(note) {
        const detailsElement = document.getElementById(`mores-${note.id}`);
        detailsElement.classList.toggle("mores-show");
      },
      remove(note) {
        const detailsElement = document.getElementById(`mores-${note.id}`);
        const clickTarget = event.target;

        // Check if the click target is a descendant of the `.details` element
        if (
          clickTarget === detailsElement ||
          detailsElement.contains(clickTarget)
        ) {
          return;
        }

        // Remove the `.details-show` class from the `.details` element
        detailsElement.classList.remove("mores-show");
      },

      showAddNote() {
        if(this.addNoteInput === false) {
          this.addNoteInput = true;
        }else {
          this.addNoteInput = false;
        }
      },

      setNotes(data) {
      this.notes = data;
      },
      addNoteKey(event) {
        // Check if the pressed key is the Enter key.
        if (event.keyCode === 13) {
          // Call the method to add the data to the API.
          this.addNoteInput = false,
          this.addNote();
        }
      },
      addNote() {
        const headers = {
          Authorization: this.headersManager,
        };

        axios
          .post(
            "http://127.0.0.1:8080/api/notes",
            { content: this.addNoteContent},
            { headers }
          )
          .then(async (response) => {
            let data_ = response.data.data;
            console.log(data_);
            console.log("note added");
            this.addNoteContent = "";
            this.addNoteTitle = "";
            // this.showAddNote();

            // Wait for the response from the GET request to finish
            axios.get("http://127.0.0.1:8080/api/notes", { headers }).then((response) => {
              
              // Get the biggest ID data
                let data_ = response.data.data;
                this.setNotes(data_);
                const notesById = this.notes.sort((a, b) => b.id - a.id);
                setTimeout(() => {
                  const biggestIdData = this.notes.sort((a, b) => b.id - a.id)[0];
      
                  // Get the element with the biggest ID
                  const all = document.getElementById(`note-${biggestIdData.id}`);
      
                  // Add the intro-animation class and remove it after 4 seconds
  
                  all.classList.add("intro-animation");
                  setTimeout(() => {
                    all.classList.remove("intro-animation");
                  }, 550);
                }, 1)
            });
          })
          .catch((error) => console.log(error.response.data));
      },
      updateNoteTitle(note) {
        let value = note.title;
        console.log(value);
        const headers = {
          Authorization: this.headersManager,
        };

        axios
          .patch(
            `http://127.0.0.1:8080/api/notes/${note.id}`,
            { title: value },
            { headers }
          )
          .then((response) => {
            let data_ = response.data;
            console.log(data_);
            console.log("title updated");
            // task.note = this.note;
          })
          .catch((error) => console.log(error.response.data));
      },
      updateNote(note) {
        let value = note.content;
        console.log(value);
        const headers = {
          Authorization: this.headersManager,
        };

        axios
          .patch(
            `http://127.0.0.1:8080/api/notes/${note.id}`,
            { content: value },
            { headers }
          )
          .then((response) => {
            let data_ = response.data;
            console.log(data_);
            console.log("content updated");
            // task.note = this.note;
          })
          .catch((error) => console.log(error.response.data));
      },
      deleteNote(note) {
      const headers = {
        Authorization: this.headersManager,
      };

      const all = document.getElementById(`note-${note.id}`);
      axios
        .delete(`http://127.0.0.1:8080/api/notes/${note.id}`, {
          headers,
          withCredentials: false,
        })
        .then(() => {
          axios.get("http://127.0.0.1:8080/api/notes", { headers }).then((response) => {
              all.style.scale = '0';
              setTimeout(() => {
                let data_ = response.data.data;
                this.setNotes(data_);
                const notesById = this.notes.sort((a, b) => b.id - a.id);
              }, 400)
            });
        })
        .catch((error) => console.log(error.response.data));
      },
      pinNote(note) {
        const headers = {
          Authorization: this.headersManager,
        };
        
        const all = document.getElementById(`note-${note.id}`);
        if(note.status === "none") {
          axios
            .patch(
              `http://127.0.0.1:8080/api/notes/${note.id}`,
              { status: "pinned" },
              { headers }
            )
            .then((response) => {
              let data_ = response.data;
              console.log(data_);
              all.style.scale = '0';
              axios
              .get("http://127.0.0.1:8080/api/notes", { headers })
              .then((response) => {
                    let data_ = response.data.data;
                    this.setNotes(data_);
                    const notesById = this.notes.sort((a, b) => b.id - a.id);
                    setTimeout(()=>{
                      all.style.scale = '1';
                    },100)
              })
              .catch((error) => console.log(error));
            })
            .catch((error) => console.log(error.response.data));
            const detailsElement = document.getElementById(`mores-${note.id}`);
            detailsElement.classList.remove("mores-show");
        } else {
          axios
            .patch(
              `http://127.0.0.1:8080/api/notes/${note.id}`,
              { status: "none" },
              { headers }
            )
            .then((response) => {
              let data_ = response.data;
              console.log(data_);
              all.style.scale = '0';
              axios
              .get("http://127.0.0.1:8080/api/notes", { headers })
              .then((response) => {
                    let data_ = response.data.data;
                    this.setNotes(data_);
                    const notesById = this.notes.sort((a, b) => b.id - a.id);
                    setTimeout(()=>{
                      all.style.scale = '1';
                    },100)
              })
              .catch((error) => console.log(error));
            })
            .catch((error) => console.log(error.response.data));
            const detailsElement = document.getElementById(`mores-${note.id}`);
            detailsElement.classList.remove("mores-show");
        }
      },
    },


    mounted() {   
        this.loading = true;
        const headers = {
          Authorization: this.headersManager,
        };
          axios
          .get("http://127.0.0.1:8080/api/notes", { headers })
          .then((response) => {
              let data_ = response.data.data;
              this.setNotes(data_);
              const notesById = this.notes.sort((a, b) => b.id - a.id);
              this.loading = false;
          })
          .catch((error) => console.log(error));
    },

    computed: {
      sortedNotes() {
        const pinnedNote = this.notes.filter((note) => note.status === 'pinned');
        const unpinnedNote = this.notes.filter((note) => note.status === 'none');
        const sortedPinned = pinnedNote.sort((a, b) => b.id - a.id);
        const sortedUnpinned = unpinnedNote.sort((a, b) => b.id - a.id);
        return this.notes = [...sortedPinned, ...sortedUnpinned];
      },
    }
}
</script>

<style scoped>
.note {
  transition: 0.3s ease;
  box-shadow: 0px 2px 5px #888888;
}
.note-add {
  transition: 0.3s ease;
  box-shadow: 0px 2px 5px #888888;
  animation: add .2s ease;
}
@keyframes add {
  0% {
    opacity: 0;
    scale: .8;
    z-index: -1;
  }
  100% {
    opacity: 1;
    scale: 1;
    z-index: 1;
  }
}
.note:hover {
  transform: translateY(-3px);
  box-shadow: 0px 3px 5px #888888;
}
#noteTextarea {
  font-size: .9rem;
  color: #00000095 !important;
  line-height: 1.5;
}
#banner {
  border-radius: 10px;
}

#input-58 {
  font-weight: 500;
  width: 100%;
  resize: none;
}
#input-58 {
  color: #747474;
  font-weight: 400;
  font-size: .9rem;
}

.add-title {
  font-size: 1.1rem;
}

.pinned-note {
  position: absolute;
  right: 4%;
  top: 11px;
}


.mores {
  display: grid;
  right: 5%;
  top: 3%;
  position: absolute;
  z-index: -1;
  gap: 10px;
  opacity: 0;
  scale: 0.7;
  transition: all 0.1s ease;
}
.mores-show {
  opacity: 1;
  scale: .9;
  z-index: 999;
}

.btn-detail1 {
  transition: all 0.1s ease;
}
.btn-delete1 {
  transition: all 0.1s ease;
}
.btn-detail1:hover {
  background-image: linear-gradient(to top right, #5841e5, #4b97f0);
  color: #ffffff;
}
.btn-delete1:hover {
  background-image: linear-gradient(to top right, #5841e5, #4b97f0);
  color: #ffffff;
}



.intro-animation {
  animation: intro .45s ease backwards;
}
.outro-animation {
  animation: outro .45s ease backwards;
}

@keyframes intro {
  0% {
    opacity: 0;
    scale: 0;
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
    scale: 0;
  }
}
</style>