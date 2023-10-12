import { signIn, createMember, memberRef, getCurrentMember, logout } from "../services/firebase";

const state = {
    currentMember: null,
    members: [],
    loading: false
};

const mutations = {
    SET_MEMBER_LIST(state, list) {
        state.members = list;
    },
    SET_CURRENT_MEMBER(state, item) {
        state.currentMember = item;
    },
    SET_LOADING(state, isLoading) {
        state.loading = isLoading;
    }
};

const actions = {
    async signIn({ commit }, data) {
        if (data.email == null || data.password == null) return;
        commit("SET_LOADING", true);
        await signIn(data.email, data.password)
            .then(success => {
                console.log("auth.signIn success", success);
            })
            .catch(error => {
                console.log("auth.signIn error", error);
                throw error;
            })
    },

    async isLoggedIn(store) {
        const member = await getCurrentMember();
        if (member == null) {
            console.log("no member is logged in", member);
            return false;
        } else {
            if (store.state.currentMember == null) {
                console.log("member is logged in", member);
                store.commit("SET_CURRENT_MEMBER", member);
                return true;
            }
        }
        return false;
    },

    async signOut(store) {
        await logout()
        .then(success => {
            console.log('logged out? ', success);
            store.commit("SET_CURRENT_MEMBER", null);
        });
    }
}

const getters = {
    memberList: (state) => state.members,
    isAuthLoading: (state) => state.loading,
    currentMember: (state) => state.currentMember
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}