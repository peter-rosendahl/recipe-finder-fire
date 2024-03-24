import { signIn, createMember, memberRef, extractCurrentMemberData, sendResetPasswordRequest, getCurrentMember, getMemberById, logout } from "../services/firebase";

const state = {
    currentMember: null,
    members: [],
    loading: false,
    isMenuOpen: false
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
    },
    SET_MENU_OPEN(state, isOpen) {
        console.log('SET_MENU_OPEN', isOpen);
        state.isMenuOpen = isOpen;
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

    async signIn(store, data) {
        if (data.email == null || data.password == null) return;
        store.commit("SET_LOADING", true);
        await signIn(data.email, data.password)
            .then(async credentials => {
                console.log("auth.signIn success", credentials);
                const memberMeta = extractCurrentMemberData(credentials.user);
                const member = await store.dispatch('fetchMemberById', credentials.user.uid);
                if (member != null) {
                    store.dispatch('setMember', {
                        ...member,
                        ...memberMeta
                    })
                }
            })
            .catch(error => {
                console.log("auth.signIn error", error);
                throw error;
            })
    },

    async isLoggedIn(store) {
        if (store.state.currentMember == null) {
            const member = await getCurrentMember();
            if (member == null) {
                console.log("no member is logged in", member);
                return false;
            } else {
                store.dispatch('setMember', member);
                return true;
            }
        } else {
            return true;
        }
    },

    async fetchMemberById(store, uid) {
        console.log('fetchMemberById', uid);
        return await getMemberById(uid);
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

    /** Toggles the Account menu.\
     * @param isOpen Boolean value.
    */
    toggleAccountMenu({commit, state}, isOpen) {
        console.log('toggleAccountMenu triggered', isOpen);
        commit("SET_MENU_OPEN", isOpen ?? !state.isMenuOpen);
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
    currentMember: (state) => state.currentMember,
    isAccountMenuOpen: (state) => state.isMenuOpen
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}