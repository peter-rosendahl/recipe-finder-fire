<template>
        <v-row>
            <v-col>
                <div class="main-header">
                    <h1 class="title text-driftwood">Recipes</h1>
                    <v-spacer></v-spacer>
                    <v-btn v-if="this.currentMember != null" color="driftwood" @click="openNewRecipeForm()" icon="mdi-pencil"></v-btn>
                </div>
            </v-col>
        </v-row>

        <template v-for="item in this.recipes.filter(x => x.authorId == this.currentMember?.id)">
            <v-row>
                <v-col>
                    <v-card>
                        <v-card-title @click="goToRecipe(item.id)">{{ item.recipeName }}</v-card-title>
                        <v-card-subtitle>
                            <v-row>
                                <v-col cols="12" sm="1">
                                    <v-icon>mdi-timer-outline</v-icon> 
                                    <span>{{ item.preparationMinutes }}</span>
                                </v-col>
                                <v-col cols="12" sm="1">
                                    <v-icon>mdi-account</v-icon> 
                                    <span>{{ item.personCount }}</span>
                                </v-col>
                                <v-col cols="12" sm="2">
                                    <span>{{ item.culture }}</span>
                                </v-col>
                            </v-row>
                        </v-card-subtitle>
                        <v-card-text>
                            {{ item.preparation.substring(0, 150) }}...
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </template>
        <v-dialog
            v-model="newRecipeForm.isVisible">
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
                    :on-success="closeForm"></recipe-form>
            </v-card>
        </v-dialog>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import RecipeForm from '../components/RecipeForm.vue';
const recipeHelper = createNamespacedHelpers("recipe");
const authHelper = createNamespacedHelpers("auth");

    export default {
        name: "RecipeList",

        components: {
            'recipe-form': RecipeForm
        },

        data() {
            return {
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
            isLoading: {
                handler(changed) {
                    console.log('watchIsLoading', changed);
                },
                // immediate: true
            }
        },

        created() {
            this.fetchRecipes();
        },

        methods: {
            ...recipeHelper.mapActions(["fetchRecipes"]),

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
                this.recipeForm.isVisible = false;
            }
        }
    }
</script>

<style lang="scss" scoped>


    @media screen and (max-width: 900px) {
        .title {
            font-size: 32px;
        }
    }
</style>