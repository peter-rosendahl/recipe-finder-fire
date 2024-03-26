<template>
    <v-row>
        <v-col>
            <h1 class="title text-babyblue">
                <img class="title-icon" :src="renderFlag(recipe.language)" alt="">
                {{ recipe != null ? `${recipe.recipeName}` : '' }}
                <v-spacer></v-spacer>
                <v-btn v-if="this.currentMember != null" fab icon color="babyblue" @click="isEditRecipeVisible = true">
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
            </h1>
            <b class="text-babyblue">{{ recipe.authorName }}</b>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="12" sm="4" class="flex horizontal">
            <div class="flex horizontal ph_20 align_center">
                <v-icon>mdi-timer-outline</v-icon> &nbsp;
                <p>{{ recipe.preparationMinutes }} minutes</p>
            </div>
            <div class="flex horizontal ph_20 align_center">
                <v-icon>mdi-account</v-icon>  &nbsp;
                <p>{{ recipe.personCount }} person(s)</p>
            </div>
            <div class="flex horizontal ph_20 align_center">
                <p>{{ recipe.culture }} {{ recipe.category }}</p>
            </div>
        </v-col>
    </v-row>
    <v-row v-if="recipe.link != null && recipe.link.length > 0">
        <v-col>
            <span>Link reference: </span><a v-if="recipe.link.indexOf('http') != -1" target="_blank" :href="recipe.link">{{ recipe.link }}</a>
            <p v-else>{{ recipe.link }}</p>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="12" sm="4">
            <v-card>
                <v-card-item>
                    <v-card-title>Ingredients</v-card-title>
                    <template v-slot:append>
                        <v-btn icon color="babyblue" title="Add ingredients to shopping list" density="compact" @click="addToGroceryList">
                            <v-icon size="small">mdi-playlist-plus</v-icon>
                            <v-tooltip
                                activator="parent"
                                location="top"
                            >Add ingredients to shopping list</v-tooltip>
                        </v-btn>
                    </template>
                </v-card-item>
                <v-card-text>
                    <template v-for="ingredient in recipeIngredients">
                        <swipe>
                            <template v-slot:content>
                                <div class="ingredient-item">
                                    <span>{{ ingredient.quantity }}</span> &nbsp;
                                    <span style="flex-grow: 1">{{ ingredient.unitType }}</span>
                                    <span>{{ ingredient.name }}</span>
                                </div>
                            </template>
                        </swipe>
                    </template>
                </v-card-text>
            </v-card>
        </v-col>
        <v-spacer></v-spacer>
        <v-col 
            v-if="this.recipe != null && this.recipe.ingredients != null"
            cols="12" 
            sm="4" 
            class="align-self-end">
            <nutrition-card :ingredient-list="this.recipe?.ingredients"></nutrition-card>
        </v-col>
    </v-row>
    <v-row class="mt-10" v-if="this.recipe?.preparation != null">
        <v-col>
            <v-card>
                <v-card-title>Preparation</v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <p class="text base multiline">{{ this.recipe.preparation }}</p>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
    <v-row v-if="this.currentMember != null && this.recipe?.authoId == this.currentMember.uid && this.recipe?.personalNotes != null">
        <v-col>
            <v-card>
                <v-card-title>Personal Notes</v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <p class="text base multiline">{{ this.recipe.personalNotes }}</p>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>

    <v-dialog 
        v-model="isEditRecipeVisible"
        max-width="900px">
        <v-card>
            <v-toolbar>
                <v-toolbar-title class="text-h6">
                    Edit Recipe
                </v-toolbar-title>
                <template v-slot:append>
                    <v-btn icon="mdi-close" @click="isEditRecipeVisible = false"></v-btn>
                </template>
            </v-toolbar>
            <recipe-form 
                ref="recipeForm" 
                :existing-recipe="this.recipe"
                :on-success="closeForm"></recipe-form>
        </v-card>
    </v-dialog>
</template>

<script>
import RecipeNutritionCard from '../components/RecipeNutritionCard.vue';
import RecipeForm from '../components/RecipeForm.vue';
import { createNamespacedHelpers } from 'vuex';
import Swipe from '../components/Swipe.vue';
const ingredientHelper = createNamespacedHelpers("ingredient");
const recipeHelper = createNamespacedHelpers("recipe");
const authHelper = createNamespacedHelpers("auth");
const shoppingListHelper = createNamespacedHelpers("shoppinglist");

    export default {
        name: "Recipe",

        components: {
            'nutrition-card': RecipeNutritionCard,
            'recipe-form': RecipeForm,
            'swipe': Swipe
        },

        data() {
            return {
                recipe: {},
                recipeIngredients: [],
                nutritions: [],
                isEditRecipeVisible: false,
            }
        },

        created() {
            this.$watch(
                () => this.$route.params,
                    (toParams, previousParams) => {
                        console.log('route', previousParams, toParams);
                    }
            )
        },

        async mounted() {
            window.scrollTo(0, 0);
            if (this.recipes.length == 0) {
                await this.fetchRecipes();
            }
            if (this.ingredients?.length == 0) {
                await this.fetchIngredients();
            }
            if (this.$route.params.id != null) {
                this.recipe = this.recipes.find(x => x.id == this.$route.params.id);
                this.recipeIngredients = this.renderDetailedIngredientList(this.recipe.ingredients, this.recipe.language);
            }
        },

        computed: {
            ...authHelper.mapGetters(["currentMember"]),
            ...recipeHelper.mapGetters(["recipes"]),
            ...shoppingListHelper.mapGetters(["shoppingList"]),
            ...ingredientHelper.mapGetters([
                "ingredients",
                "unitTypeList"
            ]),
        },

        methods: {
            ...recipeHelper.mapActions(["fetchRecipes"]),
            ...ingredientHelper.mapActions(["fetchIngredients"]),
            ...shoppingListHelper.mapActions(["addToShoppingList"]),

            renderFlag(language) {
                if(language == undefined) return;
                const prefix = process.env.NODE_ENV === 'development' ? '/src' : '';
                return `${prefix}/assets/${language}.png`;
            },

            renderDetailedIngredientList(ingredients, language) {
                const listOfIngredients = [];
                for (let i = 0; i < ingredients.length; i++) {
                    const ingredient = this.recipe.ingredients[i];
                    const databaseIngredient = this.ingredients.find(x => x.id == ingredient.id);
                    const name = this.renderIngredientName(ingredient.id, language);
                    listOfIngredients.push({
                        ...ingredient,
                        category: databaseIngredient.category,
                        name
                    });
                }
                return listOfIngredients;
            },

            renderIngredientName(id, language) {
                const ingredient = this.ingredients.find(x => x.id == id);
                if (ingredient != null) {
                    switch (language) {
                        case "da":
                            return ingredient.name.da;

                        case "en":
                            return ingredient.name.en;

                        case "is":
                            return ingredient.name.is;

                        default:
                            break;
                    }
                }
            },

            addToGroceryList() {
                console.log('adding to shopping list', this.recipeIngredients);
                this.addToShoppingList([...this.recipeIngredients]);
            },

            closeForm() {
                this.isEditRecipeVisible = false;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .title {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
    }

    .title-icon {
        width: auto;
        height: 100%;
        max-height: 57px;
        margin: 0 10px 0 0;
    }
    .ingredient-item {
        display: flex;
        // max-width: 500px;
        width: 100%;
        justify-content: flex-start;
        flex-flow: row nowrap;
        border-bottom: 1px solid rgba(0,0,0,0.08);
    }

    @media screen and (max-width: 900px) {
        .title {
            font-size: 32px;

            &-icon {
                max-height: 44px;
            }
        }
    }
</style>