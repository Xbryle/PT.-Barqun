<template>
    <div class="users-container mb-4">
        <NavigationDrawer/>
        <div class="px-7" style="box-shadow: 0px 3px 5px #888888; background-color: #ffffff; border-radius: 10px; height: fit-content; min-height: 90vh;">
            <UsersTable/>
        </div>
    </div>
</template>

<script>
import NavigationDrawer from '@/components/SidebarView.vue';
import UsersTable from '@/components/UsersTable.vue';
import axios from 'axios';
export default {

    
components: {
    NavigationDrawer,
    UsersTable,
},

data: () => ({          
    headersManager: localStorage.getItem("token"),
    role: localStorage.getItem('roles'),
}),

methods: {

},

mounted() {

},

computed: {

},

}
</script>

<style scoped>
.users-container {
    position: relative;
    padding-left: 30px;
    padding-right: 30px;
    font-family: "poppins";
}
</style>