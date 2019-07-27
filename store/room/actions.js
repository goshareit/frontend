import _ from 'lodash'

export default {
  async hydrateState({ dispatch, commit }) {
    const owned = await dispatch('readOwnedRoomsRequest')
      .then((resp) => {
        if (_.isEmpty(resp)) return undefined
        return resp.status === 200 ? resp.data : undefined
      })

    if (owned !== undefined) {
      commit('setOwnedRooms', owned)
    }

    const member = await dispatch('readRoomMembershipsRequest')
      .then((resp) => {
        if (_.isEmpty(resp)) return undefined
        return resp.status === 200 ? resp.data : undefined
      })

    if (member !== undefined) {
      commit('setRoomMemberships', member)
    }
  },

  readRoomRequest({ dispatch }, payload) {
    const session = this.$getSession()
    if (_.isEmpty(session)) return
    return this.$gsClient().room().read(session.userId, session.sessionToken, payload.id)
  },

  readOwnedRoomsRequest() {
    const session = this.$getSession()
    if (_.isEmpty(session)) return {}
    return this.$gsClient().room().readOwned(session.userId, session.sessionToken)
  },

  readRoomMembershipsRequest() {
    const session = this.$getSession()
    if (_.isEmpty(session)) return {}
    return this.$gsClient().room().readMember(session.userId, session.sessionToken)
  },

  createRoomRequest({ dispatch }, payload) {
    const session = this.$getSession()
    if (_.isEmpty(session)) return
    return this.$gsClient().room().create(
      session.userId,
      session.sessionToken,
      payload.topic,
      payload.name,
      payload.secret
    )
  },

  updateRoomRequest({ dispatch }, payload) {
    const session = this.$getSession()
    if (_.isEmpty(session)) return
    return this.$gsClient().room().update(
      session.userId,
      session.sessionToken,
      payload.id,
      {
        ownerUniqueId: payload.ownerUniqueId,
        topicId: payload.topicId,
        name: payload.name,
        secret: payload.secret
      }
    )
  },

  deleteRoomRequest({ dispatch }, payload) {
    const session = this.$getSession()
    if (_.isEmpty(session)) return
    return this.$gsClient().room().delete(
      session.userId,
      session.sessionToken,
      payload.id
    )
  }
}
