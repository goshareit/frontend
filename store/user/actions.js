import _ from 'lodash'

export default {
  async hydrateState({ dispatch, commit }) {
    const self = await dispatch('readSelfRequest')
      .then((resp) => {
        if (_.isEmpty(resp)) return undefined
        return resp.status === 200 ? resp.data : undefined
      })

    if (self !== undefined) {
      commit('updateIsAuthenticated', true)

      commit('updateUserData', {
        username: self.username,
        email: self.email
      })
    } else {
      await dispatch('revokeSession')
    }
  },

  readSelfRequest() {
    const session = this.$getSession()
    if (_.isEmpty(session)) return {}
    return this.$gsClient().user()
      .readSelf(session.userId, session.sessionToken)
  },

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
      .then((resp) => {
        if (resp.status === 200) {
          return {
            ...resp,
            unwrapped: this.$gsClient().jws().read(resp.data)
          }
        } else {
          return resp
        }
      })
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

  revokeSession({ commit }) {
    this.$killSession()
    commit('updateIsAuthenticated', false)
  },

  userUpdateRequest({ commit }, payload) {
    const session = this.$getSession()
    if (_.isEmpty(session)) return
    return this.$gsClient().user()
      .update(session.userId, session.sessionToken, payload.currentPassword, {
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

  deleteUserRequest({ dispatch }, payload) {
    const session = this.$getSession()
    if (_.isEmpty(session)) return
    return this.$gsClient().user().delete(session.userId, session.sessionToken, payload.currentPassword)
      .then((resp) => {
        if (resp.state) {
          dispatch('revokeSession')
        }

        return resp
      })
  }
}
