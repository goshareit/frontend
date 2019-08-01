import _ from 'lodash'

export default {
  async hydrateState({ commit, dispatch }) {
    const invites = await dispatch('readInvitesForUserRequest')
    if (invites !== undefined) {
      commit('updateInvites', invites)
    }
  },

  readInvitesForUserRequest() {
    const session = this.$getSession()
    if (_.isEmpty(session)) return

    return this.$gsClient().room().invite()
      .readAllForUser(session.userId, session.sessionToken)
      .then(resp => resp.status === 200 ? resp.data : undefined)
  },

  async createInviteRequest({ commit }, payload) {
    const session = this.$getSession()
    if (_.isEmpty(session)) return

    await this.$gsClient().room().invite()
      .create(session.userId, session.sessionToken, payload.username, payload.roomId)
      .then(resp => resp.status === 200 ? resp.data : undefined)
  },

  async acceptInviteRequest({ commit }, payload) {
    const session = this.$getSession()
    if (_.isEmpty(session)) return

    await this.$gsClient().room().invite()
      .accept(session.userId, session.sessionToken, payload.inviteId)
      .then(resp => resp.status === 200 ? resp.data : undefined)
      .then((data) => {
        if (data) {
          commit('deleteInvite', { id: payload.inviteId })
          commit('room/pushRoomMembership', data, { root: true })
        }
      })
  },

  async deleteInviteRequest({ commit }, payload) {
    const session = this.$getSession()
    if (_.isEmpty(session)) return

    await this.$gsClient().room().invite()
      .delete(session.userId, session.sessionToken, payload.inviteId)
      .then(resp => resp.status === 200 ? resp.data : undefined)
      .then((data) => {
        if (data) {
          commit('deleteInvite', payload.inviteId)
        }
      })
  }
}
