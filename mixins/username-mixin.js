export default {
  data() {
    return {
      username: '',
      issues: {
        usernameExists: false
      }
    }
  },
  computed: {
    usernameIsValidForm() {
      return /^[a-zA-Z0-9]+$/.test(this.username)
    },
    usernameTooShort() {
      return this.username.length < 4
    },
    usernameTooLong() {
      return this.username.length > 24
    },
    usernameOk() {
      if (this.username.length === 0) return null
      return this.usernameIsValidForm && !this.usernameTooShort && !this.usernameTooLong && !this.issues.usernameExists
    }
  },
  methods: {
    clearUsernameExists() {
      this.usernameExists = false
    },
    checkUsername() {
      this.clearUsernameExists()
      if (!this.usernameOk) {
        return
      }

      this.$store.dispatch('user/usernameExistsRequest', { username: this.username })
        .then(resp => resp.state)
        .then((state) => {
          this.issues.usernameExists = state
        })
    }
  }
}
