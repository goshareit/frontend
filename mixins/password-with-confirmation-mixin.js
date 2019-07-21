import PasswordMixin from './password-mixin'

export default {
  mixins: [PasswordMixin],
  data() {
    return {
      passwordConfirmation: '',
      issues: {
        passwordsDoNotMatch: false
      }
    }
  },
  computed: {
    passwordsMatch() {
      return this.password === this.passwordConfirmation
    },
    passwordConfirmationOk() {
      if (this.passwordConfirmation.length === 0) return null
      return this.passwordsMatch
    }
  }
}
