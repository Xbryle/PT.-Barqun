<template>
    <div class="tasks-container mb-4">
        <NavigationDrawer/>
        <v-tabs v-model="tab" hide-slider background-color="transparent" style="margin-left: 2rem; width: fit-content; margin-top: -55px;" class="mb-4">
            <v-tab class="tab d-flex align-center justify-center"
                active-class="border-round back-color"
                style="
                width: 7em;
                cursor: pointer;
                height: fit-content;
                padding: 10px 0; width: 130px; scale: .9;">
                <h4 class="mr-1">Table</h4>
                <v-icon class="tab-icon" style="font-size: 1rem;">fa-table</v-icon>
            </v-tab>
            <v-tab class="tab d-flex align-center justify-center ms-n3"
                active-class="border-round back-color"
                style="
                width: 7em;
                cursor: pointer;
                height: fit-content;
                padding: 10px 0; width: 130px; scale: .9;">
                <h4 class="mr-1">Card</h4>
                <v-icon class="tab-icon" style="font-size: 1rem;">fa-id-card</v-icon>
            </v-tab>
        </v-tabs>
        <div class="py-7 px-7" style="box-shadow: 0px 3px 5px #888888; background-color: #ffffff; border-radius: 10px; height: fit-content; min-height: 90vh;">
            <v-tabs-items v-model="tab" class="transparent" style="position: inline; overflow: visible;">
                <v-tab-item class="mt-1 py-0" style="position: inline; overflow: visible;">
                    <DataTable/>
                </v-tab-item>
                <v-tab-item class="mt-1 py-0" style="position: inline; overflow: visible;">
                    <DataCard/>
                </v-tab-item>
            </v-tabs-items>
        </div>
    </div>
</template>

<script>
import NavigationDrawer from '@/components/SidebarView.vue';
import DataTable from '@/components/DataTable.vue'
import DataCard from '@/components/DataCard.vue'
export default {
    data: ()=> ({
        tab: null,
    }),
    components: {
        NavigationDrawer,
        DataTable,
        DataCard,
    }
}
</script>

<style>
.back-color {
  background-image: linear-gradient(to top right, #5841e5, #2b28d3);
}
.back-color h4, .back-color .tab-icon {
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

.tasks-container {
    position: relative;
    padding-left: 30px;
    padding-right: 30px;
    font-family: "poppins";
}

</style>