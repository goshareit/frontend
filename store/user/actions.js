export default {
  usernameExistsRequest({ dispatch }, payload) {
    return this.$gsClient().user()
      .usernameExists(payload.username)
  },

  signUpRequest({ dispatch }, payload) {
    return this.$gsClient().user()
      .signUp(payload.username, payload.password, payload.confirmation, payload.email)
  }
}
