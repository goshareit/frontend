import _ from 'lodash'

export default {
  loadRoomTopicsRequest() {
    return this.$gsClient().room().topic().all()
  },

  loadRoomTopicRequest(payload) {
    return this.$gsClient().room().topic().read(payload.id)
  },

  readRoomRequest({ dispatch }, payload) {
    const session = this.$getSession()
    if (_.isEmpty(session)) return
    return this.$gsClient().room().read(session.userId, session.sessionToken, payload.id)
  },

  readOwnedRoomsRequest() {
    const session = this.$getSession()
    if (_.isEmpty(session)) return
    return this.$gsClient().room().readOwned(session.userId, session.sessionToken)
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
  }
}
