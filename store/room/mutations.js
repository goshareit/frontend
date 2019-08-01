import _ from 'lodash'

export default {
  setOwnedRooms(state, payload) {
    state.owned = payload
  },

  pushOwnedRoom(state, payload) {
    state.owned = [
      ...state.owned,
      payload
    ]
  },

  updateOwnedRoom(state, payload) {
    const idx = _.findIndex(state.owned, room => room.id === payload.id)
    if (idx !== undefined) {
      state.owned[idx] = payload
    }
  },

  deleteOwnedRoom(state, payload) {
    state.owned = _.filter(state.owned, room => room.id !== payload.id)
  },

  setRoomMemberships(state, payload) {
    state.member = payload
  },

  pushRoomMembership(state, payload) {
    state.member = [
      ...state.member,
      payload
    ]
  },

  updateRoomMembership(state, payload) {
    const idx = _.findIndex(_.map(state.member, ctx => ctx.room), room => room.id === payload.id)
    if (idx !== undefined) {
      state.member[idx] = payload
    }
  },

  deleteRoomMembership(state, payload) {
    state.member = _.filter(state.member, context => context.room.id !== payload.id)
  }
}
