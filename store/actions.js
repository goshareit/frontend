export default {
  async nuxtServerInit({ dispatch }) {
    await dispatch('user/loadSession')
  }
}
