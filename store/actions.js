export default {
  async nuxtServerInit({ dispatch }) {
    await dispatch('user/hydrateState')
    await dispatch('room/hydrateState')
    await dispatch('invite/hydrateState')
    await dispatch('topic/hydrateState')
  }
}
