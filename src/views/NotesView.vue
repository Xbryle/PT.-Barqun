<template>
  <div class="notes-contain">

  <NavigationDrawer />

  <v-dialog v-model="showDialog" max-width="600px">
    <v-container class="details-pop" :items="details">
      <v-subheader class="px-0 d-flex mb-n4">
        <h4>My Note</h4>

        <v-spacer></v-spacer>

        <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
                <i
                  v-on="on"
                  v-bind="attrs"
                  @click="deleteNote(details)"
                    style="font-size: 0.9rem; cursor: pointer; z-index: 888"
                    class="delete-icon fa-solid fa-trash mr-4"
                ></i>
            </template>
            <span>Delete</span>
        </v-tooltip>

        <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }" >
                <svg v-if="details.status !== 'pinned'" style="width: 17px; cursor:pointer;" v-on="on" v-bind="attrs" @click="pinNote(details)" class="mr-7 mt-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16,12V4H17V2H7V4H8V12L6,14V16H11.2V22H12.8V16H18V14L16,12Z" /></svg>
                <svg v-else style="width: 17px; cursor:pointer;" xmlns="http://www.w3.org/2000/svg" class="mr-7 mt-0" @click="pinNote(details)" v-on="on" v-bind="attrs" viewBox="0 0 24 24"><path d="M2,5.27L3.28,4L20,20.72L18.73,22L12.8,16.07V22H11.2V16H6V14L8,12V11.27L2,5.27M16,12L18,14V16H17.82L8,6.18V4H7V2H17V4H16V12Z" /></svg>
            </template>
            <span v-if="details.status !== 'pinned'">Pin</span>
            <span v-else>Unpin</span>
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

      <v-textarea id="tittle" rows="1" @blur="updateNoteTitle(details)" placeholder="Add Title" style="font-size: 1.3rem; outline: none; font-weight: 600" class="mb-5 bottom-border-area" v-model="noteTitle" auto-grow></v-textarea>

      <v-subheader class="px-0 py-0 mb-n5">NOTE</v-subheader>

      <v-textarea id="note" rows="1" @blur="updateNoteContent(details)" placeholder="Add Note" class="mb-2 bottom-border-area" v-model="noteContent" auto-grow></v-textarea>

      <div class="d-flex align-center mb-n2">
        <v-subheader class="px-0 py-0 mr-2 my-0">Subnote</v-subheader>
        <v-progress-circular
          v-show="loadingCircle"
          indeterminate
          height="1px"
          class="my-0 py-0"
          style="z-index: 888; width: 12px;"
          ></v-progress-circular>
      </div>

      <v-col
        cols="12"
        style="position: relative"
        class="px-0"
        v-for="sub in subNote"
        :key="sub.id"
      >
        <div class="grid-template">
          <i
            style="cursor: pointer; width: fit-content"
            class="noned fa-regular fa-circle"
            @click="setDoneSub(details, sub)"
            v-if="sub.status === 'none'"
          ></i>
          <i
            style="cursor: pointer; width: fit-content"
            class="doned fa-solid fa-circle-check"
            @click="setDoneSub(details, sub)"
            v-else
          ></i>
          <input
          v-model="sub.content"
            contenteditable="true"
            type="text"
            id="subtask"
            style="outline: none; width: 100%"
            name="note"
            @blur="updateSubtask(details, sub)"
            @input="handleInput"
          />
          <i
            style="font-size: 0.7rem; cursor: pointer"
            class="delete-subtask delete-icon fa-solid fa-trash"
            @click="deleteSubnote(details, sub)"
          ></i>
        </div>
      </v-col>

      <v-col cols="12" class="px-0">
        <i class="fa-regular fa-circle mr-3"></i>
        <!-- <i class="fa-solid fa-circle-check mr-4"></i> -->
        <input
          v-model="subnote"
          type="text"
          placeholder="Add New Subtask"
          id="add-subtask"
          style="outline: none; width: 90%"
          name="add-subtask"
          @blur="addSubnote(details)"
          @keydown="enterSubnote($event, details)"
        />
      </v-col>
    </v-container>
  </v-dialog>

  <div class="wrapper-note py-0 px-0">
    <div class="py-3 px-7" style="box-shadow: 0px 3px 5px #888888; background-color: #ffffff; min-width: 70vw; border-radius: 10px;">
      <v-progress-linear
      indeterminate
      color="black"
      height="1.5px"
      :active="loading"
      ></v-progress-linear>

      <v-card-title class="d-flex mb-3 px-0" style="position: relative; overflow-x: hidden;">
        <h2 class="mr-3" style="font-weight: 600; font-size: 1.3rem">
            Notes
        </h2>
        <v-spacer></v-spacer>
        <i style="font-weight: 600; font-size: .8rem" class="fa-solid fa-arrow-down-wide-short mr-1"></i>
        <h4 style="font-weight: 600; font-size: .8rem">Sort by {{ sortBy }}</h4>

        <div class="search-notes py-0 px-0 mx-0 my-0">
          <v-checkbox
            v-model="checkTitle"
            hide-details
            class="shrink mt-1 mr-0"
            style="scale: 1;"
          ></v-checkbox>
          <v-autocomplete
            :items="!checkTitle ? noteContents : noteTitles"
            v-model="searchValue"
            auto-select-first
            clearable
            dense
            filled
            :label="!checkTitle ? 'Search by content' : 'Search by title'"
            placeholder="Start typing to Search"
            outlined
            style="background-color: #ffffff;"
            @blur="searchNoteDetails(note)"
          ></v-autocomplete>
        </div>

      </v-card-title>

      <div class="scroller px-0" style="overflow-y: scroll; overflow-x: visible; height: 88%; padding: 5px 5px;">
        <v-row dense class="note-container px-2 py-2" style="gap: 20px;">
            <v-card cols="12" class="note" style="border-radius: 10px; cursor: pointer; position: relative;" v-for="note in sortedNotes" :key="note.id" :color="note.color" v-bind:id="`note-${note.id}`">
                <v-card-subtitle>
                    <v-textarea v-if="note.truncatedContent !== defaultNote" v-bind:id="`text-${note.id}`" disabled class="note-content py-0 bottom-border-area" v-model="note.truncatedContent" auto-grow></v-textarea>
                    <v-textarea v-else @blur="updateNoteContentPrev(note)" class="note-content py-0 bottom-border-area" v-model="addNoteContent" placeholder="Type your note here" auto-grow></v-textarea>
                </v-card-subtitle>
                
              <div class="d-flex" style="align-items: center;">
                <div class="d-flex" style="align-items: center; padding: 0; margin: 0; position: absolute; bottom: 0px;">
                  <i v-bind:id="`iconSub-${note.id}`"
                    v-if="note.childrens_total !== 0"
                    style="cursor: pointer; width: fit-content; scale: .7;"
                    class="fa-solid fa-square-check ms-3 mr-1">
                  </i>
                  <v-subheader v-bind:id="`sub-${note.id}`" v-if="note.childrens_total !== 0" class="px-0 py-0 mr-2" style="font-size: .55rem; color: #000000;">{{note.childrens_done}}/{{note.childrens_total}}</v-subheader>
                </div>
                  <v-btn
                    v-bind:id="`show-${note.id}`"
                    class="mx-2 btn-show-detail"
                    fab
                    dark
                    small
                    absolute
                    right
                    bottom
                    style="right: 0; bottom: 10px; width: 30px; height: 30px;"
                    @click="showDetails(note)" v-click-outside="() => remove(note)"
                    >
                    <i class="fa-solid fa-pencil"></i>
                  </v-btn>  
              </div>

              <i v-bind:id="`iconPin-${note.id}`" class="fa-solid fa-thumbtack" v-if="note.status !== 'none'" style="scale: .7; position: absolute; top: 7px; right: 7px;"></i>
              <i v-bind:id="`iconPin-${note.id}`" class="fa-solid fa-thumbtack" v-else style="scale: .7; position: absolute; top: 7px; right: 7px; display: none;"></i>
              
                <div v-if="note.id" v-bind:id="`mores-${note.id}`" class="btn-group">
                  <v-btn
                      v-bind:id="`detail-${note.id}`"
                      fab
                      dark
                      class="btn-detail d-flex"
                      @click="noteDetails(note)"
                      style="text-transform: none; width: 45px; height: 45px;"><i style="font-size: large;" class="fa-solid fa-circle-info"></i></v-btn>
                  <v-btn
                      v-bind:id="`delete-${note.id}`"
                      fab
                      dark
                      class="btn-delete"
                      style="text-transform: none; width: 43px; height: 43px;"
                      @click="deleteNote(note)"
                      ><i style="font-size: large;" class="fa-solid fa-trash"></i></v-btn>
                </div>
            </v-card>
        </v-row>
      </div>

      <v-progress-linear
      :active="loading"
      indeterminate
      rounded
      height="1px"
      style="z-index: 888; bottom: -30px;"
      ></v-progress-linear>
    </div>

    <div class="text-center mr-n3 ps-4 pe-0" style="align-content: start;">
      <v-btn
            class="mb-5 mt-6"
            fab
            dark
            small
            color="#000"
            style="width: 35px; height: 35px;"
            @click="activeSearch()"
          >
          <i class="fa-solid fa-magnifying-glass"></i>
          </v-btn>
      <v-btn
            class="mb-5"
            fab
            dark
            small
            color="#000"
            style="width: 35px; height: 35px;"
            @click="sortBy = 'pin'"
          >
          <i class="fa-solid fa-thumbtack"></i>
          </v-btn>
      <v-btn
            class="mb-5"
            fab
            dark
            small
            color="#000"
            style="width: 35px; height: 35px;"
            @click="sortBy = 'unpin'"
          >
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"><path fill="currentColor" d="M2 5.27L3.28 4L20 20.72L18.73 22l-5.93-5.93V22h-1.6v-6H6v-2l2-2v-.73zM16 12l2 2v2h-.18L8 6.18V4H7V2h10v2h-1z"/></svg>
          </v-btn>
      <v-btn
            class="mb-5"
            fab
            dark
            small
            color="#000"
            style="width: 35px; height: 35px;"
            @click="sortBy = 'date'"
          >
          <i class="fa-solid fa-calendar-days"></i>
          </v-btn>

      <v-divider class="mt-3 mb-3" color="black"></v-divider>

      <v-menu style="background-color: transparent; box-shadow: none; justify-content: center; justify-items: center;" offset-y transition="slide-y-transition" group leave-absolute>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            fab
            dark
            small
            color="#000"
            v-bind="attrs"
            v-on="on"
            depressed
            style="width: 35px; height: 35px;"
          >
          <i class="fa-solid fa-plus"></i>
          </v-btn>
        </template>
        
        <v-list style="background-color: transparent; margin-right: -8px; gap: 0;">
          <v-list-item v-for="(color, index) in colors" :key="index" style="min-height: 0; height: fit-content;"> 
            <v-btn
              fab
              dark
              small
              depressed
              :color="color.color"
              style="width: 30px; height: 30px;"
              @click="addNote(color)"
              class="mb-2"
            >
            </v-btn>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </div>

  <div class="menu-mobile">
    <v-menu style="background-color: transparent; box-shadow: none; justify-content: center; justify-items: center; overflow-y: visible; overflow-x: visible; contain: none;" transition="scale-transition" group leave-absolute origin="center bottom" top offset-y="true">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              fab
              dark
              small
              color="#000"
              v-bind="attrs"
              v-on="on"
              depressed
              style="width: 35px; height: 35px; overflow: visible; box-shadow: 0px 1px 7px #0000007e;">
              <i class="fa-solid fa-plus"></i>
            </v-btn>
          </template>
          <div style="position: relative; overflow: visible; display: grid; align-items: center; justify-items: center;">
            <v-btn
              class="search-btn"
              fab
              dark
              small
              color="#000"
              @click="activeSearch()">
              <i class="fa-solid fa-magnifying-glass"></i>
            </v-btn>
            <v-btn
              class="pin-btn"
              fab
              dark
              small
              color="#000"
              @click="sortBy = 'pin'">
              <i class="fa-solid fa-thumbtack"></i>
            </v-btn>
            <v-btn
              class="unpin-btn"
              fab
              dark
              small
              color="#000"
              @click="sortBy = 'unpin'">
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"><path fill="currentColor" d="M2 5.27L3.28 4L20 20.72L18.73 22l-5.93-5.93V22h-1.6v-6H6v-2l2-2v-.73zM16 12l2 2v2h-.18L8 6.18V4H7V2h10v2h-1z"/></svg>
            </v-btn>
            <v-btn
              class="date-btn"
              fab
              dark
              small
              color="#000"
              @click="sortBy = 'date'">
              <i class="fa-solid fa-calendar-days"></i>
            </v-btn>
          </div>
          <v-list style="background-color: transparent; gap: 0; display: flex; position: absolute; right: 37px; transform: translateY(-5px);">
            <v-list-item v-for="(color, index) in colors" :key="index" style="min-height: 0; height: fit-content; padding: 0;"> 
              <v-btn
                fab
                dark
                small
                depressed
                :color="color.color"
                style="width: 30px; height: 30px; margin: 0; box-shadow: 0px 1px 4px #0000007e;"
                @click="addNote(color)"
                class="mr-2"
              >
              </v-btn>
            </v-list-item>
          </v-list>
    </v-menu>
  </div>

  </div>
</template>

<script scoped>
import NavigationDrawer from '@/components/SidebarView.vue';
import axios from 'axios';
export default {
data: () => ({
  headersManager: localStorage.getItem('token'),
  notes: [],
  noteContents: [],
  noteTitles: [],
  details: [],
  subNote: [],
  filtered: [],
  colors: [
    {color: '#FEC971'},
    {color: '#FE9B72'},
    {color: '#B693FD'},
    {color: '#00D4FE'},
    {color: '#E4EF8F'},
    {color: '#FFFFFF'},
    {color: '#000000'},
  ],
  addNoteContent: "",
  defaultNote: "Type ur note here",
  addNoteTitle: "",
  noteTitle: "",
  noteContent: "",
  subnote: "",
  searchValue: "",
  note: "",
  sortBy: "date",
  showDialog: false,
  rightDrawer: true,
  addNoteInput: false,
  loading: false,
  loadingCircle: false,
  checkTitle: false,
  loading: false,
}),

components: {
    NavigationDrawer,
},

methods: {
    activeSearch(){
      const search = document.querySelector('.search-notes');
      search.classList.toggle('search-notes-active');
    },
    showDetails(note) {
      const detailsElement = document.getElementById(`mores-${note.id}`);
      const btnDetail = document.getElementById(`detail-${note.id}`);
      const btnDelete = document.getElementById(`delete-${note.id}`);

      btnDetail.classList.toggle('detail-slide');
      btnDelete.classList.toggle('delete-slide');
      detailsElement.classList.toggle("mores-show");
    },
    closeDetails() {
      this.showDialog = false;
    },
    remove(note) {
        const detailsElement = document.getElementById(`mores-${note.id}`);
        const clickTarget = event.target;
        const btnDelete = document.getElementById(`delete-${note.id}`);
        const btnDetail = document.getElementById(`detail-${note.id}`);

        // Check if the click target is a descendant of the `.details` element
        if (
            clickTarget === detailsElement ||
            detailsElement.contains(clickTarget) ||
            clickTarget === btnDetail ||
            btnDetail.contains(clickTarget) ||
            clickTarget === btnDelete ||
            btnDelete.contains(clickTarget)
        ) {
            return;
        }

        // Remove the `.details-show` class from the `.details` element
        detailsElement.classList.remove("mores-show");
        btnDetail.classList.remove('detail-slide');
        btnDelete.classList.remove('delete-slide');
    },
    addNote(color) {
      const headers = {
        Authorization: this.headersManager,
      };
      this.details = [];
      axios
        .post(
          "http://127.0.0.1:8080/api/notes",
          { content: this.defaultNote, color: color.color},
          { headers }
        )
        .then((response) => {
          axios
            .get('http://127.0.0.1:8080/api/notes', { headers })
            .then((response) => {
              let data_ = response.data.data;
              this.notes = data_;
              this.notes.sort((a, b) => b.id - a.id);
              this.mountTool(response);
              this.loading = false;
            })
            .catch((error) => console.log(error));
        })
        .catch((error) => console.log(error.response.data));
    },
    deleteNote(details) {  
      const headers = {
        Authorization: this.headersManager,
      };

      const findNote = document.getElementById(`note-${details.id}`)
      // findNote.style.scale = ".3";
      findNote.style.transform = "translateY(30px)";
      findNote.style.opacity = "0";

      setTimeout(()=>{
        const findTaskFiltered = this.notes.find((notes) => notes.id === details.id)
        const findIndexFiltered = this.notes.findIndex((notes) => notes.id === findTaskFiltered.id);
        this.notes.splice(findIndexFiltered, 1);
        console.log(findTaskFiltered)
        console.log(findIndexFiltered)
        this.sortedNotesMount()
        axios
          .delete(`http://127.0.0.1:8080/api/notes/${details.id}`, {
            headers,
            withCredentials: false,
          })
          .then((response) => {
            console.log(response.status)
          })
          .catch((error) => console.log(error.response.data));
      },400)
    },
    updateNoteContent(details) {
      let value = this.noteContent;
      console.log(value);
      const headers = {
        Authorization: this.headersManager,
      };

      axios
        .patch(
          `http://127.0.0.1:8080/api/notes/${details.id}`,
          { content: value },
          { headers }
        )
        .then((response) => {
          let data_ = response.data;
          console.log(data_);
          console.log("content updated");
          this.loading = true;
          axios
            .get('http://127.0.0.1:8080/api/notes', { headers })
            .then((response) => {
              let data_ = response.data.data;
              this.notes = data_;
              this.notes.sort((a, b) => b.id - a.id);
              this.mountTool(response);
              this.noteContents = this.notes.map((note) => note.truncatedContent);
              this.noteTitles = this.notes.map((note) => note.title);
              this.loading = false;
            })
            .catch((error) => console.log(error));
        })
        .catch((error) => console.log(error.response.data));
    },
    updateNoteContentPrev(note) {
      let value = this.addNoteContent;
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
          this.loading = true;
          axios
            .get('http://127.0.0.1:8080/api/notes', { headers })
            .then((response) => {
              let data_ = response.data.data;
              this.notes = data_;
              this.notes.sort((a, b) => b.id - a.id);
              this.mountTool(response);
              this.noteContents = this.notes.map((note) => note.truncatedContent);
              this.noteTitles = this.notes.map((note) => note.title);
              this.loading = false;
              this.addNoteContent = "";
            })
            .catch((error) => console.log(error));
        })
        .catch((error) => console.log(error.response.data));
    },
    updateNoteTitle(details) {
      let value = this.noteTitle;
      console.log(value);
      const headers = {
        Authorization: this.headersManager,
      };

      axios
        .patch(
          `http://127.0.0.1:8080/api/notes/${details.id}`,
          { title: value },
          { headers }
        )
        .then((response) => {
          let data_ = response.data;
          console.log(data_);
          console.log("title updated");
          this.loading = true;
          axios
            .get('http://127.0.0.1:8080/api/notes', { headers })
            .then((response) => {
              let data_ = response.data.data;
              this.notes = data_;
              this.notes.sort((a, b) => b.id - a.id);
              this.mountTool(response);
              this.noteContents = this.notes.map((notes) => notes.truncatedContent);
              this.noteTitles = this.notes.map((notes) => notes.title);
              this.loading = false;
            })
            .catch((error) => console.log(error));
        })
        .catch((error) => console.log(error.response.data));
    },


    noteDetails(details) {
      this.subNote = [];
      const headers = {
        Authorization: this.headersManager,
      };

      this.showDialog = true;
      const noteId = details.id;
      const getNoteDetail = this.notes.find((note) => note.id === noteId);
      this.details = getNoteDetail;
      this.noteTitle = this.details.title;
      this.noteContent = this.details.content;
      this.loadingCircle = true;
      axios
        .get(`http://127.0.0.1:8080/api/notes/${noteId}`, { headers })
        .then((response) => {
          let data_ = response.data.data.childrens;
          this.subNote = data_;
          this.loadingCircle = false;
        })
        .catch((error) => console.log(error.response.data));
    },
    searchNoteDetails() {
      // const search = document.querySelector(".search-notes")
      // search.classList.remove('.search-notes-active');
      if(this.checkTitle === true) {
        if(this.searchValue !== null) {
          console.log(this.searchValue)
          const getNoteDetail = this.notes.find((note) => note.title === this.searchValue);
          console.log(getNoteDetail)
          if(getNoteDetail !== undefined) {
            this.showDialog = true;
            this.details = getNoteDetail;
            console.log(this.details)
            this.noteTitle = this.details.title;
            this.noteContent = this.details.content;
          }
        }
      } else if (this.checkTitle === false) {
          console.log(this.searchValue)
          const getNoteDetail = this.notes.find((note) => note.truncatedContent === this.searchValue);
          console.log(getNoteDetail)
          if(getNoteDetail !== undefined) {
            this.showDialog = true;
            this.details = getNoteDetail;
            console.log(this.details)
            this.noteTitle = this.details.title;
            this.noteContent = this.details.content;
        }
      }
    },

    enterSubnote(event, details) {
      if (event.keyCode === 13) {
        this.addSubnote(details);
        this.subnote = "";
      }
    },
    addSubnote(details) {
      const headers = {
        Authorization: this.headersManager,
      };
      const findNote = this.notes.find((notes) => notes.id === details.id)
      axios
      .post(
        `http://127.0.0.1:8080/api/notes/${details.id}/childrens`,
        { content: this.subnote },
        { headers }
        )
        .then((response) => {
          console.log(response.status);
          this.subnote = "";
          findNote.childrens_total = findNote.childrens_total + 1;
          axios
            .get(`http://127.0.0.1:8080/api/notes/${details.id}`, { headers })
            .then((response) => {
              let data_ = response.data.data.childrens;
              this.subNote = data_;
            })
            .catch((error) => console.log(error.response.data));
        })
        .catch((error) => console.log(error.response.data));


    },
    deleteSubnote(details, sub) {
      const headers = {
        Authorization: this.headersManager,
      };

      const subId = sub.id;
      const getSubnote = this.subNote.find((subnote) => subnote.id === subId);
      const index = this.subNote.findIndex((subnote) => subnote.id === getSubnote.id);
      this.subNote.splice(index, 1);

      const findNote = this.notes.find((notes) => notes.id === details.id)
      findNote.childrens_total = findNote.childrens_total - 1;
      axios
        .delete(`http://127.0.0.1:8080/api/notes/${details.id}/childrens/${sub.id}`, { headers })
        .then((response) => {
        })
        .catch((error) => console.log(error.response.data));
    },
    setDoneSub(details, sub) {
      const headers = {
        Authorization: this.headersManager,
      };
      const getSubnote = this.subNote.find((subnote) => subnote.id === sub.id);
      const findNote = this.notes.find((notes) => notes.id === details.id)
      if (sub.status !== "done") {
        getSubnote.status = "done";
        findNote.childrens_done = findNote.childrens_done + 1;
        axios
          .patch(
            `http://127.0.0.1:8080/api/notes/${details.id}/childrens/${sub.id}`,
            { status: "done" },
            { headers }
          )
          .then((response) => {
            let data_ = response.data.data;
          })
          .catch((error) => console.log(error.response.data));
      } else {
        getSubnote.status = "none";
        findNote.childrens_done = findNote.childrens_done - 1;
        axios
          .patch(
            `http://127.0.0.1:8080/api/notes/${details.id}/childrens/${sub.id}`,
            { status: "none" },
            { headers }
          )
          .then((response) => {
            let data_ = response.data.data;
          })
          .catch((error) => console.log(error.response.data));
      }
    },
    pinNote(details) {
      const headers = {
        Authorization: this.headersManager,
      };
      this.showDialog = false;
      const all = document.getElementById(`note-${details.id}`);
      if(details.status === "none") {
        details.status = "pinned";
        axios
          .patch(
            `http://127.0.0.1:8080/api/notes/${details.id}`,
            { status: "pinned" },
            { headers }
          )
          .then((response) => {
            let data_ = response.status;
          })
          .catch((error) => console.log(error.response.data));
      } else {
        details.status = "none";
        axios
          .patch(
            `http://127.0.0.1:8080/api/notes/${details.id}`,
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


    mountTool() {
      this.filtered = this.notes.filter((note) => note.content.length);
      for (let i = 0; i < this.filtered.length; i++) {
        if (this.filtered[i].content.length > 50) {
          const truncatedNote = this.filtered[i].content.slice(0, 50) + '....';
          this.filtered[i].truncatedContent = truncatedNote;
        } else {
          const truncatedNote = this.filtered[i].content;
          this.filtered[i].truncatedContent = truncatedNote;
        }
      }

      const getIdBlackNote = this.filtered.filter((note) => note.color === "#000000");
      setTimeout(()=> {
        for(let i = 0; i < getIdBlackNote.length; i++) {
          const noteContent = document.querySelector(`#note-${getIdBlackNote[i].id}`).closest('.note').querySelector('textarea');
          const buttonShowDetails = document.querySelector(`#note-${getIdBlackNote[i].id}`).querySelector(`#show-${getIdBlackNote[i].id}`);
          const buttonDetail = document.querySelector(`#note-${getIdBlackNote[i].id}`).closest('.note').querySelector(`#detail-${getIdBlackNote[i].id}`);
          const buttonDelete = document.querySelector(`#note-${getIdBlackNote[i].id}`).querySelector(`#delete-${getIdBlackNote[i].id}`);
          const pinIcon = document.querySelector(`#note-${getIdBlackNote[i].id}`).querySelector(`#iconPin-${getIdBlackNote[i].id}`);
          const subIcon = document.querySelector(`#note-${getIdBlackNote[i].id}`).querySelector(`#iconSub-${getIdBlackNote[i].id}`);
          const sub = document.querySelector(`#note-${getIdBlackNote[i].id}`).querySelector(`#sub-${getIdBlackNote[i].id}`);

          noteContent.style.color = '#FFFFFF'

          buttonShowDetails.style.backgroundColor = '#FFFFFF'
          buttonShowDetails.style.color = '#000000'
          
          buttonDetail.style.backgroundColor = '#FFFFFF'
          buttonDetail.style.color = '#000000'
          
          buttonDelete.style.backgroundColor = '#FFFFFF'
          buttonDelete.style.color = '#000000'
          
          pinIcon.style.color = '#FFFFFF'

          if(subIcon !== null) {
            subIcon.style.color = '#FFFFFF'
          }

          if(sub !== null) {
            sub.style.color = '#FFFFFF'
          }
        }
      },0)
    },
    mount(response){
      this.loading = true;
      const headers = {
          Authorization: this.headersManager,
      };
      axios
        .get('http://127.0.0.1:8080/api/notes', { headers })
        .then((response) => {
          let data_ = response.data.data;
          this.notes = data_;
          this.loading = false;
          this.mountTool()
        })
      .catch((error) => console.log(error)); 
    },

    sortedNotesMount() {
      if (this.sortBy === "date"){
        return this.notes.sort((a, b) => b.id - a.id);
      } else if(this.sortBy === "unpin") {
        const unpinnedNote = this.notes.filter((note) => note.status === 'none');
        const sortedUnpinned = unpinnedNote.sort((a, b) => b.id - a.id);
        const byDate = this.notes.sort((a, b) => b.id - a.id);
        return this.notes = [...sortedUnpinned, ...byDate];
      } else {
        const pinnedNote = this.notes.filter((note) => note.status === 'starred');
        const sortedPinned = pinnedNote.sort((a, b) => b.id - a.id);
        const byDate = this.notes.sort((a, b) => b.id - a.id);
        return this.notes = [...sortedPinned, ...byDate];
      }
  },

},

mounted() {
  this.loading = true;
    const headers = {
        Authorization: this.headersManager,
    };
    axios
      .get('http://127.0.0.1:8080/api/notes',{ headers })
      .then((response) => {
        let data_ = response.data.data;
        this.notes = data_;
        this.loading = false;
        this.notes.sort((a, b) => b.id - a.id);
        this.mountTool(response);
        this.noteContents = this.notes.map((note) => note.truncatedContent);
        this.noteTitles = this.notes.map((note) => note.title);
      })
      .catch((error) => console.log(error));

},

computed: {
  sortedNotes() {
    if (this.sortBy === "date"){
      return this.notes.sort((a, b) => b.id - a.id);
    } else if(this.sortBy === "unpin") {
      const pinnedNote = this.notes.filter((note) => note.status === 'pinned');
      const unpinnedNote = this.notes.filter((note) => note.status === 'none');
      const sortedPinned = pinnedNote.sort((a, b) => b.id - a.id);
      const sortedUnpinned = unpinnedNote.sort((a, b) => b.id - a.id);
      return this.notes = [...sortedUnpinned, ...sortedPinned];
    } else {
      const pinnedNote = this.notes.filter((note) => note.status === 'pinned');
      const unpinnedNote = this.notes.filter((note) => note.status === 'none');
      const sortedPinned = pinnedNote.sort((a, b) => b.id - a.id);
      const sortedUnpinned = unpinnedNote.sort((a, b) => b.id - a.id);
      return this.notes = [...sortedPinned, ...sortedUnpinned];
    }
  },
},

}
</script>

<style scoped>
.notes-contain {
  position: relative;
  padding-left: 30px;
  padding-right: 30px;
  font-family: "poppins";
}

.wrapper-note {
  display: grid;
  grid-template-columns: 1fr 38px;
  width: 100%; 
  position: relative;  
  border-radius: 10px; 
  height: 90vh;
}

.note {
  width: 215px;
  height: auto;
  aspect-ratio: 1;
  transition: all .3s ease;
  animation: noteIntro .5s ease;
}

@keyframes noteIntro {
  0% {
    opacity: 0;
    transform: translateY(50px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.text-center {
  display: grid;
}
.menu-mobile {
  display: none;
}

@media only screen and (max-width: 540px) {
  .note {
    width: 100%;
  }
  .wrapper-note {
    grid-template-columns: 1fr;
  }
  .text-center {
    display: none;
  }
  .menu-mobile {
  display: inline;
}
}
@media only screen and (min-width: 720px) and (max-width: 768px) {
  .note {
    width: 31%;
  }
}
@media only screen and (min-width: 540px) and (max-width: 720px) {
  .note {
    width: 47%;
  }
}
@media only screen and (min-width: 480px) and (max-width: 535px) {
  .note {
    width: 47%;
  }
}
.note:hover {
  transform: translateY(-3px);
  box-shadow: 0px 3px 5px #888888;
}
.v-menu__content {
  box-shadow: none;
}

.note-content {
  font-size: .9rem;
  /* color: #000000 !important; */
  line-height: 1.5;
}

.btn-group {
  display: grid;
  position: absolute;
  height: min-content;
  right: 0;
  bottom: 0;
  gap: 10px;
  opacity: 0;
  scale: 0.7;
  transition: all 0.1s ease;
}
.mores-show {
  opacity: 1;
  scale: .9;
}

.btn-detail {
  transition: all 0.1s ease;
  scale: .8;
  bottom: -67px;
  color: #ffffff;
  z-index: -999;
}
.detail-slide {
  bottom: -5px;
  z-index: 1;
}
.btn-delete {
  transition: all 0.1s ease;
  scale: .8;
  right: 0px;
  bottom: 2px;
  color: #ffffff;
  z-index: -999;
}
.delete-slide {
  right: 45px;
  z-index: 1;
}
.btn-detail:hover {
  background-image: linear-gradient(to top right, #5841e5, #4b97f0);
  color: #ffffff;
}
.btn-delete:hover {
  background-image: linear-gradient(to top right, #5841e5, #4b97f0);
  color: #ffffff;
}


.details-pop {
  display: grid;
  background-color: #ffffff;
  padding: 0 25px;
  padding-bottom: 30px;
  padding-top: 10px;
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


.search-notes {
  display: flex;
  position: absolute;
  right: 0;
  transition: all .4s ease;
  transform: translateX(100%);
}
.search-notes-active {
  transform: translateX(0);
}


.grid-template {
  display: grid;
  grid-template-columns: 0.5fr 87% 1fr;
  gap: 10px;
  align-items: center;
}


.doned {
  animation: doned 0.2s ease-out;
  color: #25bb00;
}
.noned {
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


.pin-btn, .unpin-btn, .date-btn, .add-btn, .search-btn {
  width: 35px; 
  height: 35px; 
  box-shadow: none;
  margin-bottom: 7px;
}

.menu-mobile {
  position: fixed;
  bottom: 3%;
  right: 5%;
}
</style>