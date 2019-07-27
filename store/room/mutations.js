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
  }
}
