export const mutations = {
  setLogin(state, payload) {
    state.login = payload
  },
  setRole(state, payload) {
    state.role = payload
  },
  setAuth(state, payload) {
    state.isAuth = true;
  },
  clearAuth(state) {
    state.isAuth = false;
    state.login = null;
    state.role = null;
  }
};
