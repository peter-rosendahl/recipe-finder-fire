<script setup>
import TheFooter from './components/TheFooter.vue';
import TheNavigation from './components/TheNavigation.vue';
import TheAuthBar from './components/TheAuthBar.vue';
import TheShoppingList from './components/TheShoppingList.vue';
</script>

<template>
  <v-app>
    <v-app-bar app>
      <v-btn icon @click="toggleNavMenu"><v-icon size="x-large">mdi-menu</v-icon></v-btn>
      <v-app-bar-title class="app-title"><span @click="$router.push('/')" class="clickable">Recipe Finder</span></v-app-bar-title>
      <TheShoppingList/>
      
      <v-btn icon @click="onAccountNavToggled"><v-icon size="x-large">mdi-account</v-icon></v-btn>
    </v-app-bar>
    <v-navigation-drawer 
      temporary
      v-model="isNavigationOpen">
      <TheNavigation/>
    </v-navigation-drawer>
    <v-navigation-drawer
      temporary
      location="right"
      v-model="isAccountMenuOpen"
      @update:modelValue="onAccountModelChange">
      <TheAuthBar/>
    </v-navigation-drawer>

    <v-main class="background">
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>
    <TheFooter/>
  </v-app>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
const authHelper = createNamespacedHelpers("auth");
export default {
  data() {
    return {
      isNavigationOpen: false
    }
  },

  computed: {
    ...authHelper.mapGetters(["isAccountMenuOpen"])
  },

  methods: {
    ...authHelper.mapActions(["toggleAccountMenu"]),
    toggleNavMenu() {
      console.log('toggleNavMenu pressed', this.isNavigationOpen);
      this.isNavigationOpen = !this.isNavigationOpen;
    },

    onAccountNavToggled() {
      this.toggleAccountMenu(!this.isAccountMenuOpen);
    },

    onAccountModelChange(e) {
      this.toggleAccountMenu(e);
    }
  }
}
</script>

<style scoped>

.app-title {
  min-width: max-content;
}

.clickable {
  cursor: pointer;
}

.background {
  /* background: linear-gradient(0deg, rgba(210,180,140,1) 32%,rgba(210,180,140,0.1) 90%); */
  background: linear-gradient(180deg, #d1e7ee 32%,#6badc1 90%);
}
.center-nav {
  display: flex;
  justify-content: center;
  flex-grow: 1;
}
</style>
