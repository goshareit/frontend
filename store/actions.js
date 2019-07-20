export default {
  async nuxtServerInit({ dispatch, commit }, ctx) {
    const userId = ctx.app.$cookies.get('userId')
    const sessionToken = ctx.app.$cookies.get('sessionToken')

    if (userId && sessionToken) {
      await ctx.app.$gsClient().session().sessionIsValid(userId, sessionToken)
        .then((resp) => {
          if (!resp.state) {
            dispatch('user/revokeSession')
          } else {
            commit('user/updateIsAuthenticated', true)
          }
        })
    }
  }
}
