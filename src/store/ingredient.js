import { ingredientRef, setRef } from "../services/firebase";
import { get, set } from 'firebase/database';

const state = {
    ingredientList: [],
    recipeIngredientList: [],
    isLoading: false,
    categoryList: [
        "Alcoholic Beverages",
        "Baking supplements",
        "Berries",
        "Beverages",
        "Breads",
        "Canned Food",
        "Cereals",
        "Cheeses",
        "Chocolates",
        "Condiments",
        "Dairy",
        "Dairy-free",
        "Dressings & Vinegars",
        "Fish",
        "Flour",
        "Fruits",
        "Grains",
        "Herbs",
        "Meat substitutes",
        "Meats",
        "Mushrooms",
        "Nuts",
        "Oils & Fats",
        "Pastas",
        "Potatoes",
        "Poultry",
        "Seafood",
        "Spices",
        "Stocks",
        "Sweeteners",
        "Vegetables",
    ],
    unitTypes: [
        "g",
        "ml.",
        "cl.",
        "dl.",
        "tsp.",
        "tbsp.",
        "pcs."
    ]
}

const mutations = {
    SET_INGREDIENTS(state, list) {
        state.ingredientList = list;
    },
    SET_INGREDIENT(state, item) {
        console.log('SET_INGREDIENT', Object.keys(state.ingredientList), Object.keys(item), Object.values(item));
        let existingItem = state.ingredientList.find(x => x.id == item.id);
        console.log('existing item', existingItem);
        if (existingItem != null) {
            existingItem = item;
        } else {
            state.ingredientList.push(item);
        }
    },
    SET_LOADING(state, isLoading) {
        state.isLoading = isLoading;
    },

    SET_RECIPE_INGREDIENTS(state, data) {
        state.recipeIngredientList = data;
    },

    ADD_RECIPE_INGREDIENT(state, item) {
        state.recipeIngredientList.push(item);
    },

    UPDATE_RECIPE_INGREDIENT(state, {index, item}) {
        console.log(`updating recipe ingredient list by index ${index}`, item)
        state.recipeIngredientList.splice(index, 1, item);
    },

    REMOVE_RECIPE_INGREDIENT_INDEX(state, index) {
        state.recipeIngredientList.splice(index, 1);
    },

    CLEAR_RECIPE_INGREDIENT(state) {
        state.recipeIngredientList = [];
    }
}

const actions = {
    
    async fetchIngredients({ commit }) {
        commit('SET_LOADING', true);
        if (state.ingredientList.length == 0) {
            await get(ingredientRef).then((snapshot) => {
                let list = [];
                snapshot.forEach(childsnap => {
                    let value = childsnap.val();
                    list.push(value);
                });
                if (list.length > 0) {
                    commit('SET_INGREDIENTS', list);
                    commit('SET_LOADING', false);
                }
            })
        } else {
            commit('SET_LOADING', false);
        }
    },
    
    updateIngredientAsync({commit}, data) {
        console.log('updateIngredientAsync data', data);
        if (data.id == 0) {
            data.id = state.ingredientList.length + 100001;
            console.log(data.id);
        }
        commit("SET_INGREDIENT", data);
        return set(setRef(`ingredients/${data.id}`), data);
    },

    setRecipeIngredientList({commit}, data) {
        commit("SET_RECIPE_INGREDIENTS", data);
    },

    appendToRecipeIngredientList({commit, state}, item) {
        commit("ADD_RECIPE_INGREDIENT", item);
        console.log('appending to recipe ingredient list', item, state.recipeIngredientList);
    },

    updateRecipeIngredient(store, {originalId, item}) {
        const existingItem = store.state.recipeIngredientList.find(x => x.id == originalId);
        const index = store.state.recipeIngredientList.indexOf(existingItem);
        console.log('updateRecipeIngredient existingItem', existingItem, item);
        if (existingItem == null) {
            store.dispatch("appendToRecipeIngredientList", item);
            return;
        }
        store.commit(
            "UPDATE_RECIPE_INGREDIENT", 
            {index, item});
    },

    removeRecipeIngredient({state, commit}, item) {
        const index = state.recipeIngredientList.indexOf(item);
        if (index != -1) {
            commit("REMOVE_RECIPE_INGREDIENT_INDEX", index);
        }
    },

    clearRecipeIngredientList({commit}) {
        commit("CLEAR_RECIPE_INGREDIENT");
    },
};

const getters = {
    ingredients: (state) => state.ingredientList,
    isLoading: (state) => state.isLoading,
    unitTypeList: (state) => state.unitTypes,
    ingredientCategoryList: (state) => state.categoryList,
    recipeIngredientList: (state) => state.recipeIngredientList,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};