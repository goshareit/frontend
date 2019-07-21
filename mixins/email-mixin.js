export default {
  data() {
    return {
      email: '',
      issues: {
        emailExists: false
      }
    }
  },
  computed: {
    emailIsValidForm() {
      return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.email)
    },
    emailTooLong() {
      return this.email.length > 120
    },
    emailOk() {
      if (this.email.length === 0) return null
      return this.emailIsValidForm && !this.emailTooLong && !this.issues.emailExists
    }
  },
  methods: {
    clearEmailExists() {
      this.issues.emailExists = false
    },
    checkEmail() {
      this.clearEmailExists()
      if (!this.emailOk) {
        return
      }

      this.$store.dispatch('user/emailExistsRequest', { email: this.email })
        .then(resp => resp.state)
        .then((state) => {
          this.issues.emailExists = state
        })
    }
  }
}
