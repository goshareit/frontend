export default {
  updateIsAuthenticated(state, value) {
    state.isAuthenticated = value
  },

  updateUserData(state, values) {
    state.uniqueId = values.uniqueId
    state.username = values.username
    state.email = values.email
  }
}
