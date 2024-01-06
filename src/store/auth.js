import { signIn, createMember, memberRef, sendResetPasswordRequest, getCurrentMember, logout } from "../services/firebase";

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
    async create({ commit }, data) {
        console.log('store.create', data);
        if (data.email == null || data.password == null || data.name == null) return;
        commit("SET_LOADING", true);
        var memberCreated = await createMember(data.email, data.password, data.name);
        console.log('store.create result', memberCreated);
        commit("SET_LOADING", false);
    },

    setMember({commit}, data) {
        commit('SET_CURRENT_MEMBER', data);
    },

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

    async requestPasswordReset({commit}, data) {
        console.log('store', data);
        commit("SET_LOADING", true);
        await sendResetPasswordRequest(data.email)
            .then(result => {
                console.log(result);
                return result;
            })
            .catch(error => {
                console.log(error);
                throw error;
            })
            .finally(() => {
                commit("SET_LOADING", false);
            })
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