export default {
  data() {
    return {
      currentPassword: '',
      issues: {
        invalidCurrentPassword: false
      }
    }
  },
  computed: {
    currentPasswordTooShort() {
      return this.currentPassword.length < 8
    },
    currentPasswordTooLong() {
      return this.currentPassword.length > 71
    },
    currentPasswordOk() {
      if (this.currentPassword.length === 0) return null
      return !this.currentPasswordTooShort && !this.currentPasswordTooLong && !this.issues.invalidCurrentPassword
    }
  },
  methods: {
    clearInvalidCurrentPasswordData() {
      this.issues.invalidCurrentPassword = false
    }
  }
}
