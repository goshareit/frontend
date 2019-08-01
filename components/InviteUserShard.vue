<template>
  <div class="invite-shard">
    <b-button variant="primary" @click="$bvModal.show('invite-room-' + room.id)">
      Invite User
    </b-button>
    <b-modal :id="'invite-room-' + room.id" title="Invite a user" @ok="inviteUser()">
      <b-form @submit.stop.prevent>
        <b-form-group
          id="username-input-group"
          label="Username:"
          label-for="username-input"
          :description="'Enter who you\'d like to invite to ' + room.name"
        >
          <b-form-input
            id="username-input"
            ref="username"
            v-model="username"
            :state="usernameOkAndDoesExist"
            required
            placeholder="Enter Username"
            @change="checkUsername()"
          />
          <b-form-invalid-feedback :state="usernameOkAndDoesExist">
            <p v-if="!usernameIsValidForm">
              The username can only contain numbers, lowercase, and uppercase letters.
            </p>
            <p v-else-if="usernameTooShort">
              The username cannot be shorter than 4 characters.
            </p>
            <p v-else-if="usernameTooLong">
              The username cannot be longer than 24 characters.
            </p>
            <p v-else-if="!issues.usernameExists">
              It looks like no one has registered with that username.
            </p>
          </b-form-invalid-feedback>
        </b-form-group>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import UsernameMixin from '../mixins/username-mixin'

export default {
  name: 'InviteUserForm',
  mixins: [UsernameMixin],
  props: {
    room: {
      type: Object,
      required: true
    }
  },
  methods: {
    async inviteUser() {
      await this.$store.dispatch('invite/createInviteRequest', {
        username: this.username,
        roomId: this.room.id
      })
    }
  }
}
</script>

<style lang="scss">
  .invite-shard {
    display: inline-block;
  }
</style>
