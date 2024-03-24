import { createStore } from 'vuex';
import ingredient from './ingredient';
import recipe from './recipe';
import auth from './auth';
import profile from './profile';
import shoppinglist from './shoppinglist';
import kitchenlist from './kitchenlist';

export default createStore({
    state: {},
    getters: {},
    mutations: {},
    actions: {},
    modules: {
        ingredient,
        recipe,
        auth,
        profile,
        shoppinglist,
        kitchenlist
    },
});