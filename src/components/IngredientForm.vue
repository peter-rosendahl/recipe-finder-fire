<template>
    <v-form v-model="isValid">
        <v-container>
            <v-row>
                <v-col cols="12" md="6">
                    <v-row>
                        <v-col cols="12" sm="12">
                            <h3>Basic info</h3>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field
                                v-model="ingredient.name.da"
                                label="Danish name"
                                required
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field
                                v-model="ingredient.name.en"
                                label="English name"
                                required
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field
                                v-model="ingredient.name.is"
                                label="Icelandic name"
                                required
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-select 
                                :items="unitTypeList" 
                                v-model="ingredient.unitType"
                                density="compact"
                                label="Unit Type"
                            ></v-select>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-select 
                                :items="ingredientCategoryList" 
                                v-model="ingredient.category"
                                density="compact"
                                label="Category"
                            ></v-select>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="12" md="6">
                    <v-row>
                        <v-col cols="12" sm="12">
                            <h3>Nutritional facts:</h3>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field
                                v-model="ingredient.energy"
                                label="Energy"
                                type="number"
                                required
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field
                                v-model="ingredient.calories"
                                label="Calories"
                                type="number"
                                required
                                @input="onCaloriesChange"
                                :onchange="onCaloriesChange"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field
                                v-model="ingredient.fat"
                                label="Fat"
                                type="number"
                                required
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field
                                v-model="ingredient.saturatedFat"
                                label="Saturated fat"
                                type="number"
                                required
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field
                                v-model="ingredient.carbohydrates"
                                label="Carbohydrates"
                                type="number"
                                required
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field
                                v-model="ingredient.sugars"
                                label="Sugars"
                                type="number"
                                required
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field
                                v-model="ingredient.fiber"
                                label="Fiber"
                                type="number"
                                required
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field
                                v-model="ingredient.protein"
                                label="Protein"
                                type="number"
                                required
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field
                                v-model="ingredient.salt"
                                label="Salt"
                                type="number"
                                required
                            ></v-text-field>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
            <v-row>
            </v-row>
            <v-row v-if="!isValid">
                <v-col cols="12" sm="4">
                    <p color="danger">Recipe by this name already exist.</p>
                </v-col>
            </v-row>
            <div class="form-actions">
                <v-btn variant="plain" @click="this.onSaved()">Cancel</v-btn>
                <v-btn style="margin: 0 0 0 auto" color="success" @click="save">Save</v-btn>
            </div>
        </v-container>
    </v-form>
</template>

<script>
    import { createNamespacedHelpers } from 'vuex';
    const ingredientHelper = createNamespacedHelpers('ingredient');

    export default {
        
        data() {
            return {
                isLoading: false,
                isValid: true,
                ingredient: {
                    id: 0,
                    name: {
                        da: "",
                        en: "",
                        is: ""
                    },
                    unitType: "",
                    category: "",
                    energy: 0,
                    calories: 0,
                    water: 0,
                    protein: 0,
                    carbohydrates: 0,
                    sugars: 0,
                    fiber: 0,
                    fat: 0,
                    saturatedFat: 0,
                    salt: 0
                },
                formTemplate: {
                    id: 0,
                    name: {
                        da: "",
                        en: "",
                        is: ""
                    },
                    unitType: "",
                    category: "",
                    energy: 0,
                    calories: 0,
                    water: 0,
                    protein: 0,
                    carbohydrates: 0,
                    sugars: 0,
                    fiber: 0,
                    fat: 0,
                    saturatedFat: 0,
                    salt: 0
                },
                response: ""
            }
        },
        props: {
            onSaved: {
                type: Function,
                required: true
            },
            existingIngredient: {
                type: Object,
                required: false
            },
        },
        mounted() {
            this.ingredient = this.existingIngredient ?? this.formTemplate;
        },
        computed: {
            ...ingredientHelper.mapGetters([
                "ingredients",
                "unitTypeList",
                "ingredientCategoryList"
            ])
        },
        methods: {
            ...ingredientHelper.mapActions(["updateIngredientAsync"]),

            onCaloriesChange(e) {
                const value = e.target.value;
                this.ingredient.energy = Math.round(parseInt(value) * 4.184);
            },

            /** (public) Feeds the ingredientForm with the existing ingredient data.*/
            set(existing) {
                this.ingredient.id = existing.id,
                this.ingredient.name = existing.name,
                this.ingredient.unitType = existing.unitType
            },

            async save() {
                if (this.ingredient.id == 0) {
                    const existingName = this.ingredients.find(x => x.name.en.toLowerCase() == this.ingredient.name.en.toLowerCase());
                    if (existingName != null) {
                        this.isValid = false;
                        return;
                    }
                }
                this.isLoading = true;
                this.updateIngredientAsync(this.ingredient)
                    .then(result => {
                        if (result == undefined) {
                            this.isLoading = false;
                            this.response = "saving ingredient attempted.";
                            this.onSaved();
                        }
                    });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .form-actions {
        display: flex;
        justify-content: space-between;
    }
</style>