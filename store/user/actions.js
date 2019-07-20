import _ from 'lodash'

export default {
  usernameExistsRequest({ dispatch }, payload) {
    return this.$gsClient().user()
      .usernameExists(payload.username)
  },

  signUpRequest({ dispatch }, payload) {
    return this.$gsClient().user()
      .signUp(payload.username, payload.password, payload.confirmation, payload.email)
  },

  logInRequest({ dispatch }, payload) {
    return this.$gsClient().session()
      .logIn(payload.username, payload.password)
  },

  unwrapSessionJws({ dispatch }, payload) {
    return this.$gsClient().jws().read(payload.jws)
  },

  signOutRequest({ dispatch }) {
    const session = this.$getSession()
    if (_.isEmpty(session)) return
    return this.$gsClient().session().logOut(session.userId, session.sessionToken)
  },

  revokeSession({ dispatch, commit }) {
    this.$killSession()
    commit('user/updateIsAuthenticated', false)
  },

  readSelfRequest({ dispatch }) {
    const session = this.$getSession()
    if (_.isEmpty(session)) return
    return this.$gsClient().user().readSelf(session.userId, session.sessionToken)
  }
}
