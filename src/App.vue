<script setup>
import TheFooter from './components/TheFooter.vue';
import TheNavigation from './components/TheNavigation.vue';
import TheAuthBar from './components/TheAuthBar.vue';
</script>

<template>
  <v-app>
    <v-app-bar app>
      <v-app-bar-title>Recipe Finder</v-app-bar-title>
      <TheAuthBar/>
    </v-app-bar>
    <TheNavigation/>
    <v-main class="background">
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>
    <TheFooter/>
  </v-app>
</template>

<style scoped>
.background {
  /* background: linear-gradient(0deg, rgba(210,180,140,1) 32%,rgba(210,180,140,0.1) 90%); */
  background: linear-gradient(0deg, rgb(169 131 103) 32%,rgba(169,131,103,0.1) 90%);
}
</style>
