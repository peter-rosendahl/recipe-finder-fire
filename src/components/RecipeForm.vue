<template>
    <v-form v-model="isValid">
        <v-container>
            <v-row>
                <v-col cols="12" md="6">
                    <v-row>
                        <v-col cols="12" sm="12">
                            <h3>Basic info</h3>
                        </v-col>
                        <v-col cols="12" md="12">
                            <v-text-field
                                v-model="recipe.recipeName"
                                density="compact"
                                label="Recipe Name"
                                required
                            ></v-text-field>                           
                            <v-select 
                                :items="languageList" 
                                item-title="label"
                                item-value="code"
                                v-model="recipe.language"
                                density="compact"
                                label="Language"
                            ></v-select>                           
                            <v-select 
                                :items="this.recipeCategoryList"
                                v-model="recipe.category"
                                density="compact"
                                label="Category"
                            ></v-select>                         
                            <v-select 
                                :items="this.recipeCultureList"
                                v-model="recipe.culture"
                                density="compact"
                                label="Culture"
                            ></v-select>
                            <v-text-field
                                v-model="recipe.personCount"
                                density="compact"
                                type="number"
                                label="Person"
                                required
                            ></v-text-field>
                            <v-text-field
                                v-model="recipe.preparationMinutes"
                                density="compact"
                                type="number"
                                label="Minutes of preparation"
                                required
                            ></v-text-field>
                            <v-textarea 
                                v-model="recipe.preparation"
                                density="compact"
                                label="Preparation"
                            ></v-textarea>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="12" md="6">
                    <v-row>
                        <v-col cols="12" sm="4" style="display: flex; flex-flow: row nowrap; justify-content: start;">
                            <h3>Ingredients</h3>
                            <v-btn 
                                icon="mdi-plus"
                                density="compact" 
                                color="light-green" 
                                style="margin-left: 15px;"
                                @click="addIngredient()" 
                                ></v-btn>
                        </v-col>
                        <v-col cols="12" sm="2">
                        </v-col>
                    </v-row>
                    <!-- <v-row>
                        <v-data-table
                            :items="recipeIngredients"
                            :headers="ingredientColumns"
                            density="compact">
                            <template v-slot:item.selectedName="{ item }">
                                <v-select 
                                    :items="this.ingredients.map(x => x.name.en)" 
                                    v-model="item"
                                    @update:modelValue="(e) => setIngredient(e, item)"
                                    variant="underlined"
                                    density="compact"
                                    label="Name"
                                ></v-select>
                            </template>
                            <template v-slot:item.quantity="{ item }">
                                <v-text-field
                                    v-model="item.quantity"
                                    variant="underlined"
                                    density="compact"
                                    :label="`Quantity (${item.unitType})`">
                                </v-text-field>
                            </template>
                        </v-data-table>
                    </v-row> -->
                    <v-row>
                        <template v-for="item in recipeIngredients">
                            <v-col cols="12" sm="4">
                                <v-card>
                                    <v-card-text>
                                        <v-row>
                                            <v-col cols="12" sm="12">
                                                <v-select 
                                                    :items="this.ingredients.map(x => x.name.en)" 
                                                    v-model="item.selectedName"
                                                    @update:modelValue="(e) => setIngredient(e, item)"
                                                    variant="underlined"
                                                    density="compact"
                                                    label="Name"
                                                ></v-select>
                                            </v-col>
                                            <v-col cols="12" sm="8">
                                                <v-text-field
                                                    v-model="item.quantity"
                                                    density="compact"
                                                    :label="`Quantity (${item.unitType})`">
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="4">
                                                <p></p>
                                            </v-col>
                                        </v-row>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </template>
                    </v-row>
                </v-col>
            </v-row>
            <v-row class="justify-end">
                <v-col cols="12" sm="2" style="display: flex; justify-content: end;">
                    <v-btn color="primary" @click="onSave">Save</v-btn>
                </v-col>
            </v-row>
        </v-container>
    </v-form>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
const ingredientHelper = createNamespacedHelpers("ingredient");
const recipeHelper = createNamespacedHelpers("recipe");
    export default {
        data() {
            return {
                isValid: true,
                recipe: {
                    id: 0,
                    authorId: "",
                    authorName: "",
                    recipeName: "",
                    language: "",
                    culture: "",
                    category: "",
                    images: [],
                    personCount: 1,
                    preparation: "",
                    preparationMinutes: "",
                },
                recipeIngredients: [],
                languageList: [
                    {code: "da", label: "Danish"},
                    {code: "en", label: "English"},
                    {code: "is", label: "Icelandic"}
                ],
                ingredientColumns: [
                    { title: "Name", key: 'selectedName' },
                    { title: "Quantity", key: 'quantity' }
                ]
            }
        },

        props: {
            existingRecipe: {
                type: Object,
                required: false
            },
            onSuccess: {
                type: Function,
                required: true,
            }
        },

        created() {
            if (this.ingredients.length == 0) {
                this.fetchIngredients();
            };
            if (this.existingRecipe != null) {
                console.log("existing recipe", this.existingRecipe);
                this.recipe = this.existingRecipe;
                this.recipeIngredients = this.existingRecipe.ingredients.map(item => {
                    const src = this.ingredients.find(x => x.id == item.id);
                    if (src != null) {
                        return {
                            ...item,
                            selectedName: src.name.en,
                            unitType: src.unitType
                        };
                    }
                })
            };
        },

        computed: {
            ...ingredientHelper.mapGetters(["ingredients", "unitTypeList"]),
            ...recipeHelper.mapGetters(["recipeCategoryList", "recipeCultureList"]),
        },

        methods: {
            ...recipeHelper.mapActions(["updateRecipeAsync"]),
            ...ingredientHelper.mapActions(["fetchIngredients"]),
            addIngredient() {
                console.log("addIngredient", this.ingredients);
                const tmp = this.ingredients[0];
                this.recipeIngredients.push({
                    id: tmp.id,
                    name: tmp.name,
                    quantity: 1,
                    recipeId: 0,
                    unitType: "g"
                });
            },

            setIngredient(value, item) {
                console.log(value, item, this.recipeIngredients);
                const ingredient = this.ingredients.find(x => x.name.en == value);
                if (ingredient != null) {
                    console.log("found ingredient", ingredient);
                    const existing = this.recipeIngredients.find(x => x.selectedName == value);
                    const foundItem = {
                        id: ingredient.id,
                        name: ingredient.name,
                        selectedName: value,
                        unitType: ingredient.unitType,
                        quantity: existing.quantity,
                    };
                    const index = this.recipeIngredients.indexOf(existing);
                    console.log('found item', foundItem);
                    this.recipeIngredients[index] = foundItem;
                    console.log('result', index, this.recipeIngredients[index]);
                }
            },

            onSave() {
                this.recipe.ingredients = this.recipeIngredients.map(x => {
                    return {
                        id: x.id,
                        quantity: x.quantity,
                        recipeId: this.recipe.id
                    }
                });
                console.log('result', this.recipe, this.recipeIngredients);
                this.updateRecipeAsync(this.recipe)
                    .then(result => {
                        console.log('onSave result', result);
                        this.onSuccess();
                    })
                    .catch(error => {
                        console.log("onSave error", error);
                    });
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>