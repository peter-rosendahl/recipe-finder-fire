import { kitchenRef, setRef, getKitchenById } from "../services/firebase";
import { onValue, get, set, query, orderByChild, equalTo } from 'firebase/database';

const state = {
    list: [],
};

const mutations = {
    SET(state, list) {
        state.list = list;
    },
    ADD(state, item) {
        state.list.push(item);
    },
    UPDATE(state, {index, item}) {
        state.list.splice(index, 1, item);
    },
    REMOVE(state, index) {
        state.list.splice(index, 1);
    },
    CLEAR(state) {
        state.list = [];
    }
};

const actions = {

    appendToKitchenList({commit, state}, item) {
        console.log('kitchenlist append item', item);
        commit("ADD", item);
    },

    updateKitchenItem(store, {originalId, item}) {
        console.log('store.updateKitchenItem state', store.state, originalId, item);
        const existingItem = store.state.list.find(x => x.id == originalId);
        const index = store.state.list.indexOf(existingItem);
        console.log('store.updateKitchenItem: originalId', originalId, item, existingItem, index);
        console.log('item from method', item);
        console.log('existingItem', existingItem);
        console.log('index', index);
        if (existingItem == null) {
            store.dispatch("appendToKitchenList", item);
            return;
        }
        store.commit(
            "UPDATE", 
            {index, item});
    },

    removeKitchenItem({state, commit}, item) {
        console.log("kitchen state remove item", item);
        const index = state.list.indexOf(item);
        if (index != -1) {
            commit("REMOVE", index);
        }
    },

    clearKitchenList({commit}) {
        commit("CLEAR");
    },

    async fetchKitchenListByAuthorId(store, uid) {
        if (store.state.list.length > 0) {
            const list = store.state.list;
            return list;
        } else {
            const dbList = await getKitchenById(uid);
            if (dbList != null) {
                console.log('db List of kitchen items', dbList);
                store.commit("SET", dbList);
                return dbList;
            }
        }
    },

    saveKitchenList({commit}, {uid, data}) {
        console.log('saveKitchenListAsync data', data);
        return set(setRef(`kitchen/${uid}`), data);
    }
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