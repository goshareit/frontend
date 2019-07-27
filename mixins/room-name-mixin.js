export default {
  data() {
    return {
      name: ''
    }
  },
  computed: {
    nameIsValidForm() {
      return /^[a-zA-Z0-9]+$/.test(this.name)
    },
    nameTooShort() {
      return this.name.length < 5
    },
    nameTooLong() {
      return this.name.length > 24
    },
    nameOk() {
      if (this.name.length === 0) return null
      return this.nameIsValidForm && !this.nameTooShort && !this.nameTooLong
    }
  }
}
