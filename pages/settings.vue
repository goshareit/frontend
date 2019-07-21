<template>
  <div>
    <b-card no-body>
      <b-tabs pills card vertical @input="clearEverything">
        <b-tab title="User Information" active>
          <b-card-text>
            <div v-if="success" class="success">
              <p>Your data has been updated.</p>
            </div>
            <div v-else-if="issues.invalidCurrentPassword">
              <p>Your current password is incorrect. Please correct it.</p>
            </div>
            <h2>Change your User Information</h2>
            <b-form @submit.prevent="changeUserInformation()">
              <b-form-group
                id="username-input-group"
                label="New Username:"
                label-for="username-input"
                :description="'Your current username is ' + currentUsername"
              >
                <b-form-input
                  id="username-input"
                  ref="username"
                  v-model="username"
                  :state="newUsernameOk"
                  placeholder="Enter a Username"
                  @change="checkUsername()"
                />
                <b-form-invalid-feedback :state="newUsernameOk">
                  <p v-if="!usernameIsValidForm">
                    Your new username can only contain numbers, lowercase, and uppercase letters.
                  </p>
                  <p v-else-if="usernameTooShort">
                    Your new username cannot be shorter than 4 characters.
                  </p>
                  <p v-else-if="usernameTooLong">
                    Your new username cannot be longer than 24 characters.
                  </p>
                  <p v-else-if="newUsernameIsSameAsOld">
                    That is your current username. Please enter a new username, or leave this field blank.
                  </p>
                  <p v-else-if="issues.usernameExists">
                    This username already exists. Please try a different one.
                  </p>
                </b-form-invalid-feedback>
              </b-form-group>
              <b-form-group
                id="email-input-group"
                label="Email Address:"
                label-for="email-input"
                :description="'Your current email is ' + currentEmail"
              >
                <b-form-input
                  id="email-input"
                  v-model="email"
                  :state="newEmailOk"
                  type="email"
                  placeholder="Enter Email"
                  @change="checkEmail()"
                />
                <b-form-invalid-feedback :state="newEmailOk">
                  <p v-if="!emailIsValidForm">
                    That doesn't look like a real email address.
                  </p>
                  <p v-else-if="newEmailIsSameAsOld">
                    That is your current email. Please enter a new email, or leave this field blank.
                  </p>
                  <p v-else-if="issues.emailExists">
                    This email is already associated with another user. Please use a different one.
                  </p>
                </b-form-invalid-feedback>
              </b-form-group>
              <hr>
              <b-form-group
                id="current-password-input-group-update-form"
                label="Current Password:"
                label-for="current-password-input-update-form"
                description="Type your current password, so we know it's really you"
              >
                <b-form-input
                  id="current-password-input-update-form"
                  v-model="currentPassword"
                  :state="currentPasswordOk"
                  type="password"
                  required
                  placeholder="Enter Password"
                  @change="clearInvalidCurrentPasswordData"
                />
                <b-form-invalid-feedback :state="currentPasswordOk">
                  <p v-if="currentPasswordTooShort">
                    Your password must be at least 8 characters long.
                  </p>
                  <p v-else-if="currentPasswordTooLong">
                    Your password cannot be longer than 71 characters.
                  </p>
                </b-form-invalid-feedback>
              </b-form-group>
              <hr>
              <b-button type="submit" variant="info" block>
                Update Information
              </b-button>
            </b-form>
          </b-card-text>
        </b-tab>
        <b-tab title="Change Password">
          <b-card-text>
            <div v-if="issues.invalidCurrentPassword">
              <p>Your current password is incorrect. Please correct it.</p>
            </div>
            <h2>Change your Password</h2>
            <b-form @submit.prevent="changePassword()">
              <b-form-group
                id="password-input-group"
                label="Choose new Password:"
                label-for="password-input"
                description="Type the new password you'd like to use"
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
                label="Confirm new Password"
                label-for="password-confirm-input"
                description="Type that password again, just to prove you remember it"
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
              <hr>
              <b-form-group
                id="current-password-input-group-change-password-form"
                label="Current Password:"
                label-for="current-password-input-change-password-form"
                description="Type your current password, so we know it's really you"
              >
                <b-form-input
                  id="current-password-input-change-password-form"
                  v-model="currentPassword"
                  :state="currentPasswordOk"
                  type="password"
                  required
                  placeholder="Enter Password"
                  @change="clearInvalidCurrentPasswordData"
                />
                <b-form-invalid-feedback :state="currentPasswordOk">
                  <p v-if="currentPasswordTooShort">
                    Your password must be at least 8 characters long.
                  </p>
                  <p v-else-if="currentPasswordTooLong">
                    Your password cannot be longer than 71 characters.
                  </p>
                </b-form-invalid-feedback>
              </b-form-group>
              <hr>
              <p><strong>Note:</strong> You will be logged out after changing your password, at which point you may log back in with your new password.</p>
              <b-button type="submit" block variant="info">
                Change Password
              </b-button>
            </b-form>
          </b-card-text>
        </b-tab>
        <b-tab title="Delete Account">
          <b-card-text>
            <h2>Delete your Account</h2>
            <p class="warning">
              <strong>Warning:</strong> By clicking the button below, you are permanently and immediately erasing your account. This includes any rooms you have created and/or are a member of. Please be sure this is what you want to do.
            </p>
            <b-button v-b-modal.confirm-account-deletion block variant="danger" href="#">
              Delete
            </b-button>
          </b-card-text>
        </b-tab>
      </b-tabs>
    </b-card>

    <b-modal id="confirm-account-deletion" title="Really delete your account?" variant="danger" @ok.prevent="deleteAccount()">
      <div v-if="issues.invalidCurrentPassword">
        <p>Your current password is incorrect. Please correct it.</p>
      </div>
      <p>Just remember, by clicking <strong>OK</strong>, you are permanently erasing your data on GoShare. You will have to make a new account if you ever want to come back.</p>
      <b-form @submit.stop.prevent>
        <b-form-group
          id="current-password-input-group-update-form"
          label="Current Password:"
          label-for="current-password-input-update-form"
          description="Type your current password, so we know it's really you"
        >
          <b-form-input
            id="current-password-input-update-form"
            v-model="currentPassword"
            :state="currentPasswordOk"
            type="password"
            required
            placeholder="Enter Password"
            @change="clearInvalidCurrentPasswordData"
          />
          <b-form-invalid-feedback :state="currentPasswordOk">
            <p v-if="currentPasswordTooShort">
              Your password must be at least 8 characters long.
            </p>
            <p v-else-if="currentPasswordTooLong">
              Your password cannot be longer than 71 characters.
            </p>
          </b-form-invalid-feedback>
        </b-form-group>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import UsernameMixin from '../mixins/username-mixin'
import PasswordWithConfirmationMixin from '../mixins/password-with-confirmation-mixin'
import CurrentPasswordMixin from '../mixins/current-password-mixin'
import EmailMixin from '../mixins/email-mixin'

export default {
  mixins: [UsernameMixin, PasswordWithConfirmationMixin, CurrentPasswordMixin, EmailMixin],
  middleware: 'authenticated',
  data() {
    return {
      success: false
    }
  },
  computed: {
    newUsernameIsSameAsOld() {
      return this.username === this.currentUsername
    },
    newUsernameOk() {
      return this.usernameOk && !this.newUsernameIsSameAsOld
    },
    newEmailIsSameAsOld() {
      return this.email === this.currentEmail
    },
    newEmailOk() {
      return this.emailOk && !this.newEmailIsSameAsOld
    },
    ...mapState({
      currentUsername: state => state.user.username,
      currentEmail: state => state.user.email
    })
  },
  methods: {
    clearEverything() {
      this.clearLocalState()
      this.resetInputs()
    },

    clearSuccessData() {
      this.success = false
    },

    clearLocalState() {
      this.clearSuccessData()
      this.clearInvalidCurrentPasswordData()
    },

    resetInputs() {
      this.username = ''
      this.email = ''
      this.password = ''
      this.passwordConfirmation = ''
      this.currentPassword = ''
    },

    async changeUserInformation() {
      if (!this.newUsernameOk && !this.newEmailOk && !this.currentPasswordOk) return

      await this.$store.dispatch('user/userUpdateRequest', {
        currentPassword: this.currentPassword,
        username: this.username,
        email: this.email
      }).then((resp) => {
        if (resp.status === 200) {
          this.success = true
          this.resetInputs()
        } else if (resp.status === 401) {
          this.issues.invalidCurrentPassword = true
        }
      })
    },

    async changePassword() {
      if (!this.passwordOk && !this.passwordConfirmationOk && !this.currentPasswordOk) return

      await this.$store.dispatch('user/userUpdateRequest', {
        currentPassword: this.currentPassword,
        password: this.password
      }).then(async (resp) => {
        if (resp.status === 200) {
          await this.$store.dispatch('user/signOutRequest')
            .then(() => {
              this.resetInputs()
              this.$router.replace({ path: '/login' })
            })
        } else if (resp.status === 401) {
          this.issues.invalidCurrentPassword = true
        }
      })
    },

    async deleteAccount() {
      if (!this.currentPasswordOk) return

      await this.$store.dispatch('user/deleteUserRequest', {
        currentPassword: this.currentPassword
      }).then((resp) => {
        if (resp.status === 200) {
          this.$bvModal.hide('confirm-account-deletion')
          this.resetInputs()
          this.$router.replace({ path: '/' })
        } else if (resp.status === 401) {
          this.issues.invalidCurrentPassword = true
        }
      })
    }
  }
}
</script>
