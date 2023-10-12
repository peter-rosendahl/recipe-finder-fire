import { recipeRef, setRef } from "../services/firebase";
import { get, set } from 'firebase/database';

const state = {
    recipeList: [],
    isLoading: false,
    categoryList: [
        'appetizer',
        'baked goods',
        'breakfast',
        'brunch',
        'dessert',
        'drinks',
        'lunch',
        'main dish',
        'salad',
        'side dish',
        'snacks',
        'soups and stews',
    ],
    cultureList: [
        'american',
        'australian',
        'belgian',
        'chinese',
        'egyptian',
        'english',
        'fijian',
        'french',
        'german',
        'greek',
        'indian',
        'italian',
        'jamaican',
        'japanese',
        'korean',
        'lebanese',
        'mediterranean',
        'mexican',
        'moroccan',
        'nordic',
        'russian',
        'singaporean',
        'spanish',
        'thai',
        'turkish',
        'ukranian',
        'vietnamese'
    ]
}


const mutations = {
    SET_RECIPES(state, list) {
        state.recipeList = list;
    },
    SET_RECIPE(state, item) {
        console.log('SET_RECIPE', Object.keys(state.recipeList), Object.keys(item), Object.values(item));
        let existingItem = state.recipeList.find(x => x.id == item.id);
        console.log('existing item', existingItem);
        if (existingItem != null) {
            existingItem = item;
        } else {
            state.recipeList.push(item);
        }
    },
    SET_LOADING(state, isLoading) {
        state.isLoading = isLoading;
    }
}

const actions = {
    async fetchRecipes({ commit }) {
        commit('SET_LOADING', true);
        if (state.recipeList.length == 0) {
            await get(recipeRef).then((snapshot) => {
                let list = [];
                snapshot.forEach(childsnap => {
                    let value = childsnap.val();
                    list.push(value);
                });
                if (list.length > 0) {
                    commit('SET_RECIPES', list);
                    commit('SET_LOADING', false);
                }
            })
        } else {
            commit('SET_LOADING', false);
        }
    },
    updateRecipeAsync({commit}, data) {
        console.log('updateRecipeAsync data', data);
        if (data.id == 0) {
            data.id = state.recipeList.length + 100001;
            console.log(data.id);
        }
        commit("SET_RECIPE", data);
        return set(setRef(`recipes/${data.id}`), data);
    }
};

const getters = {
    recipes: (state) => state.recipeList,
    isLoading: (state) => state.isLoading,
    recipeCategoryList: (state) => state.categoryList,
    recipeCultureList: (state) => state.cultureList
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};