import router from '@/router'

export const actions = {
  setLogin({commit}, payload) {
    commit('setLogin', payload);
  },

  setRole({commit}, payload) {
    commit('setRole', payload);
  },

  userSignOut({commit}) {
    commit('clearAuth');
    router.push('/login')
  }
};
