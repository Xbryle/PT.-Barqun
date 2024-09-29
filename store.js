const store = new Vuex.Store({
  state: {
    snackbar: {
      isOpen: false,
      message: '',
    },
    user: {},
  },
  mutations: {
    setSnackbar(state, snackbar) {
      state.snackbar = snackbar;
    },
    setUser(state, user) {
      state.user = user;
    },
  },
});