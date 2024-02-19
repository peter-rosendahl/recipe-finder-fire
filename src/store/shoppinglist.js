const state = {
    list: [],
};

const mutations = {
    ADD(state, item) {
        state.list.push(item);
    },
    UPDATE(state, item) {
        const index = state.list.map(x => x.id).indexOf(item.id);
        if (index != -1) {
            state.list[index] = item;
        }
    },
    REMOVE(state, id) {
        const i = state.list.map(x => x.id).indexOf(id);
        if (i != -1) {
            state.list.splice(i, 1);
        }
    },
    CLEAR(state) {
        state.list = [];
    }
};

const actions = {
    addToList({commit, state}, list) {
        console.log("store: adding items to shopping list");
        if (Array.isArray(list)) {
            console.log('store: receiving object is array');
            const storedList = [...state.list],
                sortedList = storedList.sort((a,b) => a.id - b.id),
                sortedIdList = sortedList.map(x => x.id),
                appendingList = list.sort((a,b) => a.id - b.id),
                completeList = [];

            console.log('lists of ids', sortedIdList, appendingList.map(x => x.id));
            
            // Iterate and append new items
            for (let i = 0; i < appendingList.length; i++) {
                const item = appendingList[i];
                console.log('current item', item);
                if (completeList.indexOf(item) == -1 && sortedIdList.indexOf(item.id) == -1) {
                    console.log('current item is not in completeList nor in sortedIdList', item.id);
                    completeList.push({
                            ...item,
                            quantities: [
                                {
                                    amount: item.quantity,
                                    unitType: item.unitType
                                }
                            ]
                        });
                    continue;
                } 

                const existingIndex = sortedIdList.indexOf(item.id);
                console.log('existingIndex', existingIndex);
                if (existingIndex != -1) {
                    const existingItem = {...sortedList[existingIndex]};
                    console.log('existing item', existingItem);

                    if (existingItem.quantities != null) {
                        existingItem.quantities.push({
                            amount: item.quantity,
                            unitType: item.unitType
                        });
                    } else {
                        existingItem.quantities = [
                            {
                                amount: existingItem.quantity,
                                unitType: existingItem.unitType
                            },
                            {
                                amount: item.quantity,
                                unitType: item.unitType
                            }
                        ];
                    }
                    console.log('existing item with updated quantity', existingItem);

                    completeList.push(existingItem);
                    continue;
                }
            };

            // Iterate and append existing items that are missing in complete list
            for (let i = 0; i < sortedList.length; i++) {
                const item = sortedList[i];
                if (completeList.map(x => x.id).indexOf(item.id) == -1) {
                    completeList.push(item);
                }
            }

            commit("CLEAR");

            for (let i = 0; i < completeList.length; i++) {
                const item = completeList[i];
                commit("ADD", item);
            };
        } else {
            if (state.list.indexOf(list) == -1) {
                commit("ADD", list);
            } else {
                const existingItem = state.list.find(x => x.id == list.id);
                
                if (existingItem.quantities != null) {
                    existingItem.quantities.push({
                        amount: item.quantity,
                        unitType: item.unitType
                    });
                } else {
                    existingItem.quantities = [
                        {
                            amount: existingItem.quantity,
                            unitType: existingItem.unitType
                        },
                        {
                            amount: item.quantity,
                            unitType: item.unitType
                        }
                    ];
                    console.log('existing item with updated quantity', existingItem);

                    commit("UPDATE", existingItem);
                }
            }
        }
    },

    removeFromList({commit}, list) {
        console.log("store: removing items to shopping list");
        if (Array.isArray(list)) {
            const descList = list.sort((a,b) => b.id - a.id);
            for (let i = descList.length - 1; i >= 0; i--) {
                const item = descList[i];
                commit("REMOVE", item);
            }
        } else {
            commit("REMOVE", list);
        }
    },

    clearList({commit}) {
        commit("CLEAR");
    }
};

const getters = {
    shoppingList: (state) => state.list,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};