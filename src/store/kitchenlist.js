const state = {
    list: [],
};

const mutations = {
    ADD(state, item) {
        state.list.push(item);
    },
    UPDATE(state, {index, item}) {
        state.recipeIngredientList.splice(index, 1, item);
    },
    REMOVE(state, index) {
        state.recipeIngredientList.splice(index, 1);
    },
    CLEAR(state) {
        state.list = [];
    }
};

const actions = {

    appendToKitchenList({commit, state}, item) {
        commit("ADD", item);
    },

    updateKitchenItem(store, {originalId, item}) {
        const existingItem = store.state.recipeIngredientList.find(x => x.id == originalId);
        const index = store.state.recipeIngredientList.indexOf(existingItem);
        if (existingItem == null) {
            store.dispatch("appendToKitchenList", item);
            return;
        }
        store.commit(
            "UPDATE", 
            {index, item});
    },

    removeKitchenItem({state, commit}, item) {
        const index = state.recipeIngredientList.indexOf(item);
        if (index != -1) {
            commit("REMOVE", index);
        }
    },

    clearKitchenList({commit}) {
        commit("CLEAR");
    },
};

const getters = {
    kitchenList: (state) => state.list,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};