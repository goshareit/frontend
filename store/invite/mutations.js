import _ from 'lodash'

export default {
  updateInvites(state, payload) {
    state.invites = payload
  },

  pushInvite(state, payload) {
    state.invites = [
      ...state.invites,
      payload
    ]
  },

  deleteInvite(state, payload) {
    state.invites = _.filter(state.invites, invite => invite.id !== payload.id)
  }
}
