<template>
  <div>
    <div v-if="thereIsAnIssue" class="error">
      <p v-if="issues.userNotFound">
        That username doesn't appear to exist. Are you sure you typed it correctly?
      </p>
      <p v-else-if="issues.invalidPassword">
        You have entered the incorrect password. Please try again.
      </p>
      <p v-else-if="issues.couldNotCreateSession">
        The server could not create a session. Please try again later.
      </p>
    </div>
    <b-form ref="form" @submit.prevent="handleLogIn()">
      <b-form-group
        id="username-input-group"
        label="Username:"
        label-for="username-input"
        description="Enter the username you signed up with"
      >
        <b-form-input
          id="username-input"
          ref="username"
          v-model="username"
          :state="usernameOk"
          required
          placeholder="Enter Username"
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
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group
        id="password-input-group"
        label="Password:"
        label-for="password-input"
        description="Enter your password to sign in"
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
          <p v-if="passwordTooShort">
            Your password must be at least 8 characters long.
          </p>
          <p v-else-if="passwordTooLong">
            Your password cannot be longer than 71 characters.
          </p>
        </b-form-invalid-feedback>
      </b-form-group>

      <b-button type="submit" variant="info">
        Log In!
      </b-button>
    </b-form>
  </div>
</template>

<script>
import UsernameMixin from '../mixins/username-mixin'
import PasswordMixin from '../mixins/password-mixin'

export default {
  mixins: [UsernameMixin, PasswordMixin],
  middleware: 'unauthenticated',
  data() {
    return {
      issues: {
        userNotFound: false,
        invalidPassword: false,
        couldNotCreateSession: false
      }
    }
  },
  computed: {
    thereIsAnIssue() {
      return this.issues.userNotFound || this.issues.invalidPassword || this.issues.couldNotCreateSession
    }
  },
  methods: {
    clearIssues() {
      this.issues.userNotFound = false
      this.issues.invalidPassword = false
      this.issues.couldNotCreateSession = false
    },
    async handleLogIn() {
      if (!this.usernameOk || !this.passwordOk) return

      this.clearIssues()

      await this.$store.dispatch('user/logInRequest', {
        username: this.username,
        password: this.password
      }).then(async (resp) => {
        switch (resp.status) {
          case 404:
            this.issues.userNotFound = true
            return
          case 401:
            this.issues.invalidPassword = true
            return
          case 500:
            this.issues.couldNotCreateSession = true
            return
        }

        const unwrapped = resp.unwrapped
        this.$setSession(unwrapped.sub, unwrapped.token)
        await this.$store.dispatch('user/hydrateState')
        this.$router.replace({ path: '/dashboard' })
      })
    }
  }
}
</script>
