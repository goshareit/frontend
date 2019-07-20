export default ({ app }, inject) => {
  inject('getSession', () => {
    const userId = app.$cookies.get('userId')
    const sessionToken = app.$cookies.get('sessionToken')
    if (!userId || !sessionToken) {
      return {}
    } else {
      return {
        userId: app.$cookies.get('userId'),
        sessionToken: app.$cookies.get('sessionToken')
      }
    }
  })

  inject('killSession', () => {
    app.$cookies.remove('userId')
    app.$cookies.remove('sessionToken')
  })
}
