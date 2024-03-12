<template>
    <!-- <page-sidebar>
        <template #content>
            <h4>Order by</h4>
            <v-select
                :items="orderBy.items"
                v-model="orderBy.selected"
                @update:modelValue="(value) => setOrder(value)"
                variant="underlined"
                density="compact"></v-select>

            <recipe-filter :on-changed="filterChanged"></recipe-filter>
        </template>
    </page-sidebar> -->

    <v-row>
        <template v-if="displayedRecipes.length > 0">
            <template v-for="item in displayedRecipes">
                <v-col cols="12" md="6" lg="4">
                    <v-card class="clickable" @click="goToRecipe(item.id)">
                        <v-card-title>{{ item.recipeName }}</v-card-title>
                        <v-card-subtitle>
                            <div class="facts">
                                <div class="item">
                                    <v-icon>mdi-timer-outline</v-icon> 
                                    <span>{{ item.preparationMinutes }}</span>
                                </div>
                                <div class="item">
                                    <v-icon>mdi-account</v-icon> 
                                    <span>{{ item.personCount }}</span>
                                </div>
                                <div class="item">
                                    <span>{{ item.culture }} {{ item.category }}</span>
                                </div>
                            </div>
                        </v-card-subtitle>
                        <v-card-text>
                            {{ item.preparation.substring(0, 150) }}...
                        </v-card-text>
                    </v-card>
                </v-col>
            </template>
            <v-col cols="12" sm="12">
                <v-card v-if="this.currentMember != null" class="clickable" @click="openNewRecipeForm()">
                    <v-card-title class="create-card-title">
                        Create new recipe
                        <v-icon>mdi-plus</v-icon>
                    </v-card-title>
                </v-card>
            </v-col>
        </template>
        <template v-else>
            <v-col>
                <div class="empty-list-display">
                    <h1>No recipes to display</h1>
                    <template v-if="this.currentMember != null">
                        <v-btn rounded color="babyblue" @click="openNewRecipeForm()">
                            Create recipe
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                    </template>
                    <template v-else>
                        <p>Create a profile to start creating recipes.</p>
                    </template>
                </div>
            </v-col>
        </template>
    </v-row>

    <v-dialog
        v-model="newRecipeForm.isVisible"
        max-width="700px">
        <v-card>
            <v-toolbar>
                <v-toolbar-title class="text-h6">
                    New Recipe
                </v-toolbar-title>
                <template v-slot:append>
                    <v-btn icon="mdi-close" @click="newRecipeForm.isVisible = false"></v-btn>
                </template>
            </v-toolbar>
            <recipe-form 
                v-if="newRecipeForm.isVisible"
                ref="recipeForm" 
                :existing-recipe="newRecipeForm.template"
                :on-success="(id) => goToRecipe(id)"></recipe-form>
        </v-card>
    </v-dialog>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import RecipeForm from '../components/RecipeForm.vue';
import Filter from '../components/recipe/Filter.vue';
import Sidebar from '../components/recipe/Sidebar.vue';
const recipeHelper = createNamespacedHelpers("recipe");
const authHelper = createNamespacedHelpers("auth");
const profileHelper = createNamespacedHelpers("profile");

    export default {
        name: "RecipeList",

        components: {
            'recipe-form': RecipeForm,
            'recipe-filter': Filter,
            'page-sidebar': Sidebar
        },

        data() {
            return {
                displayedRecipes: [],
                filter: {
                    selectedList: [],
                    items: [
                        ""
                    ]
                },
                orderBy: {
                    selected: "",
                    items: [
                        "Name (A -> Z)",
                        "Name (Z -> A)",
                        "Preparation time (0 -> 99)",
                        "Preparation time (99 -> 0)",
                        "Sum of ingredient types (0 -> 99)",
                        "Sum of ingredient types (99 -> 0)",
                    ]
                },
                newRecipeForm: {
                    isVisible: false,
                    template: {
                        id: 0,
                        authorId: "",
                        authorName: "",
                        recipeName: "",
                        language: "",
                        culture: "",
                        category: "",
                        images: [],
                        ingredients: [],
                        personCount: 1,
                        preparation: "",
                        preparationMinutes: "",
                    }
                }
            }
        },

        mounted() {
            this.orderBy.selected = this.orderBy.items[0];
            console.log('RecipeListView mounted, orderby items', this.orderBy.items, "selected", this.orderBy.selected, 'recipe list', this.recipes);
            if (this.recipes.length == 0) {
                console.log('RecipeListView, fetching recipes...'); 
                this.fetchRecipes();
            } else {
                this.displayedRecipes = this.setDisplayedRecipes(this.currentMember?.id, this.orderBy.selected, this.recipes);
            }
        },

        computed: {
            ...authHelper.mapGetters(["currentMember"]),
            ...recipeHelper.mapGetters([
                "recipes", 
                "isLoading", 
                "unitTypeList", 
                "recipeCultureList",
                "recipeCategoryList"
            ])
        },
        watch: {
            ingredients: {
                handler(changes) {
                    console.log('watchIngredients', changes);
                },
                // immediate: true
            },
            recipes: {
                handler(changes) {
                    console.log('recipes watch triggered', changes);
                    this.displayedRecipes = this.setDisplayedRecipes(this.currentMember?.id, this.orderBy.selected, this.recipes);
                }
            },
            currentMember: {
                handler(changes) {
                    console.log('currentMember watch triggered', changes);
                    this.displayedRecipes = this.setDisplayedRecipes(changes.id, this.orderBy.selected, this.recipes);
                }
            },
            isLoading: {
                handler(changed) {
                    console.log('watchIsLoading', changed);
                },
                // immediate: true
            }
        },

        unmounted() {
            this.closeForm();
        },

        methods: {
            ...recipeHelper.mapActions(["fetchRecipes"]),
            ...profileHelper.mapActions(["setRecipeCount"]),

            filterChanged(categories, cultures) {
                console.log('Sidebar filter changed', categories, cultures);
                let filteredList = this.setDisplayedRecipes(this.currentMember.id, this.orderBy, this.recipes);
                if (categories.length > 0) {
                    filteredList = this.recipes.filter(item => categories.includes(item.category));
                }
                if (cultures.length > 0) {
                    filteredList = filteredList.length > 0 
                        ? filteredList.filter(item => cultures.includes(item.culture))
                        : this.recipes.filter(item => cultures.includes(item.culture));
                }
                if (filteredList.length == 0) {
                    filteredList = this.setDisplayedRecipes(this.currentMember.id, this.orderBy.selected);
                }
                console.log('result', filteredList);
                this.displayedRecipes = filteredList;
            },

            setOrder(value, item) {
                console.log('setOrder triggered', value, item);
                this.orderBy.selected = value;
                this.displayedRecipes = this.setDisplayedRecipes(this.currentMember.id, this.orderBy.selected, this.displayedRecipes);
            },

            setDisplayedRecipes(uid, orderBy, list) {
                console.log('setDisplayedRecipes triggered', uid, orderBy);
                // var userRecipes = this.recipes.filter(x => x.authorId == uid);
                var userRecipes = [...this.recipes];
                this.setRecipeCount(userRecipes.length);
                console.log('userRecipes', userRecipes);
                switch (orderBy) {
                    case "Name (A -> Z)":
                        return userRecipes.sort((a,b) => a.recipeName < b.recipeName ? -1 : 1);
                        
                    case "Name (Z -> A)":
                        return userRecipes.sort((a,b) => a.recipeName < b.recipeName ? 1 : -1);
                            
                    case "Preparation time (0 -> 99)":
                        return userRecipes.sort((a,b) => a.preparationMinutes < b.preparationMinutes ? -1 : 1);

                    case "Preparation time (99 -> 0)":
                        return userRecipes.sort((a,b) => a.preparationMinutes < b.preparationMinutes ? 1 : -1);

                    case "Sum of ingredient types (0 -> 99)":
                        return userRecipes.sort((a,b) => a.ingredients.length < b.ingredients.length ? -1 : 1);

                    case "Sum of ingredient types (99 -> 0)":
                        return userRecipes.sort((a,b) => a.ingredients.length < b.ingredients.length ? 1 : -1);
                    
                    default:
                        return userRecipes.sort((a,b) => a.recipeName < b.recipeName ? -1 : 1);
                }
            },

            goToRecipe(id) {
                this.$router.push(`/recipes/${id}`)
            },

            openNewRecipeForm() {
                const lastId = this.recipes[this.recipes.length-1].id;
                console.log("openNewRecipeForm id", lastId);
                this.newRecipeForm.template.id = lastId + 1;
                this.newRecipeForm.template.authorId = this.currentMember.id;
                this.newRecipeForm.template.authorName = this.currentMember.name;
                this.newRecipeForm.isVisible = true;
            },

            closeForm() {
                this.newRecipeForm.isVisible = false;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .clickable {
        cursor: pointer;
    }

    .facts {
        display: flex;
        flex-flow: row wrap;
        justify-content: start;
        align-items: center;

        .item {
            padding: 0 15px 0 0;
            min-width: 50px;
        }
    }

    .empty-list-display {
        display: flex;
        flex-flow: column;
        max-height: 500px;
        height: 360px;
        justify-content: center;
        align-items: center;

        h1 {
            color: rgba(0,0,0,0.3);
            margin: 0 0 36px;
        }

        .v-btn {
            .v-icon {
                padding: 0 0 0 12px;
            }
        }
    }

    .create-card-title {
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
        height: 100%;
        // justify-content: space-between;
    }

    @media screen and (max-width: 900px) {
        .title {
            font-size: 32px;
        }
    }
</style>