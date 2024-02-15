<template>
    <v-form v-model="isValid">
        <v-container>
            <form-progress
                ref="progress"
                :total-basic-fields="6"
                :total-ingredient-fields="this.recipeIngredients.length *2"
                :total-preparation-fields="30"
                :current-page="currentPage"
                @onPageChange="goToPage"></form-progress>
            <template v-if="currentPage == 1">
                <v-row>
                    <v-col cols="12" sm="4">
                        <v-text-field
                            v-model="recipe.recipeName"
                            ref="name"
                            label="Recipe Name"
                            autofocus
                            variant="solo"
                            density="compact"
                            required
                            @input="onFieldChange('basic')"
                            ></v-text-field>    
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-select 
                            :items="languageList" 
                            ref="language"
                            item-title="label"
                            item-value="code"
                            v-model="recipe.language"
                            variant="solo"
                            density="compact"
                            label="Language"
                            @update:modelValue="onFieldChange('basic')"
                            ></v-select>                           
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-select 
                            :items="this.recipeCategoryList"
                            v-model="recipe.category"
                            ref="category"
                            variant="solo"
                            density="compact"
                            label="Category"
                            @update:modelValue="onFieldChange('basic')"
                            ></v-select>                         
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-select 
                            :items="this.recipeCultureList"
                            v-model="recipe.culture"
                            ref="culture"
                            variant="solo"
                            density="compact"
                            label="Culture"
                            @update:modelValue="onFieldChange('basic')"
                            ></v-select>
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-text-field
                            v-model="recipe.personCount"
                            ref="people"
                            variant="solo"
                            density="compact"
                            type="number"
                            label="Person"
                            required
                            @input="onFieldChange('basic')"
                            ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-text-field
                            v-model="recipe.preparationMinutes"
                            ref="minutes"
                            variant="solo"
                            density="compact"
                            type="number"
                            label="Minutes of preparation"
                            required
                            @input="onFieldChange('basic')"
                            ></v-text-field>
                    </v-col>
                </v-row>
            </template>
            <template v-if="currentPage == 2">
                <v-row>
                    <v-col cols="12" sm="4" style="display: flex; flex-flow: row nowrap; justify-content: start;">
                        <h3 class="page-title">Ingredients</h3>
                    </v-col>
                </v-row>
                <template v-for="item in recipeIngredients">
                    <v-row>
                        <v-col cols="12" sm="6">
                            <v-select 
                                :items="this.ingredients.map(x => x.name.en)" 
                                v-model="item.selectedName"
                                @update:modelValue="(e) => setIngredient(e, item)"
                                variant="solo"
                                density="compact"
                                hide-details
                                single-line
                                dense
                                label="Name"
                            ></v-select>
                        </v-col>
                        <v-col cols="12" sm="4">
                            <v-text-field
                                v-model="item.quantity"
                                hide-details
                                density="compact"
                                variant="solo"
                                dense
                                label="Quantity">
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="2">
                            <v-select
                                :items="item.unitTypeList"
                                v-model="item.selectedUnitType"
                                variant="solo"
                                density="compact"
                                dense
                                label="Unit type"></v-select>
                        </v-col>
                    </v-row>
                </template>
                <v-row>
                    <v-col>
                        <v-btn class="add-ingredient-btn" solo @click="addIngredient()">
                            Add ingredient
                        </v-btn>
                    </v-col>
                </v-row>
            </template>
            <template v-if="currentPage == 3">
                <v-row>
                    <v-col>
                        <h3 class="page-title">Preparation</h3>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-textarea 
                            v-model="recipe.preparation"
                            ref="preparation"
                            variant="solo"
                            density="compact"
                            label="Preparation"
                            @input="onFieldChange('preparation')"
                        ></v-textarea>
                    </v-col>
                </v-row>
            </template>
            <v-row class="justify-between">
                <v-col>
                    <v-btn flat :disabled="currentPage == 1" @click="goToPrevious">Back</v-btn>
                </v-col>
                <v-col cols="12" sm="2" style="display: flex; justify-content: end;">
                    <v-btn v-if="currentPage == 3" :disabled="recipe.preparation.length == 0" color="primary" @click="onSave">Save</v-btn>
                    <v-btn v-else color="babyblue" @click="goToNext">Next</v-btn>
                </v-col>
            </v-row>
        </v-container>
    </v-form>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import FormProgress from './recipe/FormProgress.vue';
const ingredientHelper = createNamespacedHelpers("ingredient");
const recipeHelper = createNamespacedHelpers("recipe");

    export default {
        components: {
            'form-progress': FormProgress
        },
        data() {
            return {
                isValid: true,
                currentPage: 1,
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
                if (this.existingRecipe.ingredients.length > 0) {
                    this.recipeIngredients = this.existingRecipe.ingredients.map(item => {
                        const src = this.ingredients.find(x => x.id == item.id);
                        if (src != null) {
                            return {
                                ...item,
                                selectedUnitType: item.unitType,
                                selectedName: src.name.en,
                                unitTypeList: src.unitType
                            };
                        }
                    })
                } else {
                    this.addIngredient();
                }
            }
        },

        computed: {
            ...ingredientHelper.mapGetters(["ingredients", "unitTypeList"]),
            ...recipeHelper.mapGetters(["recipeCategoryList", "recipeCultureList"]),
        },

        methods: {
            ...recipeHelper.mapActions(["updateRecipeAsync"]),
            ...ingredientHelper.mapActions(["fetchIngredients"]),

            goToNext() {
                if (this.currentPage == 3) return;
                this.currentPage++;
            },

            goToPrevious() {
                if (this.currentPage == 1) return;
                this.currentPage--;
            },

            goToPage(pageNumber) {
                if (this.currentPage == pageNumber) return;
                this.currentPage = pageNumber;
            },

            async addIngredient() {
                if (this.ingredients.length == 0) {
                    await this.fetchIngredients();
                };
                console.log("addIngredient", this.ingredients);
                const tmp = this.ingredients[0];
                this.recipeIngredients.push({
                    id: tmp.id,
                    name: tmp.name,
                    selectedName: tmp.name.en,
                    quantity: 1,
                    recipeId: 0,
                    unitType: "g"
                });
            },

            setIngredient(value, item) {
                console.log('setIngredient', value, item, this.recipeIngredients);
                const ingredient = this.ingredients.find(x => x.name.en.includes(value));
                if (ingredient != null) {
                    console.log("found ingredient", ingredient);
                    const existing = this.recipeIngredients.find(x => x.selectedName == value);
                    console.log("existing ingredient", existing);
                    const itemtoBeAdded = {
                        id: ingredient.id,
                        name: ingredient.name,
                        selectedName: value,
                        unitTypeList: ingredient.unitType,
                        selectedUnitType: ingredient.unitType[0],
                        quantity: 0,
                    };

                    if (existing == null) {
                        this.recipeIngredients.push(itemtoBeAdded);
                    } else {
                        itemtoBeAdded.quantity = existing.quantity;
                        const index = this.recipeIngredients.indexOf(existing);
                        console.log('found item', itemtoBeAdded);
                        this.recipeIngredients[index] = itemtoBeAdded;
                        console.log('result', index, this.recipeIngredients[index]);
                    }
                }
            },

            onFieldChange(groupType) {
                switch (groupType) {
                    case "basic":
                        const basicInputCount = this.calculateBasic();
                        this.$refs.progress.update(groupType, basicInputCount);
                        break;

                    case "ingredients":
                        break;
                            
                    case "preparation":
                        const prepLength = this.$refs.preparation.value.length;
                        this.$refs.progress.update(groupType, prepLength);
                
                    default:
                        break;
                }
            },

            calculateBasic() {
                const name = this.$refs.name.value.length > 0 ? 1 : 0,
                    language = this.$refs.language.value.length > 0 ? 1 : 0,
                    category = this.$refs.category.value.length > 0 ? 1 : 0,
                    culture = this.$refs.culture.value.length > 0 ? 1 : 0,
                    people = this.$refs.people.value.length > 0 ? 1 : 0,
                    minutes = this.$refs.minutes.value.length > 0 ? 1 : 0;
                return name + language + category + culture + people + minutes;
            },

            onSave() {
                this.recipe.ingredients = this.recipeIngredients.map(x => {
                    return {
                        id: x.id,
                        quantity: x.quantity,
                        recipeId: this.recipe.id,
                        unitType: x.selectedUnitType
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
    .progress {
        display: flex;
        height: 64px;
        flex-flow: row nowrap;
        align-items: center;
        .step {
            max-width: max-content;
            margin: 0 20px;
            font-weight: bolder;
            
            p {
                color: #CCC;
            }

            &.active {
                p {
                    color: rgb(var(--v-theme-taupe));
                }
            }

            &.completed {
                p {
                    color: rgb(var(--v-theme-success));
                }
            }
        }
        .divider {
            display: flex;
            padding: 0;
            flex-grow: 1;
            height: 0px;
            border-bottom: 1px solid rgba(0,0,0,0.25);
        }
    }

    .add-ingredient-btn {
        width: 100%;
    }

    .page-title {
        text-align: center;
        color: rgb(var(--v-theme-taupe));
    }
</style>