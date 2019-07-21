export default {
  data() {
    return {
      password: ''
    }
  },
  computed: {
    passwordTooShort() {
      return this.password.length < 8
    },
    passwordTooLong() {
      return this.password.length > 71
    },
    passwordOk() {
      if (this.password.length === 0) return null
      return !this.passwordTooShort && !this.passwordTooLong
    }
  }
}
