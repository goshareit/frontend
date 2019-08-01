export default {
  data() {
    return {
      username: '',
      issues: {
        usernameExists: null
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
      return this.usernameIsValidForm && !this.usernameTooShort && !this.usernameTooLong
    },
    usernameOkAndDoesNotExist() {
      if (this.issues.usernameExists === null) return null
      return this.usernameOk && !this.issues.usernameExists
    },
    usernameOkAndDoesExist() {
      if (this.issues.usernameExists === null) return null
      return this.usernameOk && this.issues.usernameExists
    }
  },
  methods: {
    clearUsernameExists() {
      this.issues.usernameExists = null
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
