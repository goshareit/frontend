import _ from 'lodash'

export default {
  ownedRoomCount(state) {
    return state.owned.length
  },

  memberRoomCount(state) {
    return state.member.length
  },

  getRoom(state) {
    return (id) => {
      return _.find(
        _.concat(
          state.owned,
          _.map(
            state.member,
            entry => entry.room
          )
        ),
        room => room.id === id
      )
    }
  }
}
