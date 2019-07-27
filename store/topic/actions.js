export default {
  async hydrateState({ dispatch, commit }) {
    const topics = await dispatch('loadRoomTopicsRequest')
      .then(resp => resp.status === 200 ? resp.data : undefined)

    if (topics !== undefined) {
      commit('setTopics', topics)
    }
  },

  loadRoomTopicsRequest() {
    return this.$gsClient().roomTopic().all()
  }
}
