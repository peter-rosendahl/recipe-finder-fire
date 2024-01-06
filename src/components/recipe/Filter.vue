<template>
    <v-expansion-panels>
        <v-expansion-panel
            title="Categories">
            <v-expansion-panel-text>
                <div class="categories">
                    <template v-for="item in this.recipeCategoryList">
                        <v-checkbox 
                            class="item"
                            density="compact"
                            hide-details="true"
                            :label="item"
                            :value="item"
                            v-model="categorySelected"
                            @change="filterChanged"></v-checkbox>
                    </template>
                </div>
            </v-expansion-panel-text>
        </v-expansion-panel>
        <v-expansion-panel
            title="Cultures">
            <v-expansion-panel-text>
                <div class="cultures">
                    <template v-for="item in this.recipeCultureList">
                        <v-checkbox 
                            class="item"
                            density="compact"
                            hide-details="true"
                            :label="item"
                            :value="item"
                            v-model="cultureSelected"
                            @change="filterChanged"></v-checkbox>
                    </template>
                </div>
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>
</template>

<script>

import { createNamespacedHelpers } from 'vuex';
const recipeHelper = createNamespacedHelpers("recipe");
const ingredientHelper = createNamespacedHelpers("ingredient");

export default {
    data() {
        return {
            categorySelected: [],
            cultureSelected: []
        }
    },
    
    props: {
        onChanged: {
            type: Function,
            required: true
        }
    },

    computed: {
        ...recipeHelper.mapGetters(["recipeCategoryList", "recipeCultureList"]),
        ...ingredientHelper.mapGetters(["ingredientCategoryList"]),
    },

    methods: {
        filterChanged(value) {
            console.log('filterChanged triggered', value);
            this.onChanged(this.categorySelected, this.cultureSelected);
        }
    }
}
</script>

<style lang="scss" scoped>
    .filter-section {
        padding: 12px 0;
    }
    .max-height-200 {
        height: 200px;
        overflow-y: scroll;
    }

    .categories .item, .cultures .item {
    }
</style>