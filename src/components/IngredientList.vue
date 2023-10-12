<template>
    <v-container color="primary darken-4">
        <v-row v-if="this.currentMember != null">
            <v-col cols="12" sm="6">
                <h1 class="text-driftwood">Ingredients</h1>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="12" sm="4" style="text-align: end">
                <v-btn fab icon color="driftwood" @click="edit(null)">
                    <v-icon icon="mdi-plus"></v-icon>
                </v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-data-table
                :loading="this.isLoading"
                :items="this.ingredients"
                :headers="headers"
                
                item-value="name"
                >
                <template v-slot:item.customName="{item}">
                    <p class="clickable" @click="edit(item)">{{ item.raw.name.en }}</p>
                </template>
                <template v-slot:item.sugarIndex="{item}">
                    <p>{{ renderSugarIndex(item) }}</p>
                </template>
                <template v-slot:item.fatIndex="{item}">
                    <p>{{ renderFatIndex(item) }}</p>
                </template>
            </v-data-table>
        </v-row>
    </v-container>

    <v-dialog
        v-model="isEditFormVisible"
        width="900px">
        <v-card>
            <v-card-title>
                {{ selectedIngredient == null ? 'Add Ingredient' : `Edit Ingredient (#${selectedIngredient.id})` }}
            </v-card-title>
            <IngredientForm 
                ref="ingredientForm" 
                :existing-ingredient="selectedIngredient"
                :on-saved="onIngredientSaved"></IngredientForm>
        </v-card>
    </v-dialog>
</template>

<script>
    import IngredientForm from './IngredientForm.vue';
    import { createNamespacedHelpers } from 'vuex';
    const ingredientHelper = createNamespacedHelpers("ingredient");
    const authHelper = createNamespacedHelpers("auth");

    export default {
        name: "IngredientList",
        data() {
            return {
                headers: [
                    { title: "Name", align: "start", key: "customName" },
                    { title: "Unit Type", key: "unitType"},
                    { title: "Calories", align: "start", key: "calories" },
                    { title: "Carbs", align: "start", key: "carbohydrates" },
                    { title: "Sugar Index", align: "start", key: "sugarIndex" },
                    { title: "Fat", align: "start", key: "fat" },
                    { title: "Fat Index", align: "start", key: "fatIndex" },
                    { title: "Protein", align: "start", key: "protein" }
                ],
                selectedIngredient: {
                    id: 0,
                    name: {
                        da: "",
                        en: "",
                        is: "",
                    },
                    unitType: ""
                },
                isEditFormVisible: false,
            }
        },
        computed: {
            ...authHelper.mapGetters(["currentMember"]),
            ...ingredientHelper.mapGetters(["ingredients", "isLoading"]),
        },
        watch: {
            ingredients: {
                handler(changes) {
                },
                // immediate: true
            },
            isLoading: {
                handler(changed) {
                },
                // immediate: true
            }
        },
        created() {
            this.fetchIngredients();
        },
        methods: {
            ...ingredientHelper.mapActions(["fetchIngredients"]),

            renderSugarIndex(item) {
                const {sugars, carbohydrates} = item.raw;
                if (!isNaN(sugars) && !isNaN(carbohydrates)) {
                    if (sugars == "0") {
                        return "0 %";
                    } else {
                        return `${((sugars / carbohydrates) * 100).toFixed(2)} %`;
                    }
                } else {
                    return "-";
                }
            },
            
            renderFatIndex(item) {
                const {saturatedFat, fat} = item.raw;
                if (!isNaN(saturatedFat) && !isNaN(fat)) {
                    if (saturatedFat == "0") {
                        return "0 %";
                    } else {
                        return `${((saturatedFat / fat) * 100).toFixed(2)} %`;
                    }
                } else {
                    return "-";
                }
            },

            edit(item) {
                this.selectedIngredient = item?.raw;
                this.isEditFormVisible = true;
                // this.$refs.ingredientForm.set(item.raw);
            },

            onIngredientSaved() {
                this.isEditFormVisible = false;
            }
        },
        components: {
            IngredientForm
        }
    }
</script>

<style lang="scss" scoped>
    .ingredient {
        display: flex;
        flex-flow: column nowrap;
        justify-content: start;
        align-items: start;
        text-align: left;
        margin-bottom: 15px;

        .key {
            font-weight: 800;
            outline: 1px solid blue;
        }

        .value {
            color: #ddd;
            outline: 1px solid green;
        }
    }

    .clickable {
        cursor: pointer;

        &:hover {
            text-decoration: underline;
        }
    }
</style>