import * as VueRouter from 'vue-router';
import IngredientListView from './../pages/IngredientListView.vue';
import RecipeListView from './../pages/RecipeListView.vue';
import RecipeDetailView from './../pages/RecipeDetailView.vue';

const routes = [
    {
        path: "/ingredients",
        component: IngredientListView
    },
    {
        path: "/recipes",
        component: RecipeListView
    },
    {
        path: "/recipes/:id",
        component: RecipeDetailView
    }
]

export const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes
});