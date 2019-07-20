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

  async loadSession({ dispatch, commit }) {
    const session = this.$getSession()
    if (session.userId && session.sessionToken) {
      await this.$gsClient().session()
        .sessionIsValid(session.userId, session.sessionToken)
        .then(async (resp) => {
          if (!resp.state) {
            dispatch('revokeSession')
          } else {
            commit('updateIsAuthenticated', true)
            await dispatch('readSelfRequest')
          }
        })
    }
  },

  revokeSession({ commit }) {
    this.$killSession()
    commit('user/updateIsAuthenticated', false)
  },

  async readSelfRequest({ commit }) {
    const session = this.$getSession()
    if (_.isEmpty(session)) return
    await this.$gsClient().user()
      .readSelf(session.userId, session.sessionToken)
      .then((resp) => {
        if (resp.status === 200) {
          commit('updateUserData', {
            username: resp.data.username,
            email: resp.data.email
          })
        }
      })
  }
}
