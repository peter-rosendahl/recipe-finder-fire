import { createStore } from 'vuex';
import ingredient from './ingredient';
import recipe from './recipe';
import auth from './auth';
import profile from './profile';

export default createStore({
    state: {},
    getters: {},
    mutations: {},
    actions: {},
    modules: {
        ingredient,
        recipe,
        auth,
        profile
    },
});