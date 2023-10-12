<template>
    <v-row>
        <v-col>
            <h1 class="title text-driftwood">
                <img class="title-icon" :src="renderFlag(recipe.language)" alt="">
                {{ recipe != null ? `${recipe.recipeName}` : '' }}
                <v-spacer></v-spacer>
                <v-btn fab icon color="driftwood" @click="isEditRecipeVisible = true">
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
            </h1>
            <b class="text-driftwood">{{ recipe.authorName }}</b>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="12" sm="2" style="display: flex;">
            <v-icon>mdi-timer-outline</v-icon> &nbsp;
            <p>{{ recipe.preparationMinutes }} minutes</p>
        </v-col>
        <v-col cols="12" sm="2" style="display: flex">
            <v-icon>mdi-account</v-icon>  &nbsp;
            <p>{{ recipe.personCount }} person(s)</p>
        </v-col>
        <v-col cols="12" sm="2" style="display: flex">
            <p>{{ recipe.culture }} {{ recipe.category }}</p>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="12" sm="4">
            <v-card>
                <v-card-title>Ingredients</v-card-title>
                <v-card-text>
                    <template v-for="ingredient in recipe.ingredients">
                        <div class="ingredient-item">
                            <span>{{ ingredient.quantity }}</span> &nbsp;
                            <span style="flex-grow: 1">{{ this.ingredients.find(x => x.id == ingredient.id)?.unitType }}</span>
                            <span>{{ renderIngredientName(ingredient.id, recipe.language) }}</span>
                        </div>
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
                    <!-- <p>{{ this.recipe.preparation }}</p> -->
                    <template v-for="sentence in this.recipe.preparation.split('.')">
                        <p style="font-size: 18px; line-height: 24px;" v-if="sentence.length > 0">{{ sentence }}.</p>
                        <br v-if="sentence.length > 0">
                    </template>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>

    <v-dialog 
        v-model="isEditRecipeVisible">
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
const ingredientHelper = createNamespacedHelpers("ingredient");
const recipeHelper = createNamespacedHelpers("recipe");

    export default {
        name: "Recipe",

        components: {
            'nutrition-card': RecipeNutritionCard,
            'recipe-form': RecipeForm
        },

        data() {
            return {
                recipe: {},
                nutritions: [],
                isEditRecipeVisible: false,
            }
        },

        async created() {
            if (this.recipes.length == 0) {
                await this.fetchRecipes();
                await this.fetchIngredients();
            }
            if (this.$route.params.id != null) {
                this.recipe = this.recipes.find(x => x.id == this.$route.params.id);
            }

            this.$watch(
                () => this.$route.params,
                    (toParams, previousParams) => {
                        console.log('route', previousParams, toParams);
                    }
            )
        },

        computed: {
            ...recipeHelper.mapGetters(["recipes"]),
            ...ingredientHelper.mapGetters([
                "ingredients",
                "unitTypeList"
            ]),
        },

        methods: {
            ...recipeHelper.mapActions(["fetchRecipes"]),
            ...ingredientHelper.mapActions(["fetchIngredients"]),

            renderFlag(language) {
                switch (language) {
                    case "da":
                        return "../src/assets/denmark.png";
                    
                    case "en":
                        return "../src/assets/united-kingdom.png";

                    case "is":
                        return "../src/assets/iceland.png";
                }
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
        max-width: 500px;
        width: 100%;
        justify-content: flex-start;
        flex-flow: row nowrap;
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