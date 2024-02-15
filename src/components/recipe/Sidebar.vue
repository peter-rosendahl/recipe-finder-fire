<template>
    <v-navigation-drawer app fixed permanent :rail="isCollapsed">
        <v-container>
            <slot v-if="!isCollapsed" name="content"></slot>
        </v-container>
        
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
</template>

<script>
export default {

    data() {
        return {
            isCollapsed: true,
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