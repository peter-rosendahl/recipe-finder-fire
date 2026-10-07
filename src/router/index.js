import * as VueRouter from 'vue-router';
import IngredientListView from './../pages/IngredientListView.vue';
import RecipeListView from './../pages/RecipeListView.vue';
import RecipeDetailView from './../pages/RecipeDetailView.vue';
import KitchenView from '../pages/KitchenView.vue';

const routes = [
    {
        path: "/",
        component: RecipeListView,
        name: "Recipes"
    },
    {
        path: "/ingredients",
        component: IngredientListView,
        name: "Ingredients"
    },
    {
        path: "/recipes",
        component: RecipeListView,
        name: "Recipes"
    },
    {
        path: "/recipes/:id",
        component: RecipeDetailView,
        name: "Recipe"
    },
    {
        path: "/kitchen",
        component: KitchenView,
        name: "Kitchen"
    }
]

export const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes
});