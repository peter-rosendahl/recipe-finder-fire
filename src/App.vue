<script setup>
import TheFooter from './components/TheFooter.vue';
import TheNavigation from './components/TheNavigation.vue';
import TheAuthBar from './components/TheAuthBar.vue';
import TheShoppingList from './components/TheShoppingList.vue';
</script>

<template>
  <v-app>
    <v-app-bar app>
      <v-app-bar-title class="app-title" @click="$router.push('/')">Recipe Finder</v-app-bar-title>
      
      <div class="center-nav">
        <TheNavigation/>
      </div>
      <TheShoppingList/>
      <TheAuthBar/>
    </v-app-bar>
    <v-main class="background">
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>
    <TheFooter/>
  </v-app>
</template>

<style scoped>

.app-title {
  min-width: max-content;
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
