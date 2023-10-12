<template>
    <v-card>
      <v-navigation-drawer app fixed permanent :rail="isCollapsed">
        <v-list nav class="text-darkgreen">
            <template v-for="item in links">
                <router-link :to="item.link" class="text-darkgreen">
                  <v-list-item :prepend-icon="item.icon" :title="item.text"></v-list-item>
                </router-link>
            </template>
        </v-list>
        <template v-slot:append>
            <v-row class="pb-2">
                <v-spacer></v-spacer>
                <v-col cols="12" sm="12" style="text-align: end">
                    <v-btn icon flat @click="toggleExpand">
                        <v-icon>{{ isCollapsed ? "mdi-chevron-right" : "mdi-chevron-left" }}</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
        </template>
      </v-navigation-drawer>
    </v-card>
</template>

<script>
    export default {
        data() {
            return {
                isCollapsed: true,
            }
        },

        computed: {
            links() {
                return [
                    {
                        icon: "mdi-food-variant",
                        text: "Ingredients",
                        link: "/ingredients"
                    },
                    {
                        icon: "mdi-format-list-text",
                        text: "Recipes",
                        link: "/recipes"
                    }
                ]
            }
        },

        methods: {
            toggleExpand() {
                this.isCollapsed = !this.isCollapsed;
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>