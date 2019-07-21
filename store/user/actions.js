import _ from 'lodash'

export default {
  usernameExistsRequest({ dispatch }, payload) {
    return this.$gsClient().user()
      .usernameExists(payload.username)
  },

  emailExistsRequest({ dispatch }, payload) {
    return this.$gsClient().user()
      .emailExists(payload.email)
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
      .then(async (resp) => {
        if (resp.state) {
          await dispatch('revokeSession')
        }
      })
  },

  checkSession() {
    const session = this.$getSession()
    if (session.userId && session.sessionToken) {
      return this.$gsClient().session()
        .sessionIsValid(session.userId, session.sessionToken)
    }
  },

  async loadSession({ dispatch, commit }) {
    await dispatch('checkSession')
      .then(async (resp) => {
        if (!resp) return
        if (resp.state) {
          commit('updateIsAuthenticated', true)
          await dispatch('readSelfRequest')
        } else {
          dispatch('revokeSession')
        }
      })
  },

  revokeSession({ commit }) {
    this.$killSession()
    commit('updateIsAuthenticated', false)
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
  },

  userUpdateRequest({ commit }, payload) {
    const session = this.$getSession()
    if (_.isEmpty(session)) return
    return this.$gsClient().user()
      .update(session.userId, session.sessionToken, {
        username: payload.username,
        password: payload.password,
        email: payload.email
      })
      .then((resp) => {
        if (resp.status === 200) {
          commit('updateUserData', {
            username: resp.data.username,
            email: resp.data.email
          })
        }

        return resp
      })
  },

  deleteUserRequest({ dispatch }) {
    const session = this.$getSession()
    if (_.isEmpty(session)) return
    return this.$gsClient().user().delete(session.userId, session.sessionToken)
      .then((resp) => {
        if (resp.state) {
          dispatch('revokeSession')
        }
      })
  }
}
