<template>
  <div>
    <div v-if="thereIsAnIssue" class="error">
      <p v-if="userNotFound" class="error">
        A user with those credentials was not found. Please try again.
      </p>
      <p v-else-if="invalidPassword" class="error">
        You have entered the incorrect password. Please try again.
      </p>
      <p v-else-if="couldNotCreateSession" class="error">
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
export default {
  data() {
    return {
      username: '',
      password: '',
      userNotFound: false,
      invalidPassword: false,
      couldNotCreateSession: false
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
    passwordTooShort() {
      return this.password.length < 8
    },
    passwordTooLong() {
      return this.password.length > 71
    },
    passwordOk() {
      if (this.password.length === 0) return null
      return !this.passwordTooShort && !this.passwordTooLong
    },
    thereIsAnIssue() {
      return this.userNotFound || this.invalidPassword || this.couldNotCreateSession
    }
  },
  methods: {
    clearIssues() {
      this.userNotFound = false
      this.invalidPassword = false
      this.couldNotCreateSession = false
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
            this.userNotFound = true
            return
          case 401:
            this.invalidPassword = true
            return
          case 500:
            this.couldNotCreateSession = true
            return
        }

        await this.$store.dispatch('user/unwrapSessionJws', {
          jws: resp.data
        }).then((unwrapped) => {
          this.$cookies.set('userId', unwrapped.sub)
          this.$cookies.set('sessionToken', unwrapped.token)
          location.replace('/')
        })
      })
    }
  }
}
</script>
