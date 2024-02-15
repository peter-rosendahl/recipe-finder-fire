const state = {
    recipeCount: 0
}

const mutations = {
    SET_RECIPE_COUNT(state, count) {
        state.recipeCount = count;
    },
}

const actions = {
    async setRecipeCount({ commit }, count) {
        commit('SET_RECIPE_COUNT', count);
    },
};

const getters = {
    recipeCount: (state) => state.recipeCount
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};