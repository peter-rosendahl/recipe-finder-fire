import { ingredientRef, setRef } from "../services/firebase";
import { get, set } from 'firebase/database';

const state = {
    ingredientList: [],
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
    }
};

const getters = {
    ingredients: (state) => state.ingredientList,
    isLoading: (state) => state.isLoading,
    unitTypeList: (state) => state.unitTypes,
    ingredientCategoryList: (state) => state.categoryList
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};