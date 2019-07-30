<template>
  <b-container>
    <b-form @submit.prevent="handleSignUp()">
      <b-form-group
        id="username-input-group"
        label="Desired Username:"
        label-for="username-input"
        description="Choose a username that you love"
      >
        <b-form-input
          id="username-input"
          v-model="username"
          :state="usernameOk"
          required
          placeholder="Enter Username"
          @change="checkUsername()"
        />
        <b-form-invalid-feedback :state="usernameOk">
          <p v-if="!usernameIsValidForm">
            Your username can only contain numbers, lowercase, and uppercase letters.
          </p>
          <p v-else-if="usernameTooShort">
            Your username cannot be shorter than 4 characters.
          </p>
          <p v-else-if="usernameTooLong">
            Your username cannot be longer than 24 characters.
          </p>
          <p v-else-if="issues.usernameExists">
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
          v-model="password"
          :state="passwordOk"
          type="password"
          required
          placeholder="Enter Password"
        />
        <b-form-invalid-feedback :state="passwordOk">
          <p v-if="passwordTooShort">
            Your password must be at least 8 characters long.
          </p>
          <p v-else-if="passwordTooLong">
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
          v-model="email"
          :state="emailOk"
          type="email"
          required
          placeholder="Enter Email"
          @change="checkEmail()"
        />
        <b-form-invalid-feedback :state="emailOk">
          <p v-if="!emailIsValidForm">
            That doesn't look like a real email address.
          </p>
          <p v-else-if="issues.emailExists">
            This email is already associated with another user. Please use a different one.
          </p>
        </b-form-invalid-feedback>
      </b-form-group>

      <b-button type="submit" variant="info">
        Sign Up!
      </b-button>
    </b-form>
  </b-container>
</template>

<script>
import UsernameMixin from '../mixins/username-mixin'
import PasswordWithConfirmationMixin from '../mixins/password-with-confirmation-mixin'
import EmailMixin from '../mixins/email-mixin'

export default {
  mixins: [UsernameMixin, PasswordWithConfirmationMixin, EmailMixin],
  middleware: 'unauthenticated',
  methods: {
    clearIssues() {
      this.issues.usernameExists = false
      this.issues.emailExists = false
    },

    async handleSignUp() {
      if (!this.usernameOk) return
      if (!this.passwordOk) return
      if (!this.passwordConfirmationOk) return
      if (!this.emailOk) return

      this.clearIssues()

      await this.$store.dispatch('user/signUpRequest', {
        username: this.username,
        password: this.password,
        confirmation: this.passwordConfirmation,
        email: this.email
      }).then((resp) => {
        if (resp.status !== 200) return
        this.$router.replace({ path: '/login' })
      })
    }
  }
}
</script>

<style>
</style>
