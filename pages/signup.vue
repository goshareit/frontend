<template>
  <div>
    <b-form @submit.prevent="handleSignUp()">
      <b-form-group
        id="username-input-group"
        label="Desired Username:"
        label-for="username-input"
        description="Choose a username that you love"
      >
        <b-form-input
          id="username-input"
          ref="username"
          v-model="username"
          :state="usernameOk"
          required
          placeholder="Enter Username"
          @change="checkUsername()"
        />
        <b-form-invalid-feedback :state="usernameOk">
          <p v-if="usernameTooShort">
            Your username cannot be shorter than 4 characters.
          </p>
          <p v-else-if="usernameTooLong">
            Your username cannot be longer than 24 characters.
          </p>
          <p v-else-if="usernameClash">
            This username already exists. Please try a different one.
          </p>
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group
        id="password-input-group"
        label="Choose a Password:"
        label-for="password-input"
        description="Use a strong password, and never one you've used elsewhere"
      >
        <b-form-input
          id="password-input"
          ref="password"
          v-model="password"
          :state="passwordOk"
          type="password"
          required
          placeholder="Enter Password"
        />
        <b-form-invalid-feedback :state="passwordOk">
          <p v-if="passwordTooLong">
            Your password cannot be longer than 71 characters.
          </p>
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group
        id="password-confirm-input-group"
        label="Confirm Password"
        label-for="password-confirm-input"
        description="Type your password again, just to prove you remember it"
      >
        <b-form-input
          id="password-confirm-input"
          ref="passwordConfirmation"
          v-model="passwordConfirmation"
          :state="passwordConfirmationOk"
          type="password"
          required
          placeholder="Enter Password Confirmation"
        />
        <b-form-invalid-feedback :state="passwordConfirmationOk">
          <p v-if="!passwordsMatch">
            Your password confirmation does not match the password you entered.
          </p>
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group
        id="email-input-group"
        label="Email Address:"
        label-for="email-input"
        description="Your email will never been shared under any circumstance, and is only used for notifications"
      >
        <b-form-input
          id="email-input"
          ref="email"
          v-model="email"
          :state="emailOk"
          type="email"
          required
          placeholder="Enter Email"
          @change="resetEmailClash()"
        />
        <b-form-invalid-feedback :state="emailOk">
          <p v-if="!emailIsValidForm">
            That doesn't look like a real email address.
          </p>
          <p v-else-if="emailClash">
            This email is already associated with another user. Please use a different one.
          </p>
        </b-form-invalid-feedback>
      </b-form-group>

      <b-button type="submit" variant="info">
        Sign Up!
      </b-button>
    </b-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      usernameClash: false,
      password: '',
      passwordConfirmation: '',
      email: '',
      emailClash: false
    }
  },
  computed: {
    usernameTooShort() {
      return this.username.length < 4
    },
    usernameTooLong() {
      return this.username.length > 24
    },
    usernameOk() {
      if (this.username.length === 0) return null
      return !this.usernameTooShort && !this.usernameTooLong && !this.usernameClash
    },
    passwordsMatch() {
      return this.password === this.passwordConfirmation
    },
    passwordTooLong() {
      return this.password.length > 71
    },
    passwordOk() {
      if (this.password.length === 0) return null
      return !this.passwordTooLong
    },
    passwordConfirmationOk() {
      if (this.passwordConfirmation.length === 0) return null
      return this.passwordsMatch
    },
    emailIsValidForm() {
      return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.email)
    },
    emailTooLong() {
      return this.email.length > 120
    },
    emailOk() {
      if (this.email.length === 0) return null
      return this.emailIsValidForm && !this.emailTooLong && !this.emailClash
    }
  },
  methods: {
    checkUsername() {
      if (!this.usernameOk) {
        return
      }

      this.$store.dispatch('user/usernameExistsRequest', { username: this.username })
        .then(resp => resp.state)
        .then((state) => {
          this.usernameClash = state
        })
    },

    resetEmailClash() {
      this.emailClash = false
    },

    handleSignUp() {
      if (!this.usernameOk) return
      if (!this.passwordOk) return
      if (!this.passwordConfirmationOk) return
      if (!this.emailOk) return

      this.$store.dispatch('user/signUpRequest', {
        username: this.username,
        password: this.password,
        confirmation: this.passwordConfirmation,
        email: this.email
      }).then((resp) => {
        if (resp.status === 409) {
          this.emailClash = true
          return
        }

        this.$router.replace({ path: '/' })
      })
    }
  }
}
</script>

<style>
</style>
