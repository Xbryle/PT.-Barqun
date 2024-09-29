<template>
  <div class="mt-4" style="position: inline">
    <v-tabs
      v-model="tab"
      hide-slider
      fixed-tabs
      background-color="transparent"
      class="tabs mb-4 px-0 mx-0"
    >
      <v-tab
        class="tab d-flex align-center justify-center"
        active-class="border-round back-color"
        style="
          width: 7em;
          cursor: pointer;
          height: fit-content;
          padding: 10px 0;">
        <h4>Casual</h4>
      </v-tab>
      <v-tab
        class="tab d-flex align-center justify-center mx-0"
        active-class="border-round back-color"
        style="
          width: 7em;
          cursor: pointer;
          height: fit-content;
          padding: 10px 0;
        "
      >
        <h4>Daily</h4>
      </v-tab>
      <v-tab
        class="tab d-flex align-center justify-center"
        active-class="border-round back-color"
        style="
          width: 7em;
          cursor: pointer;
          height: fit-content;
          padding: 10px 0;
        "
      >
        <h4>Weekly</h4>
      </v-tab>
      <v-tab
        class="tab d-flex align-center justify-center mx-0"
        active-class="border-round back-color"
        style="
          width: 7em;
          cursor: pointer;
          height: fit-content;
          padding: 10px 0;
        "
      >
        <h4>Monthly</h4>
      </v-tab>
    </v-tabs>

    <v-card
      id="banner"
      max-width="1fr"
      max-height="415px"
      height="415px"
      class="banner py-5 px-5 pb-7"
      style="position: relative; box-shadow: 0px 3px 5px #888888"
    >


      <v-row class="mb-1">
        <v-col cols="12" class="d-flex align-center">
          <h2 class="mr-1" style="font-weight: 600; font-size: 1.3rem;">
            Tasks
          </h2>
        </v-col>
      </v-row>


      <v-tabs-items v-model="tab" class="transparent mt-n12" style="position: inline; overflow: visible;">
        <v-tab-item class="mt-3 py-0" style="position: inline; overflow: visible;">
          <v-row class="mb-10" style="position: inline; overflow: visible;">

            <v-col class="d-flex py-0 mb-7">
              <v-spacer></v-spacer>
              <h4 style="font-weight: 500">Casual</h4>
              
            </v-col>

            <Usual />

          </v-row>
        </v-tab-item>

        <v-tab-item class="mt-3 py-0">
          <v-row class="mb-10">

            <v-col class="d-flex py-0 mb-7">
              <v-spacer></v-spacer>
              <h4 style="font-weight: 500">Daily</h4>
              
            </v-col>

            <Daily />

          </v-row>
        </v-tab-item>

        <v-tab-item class="mt-3 py-0">
          <v-row class="mb-10">
            <v-col class="d-flex py-0 mb-7">
              <v-spacer></v-spacer>
              <h4 style="font-weight: 500">Weekly</h4>
              
            </v-col>

            <Weekly />

          </v-row>
        </v-tab-item>

        <v-tab-item class="mt-3 py-0">
          <v-row class="mb-10">
            <v-col class="d-flex py-0 mb-7">
              <v-spacer></v-spacer>
              <h4 style="font-weight: 500">Monthly</h4>
              
            </v-col>

            <Monthly />

          </v-row>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </div>
</template>

<script>
import Daily from './tasks/daily.vue'
import Weekly from './tasks/weekly.vue'
import Monthly from './tasks/monthly.vue'
import Usual from './tasks/usual.vue'
export default {
  data: () => ({
    tab: null,
    tasks: [],
  }),

  components: {
    Daily,
    Weekly,
    Monthly,
    Usual,
  },

  methods: {
  },

  mounted() {

  },

  computed: {

  },
  watch: {},
};
</script>

<style>
.back-color {
  background-image: linear-gradient(to top right, #5841e5, #2b28d3);
}
.back-color h4 {
  color: #ffffff;
}
.tabs {
  display: flex;
  padding: 0;
  margin: 0;
  height: min-content;
  overflow: visible;
}
.tab {
  max-height: 40px;
  height: 40px;
  text-transform: none;
  margin: 0 10px;
  transition: all 0.2s ease-out;
  box-shadow: 0 2px 3px #00000053;
  border-radius: 40px;
  display: flex;
  align-self: center;
  background-color: white;
}
.tab::before {
  background-color: transparent;
}
.tab:hover {
  transform: translateY(-3px);
}
.tab h4 {
  font-weight: 500;
  font-size: 0.8rem;
}

#banner {
  border-radius: 15px;
}
.v-slide-group__prev.v-slide-group__prev--disabled {
  display: none;
  position: absolute;
}
</style>