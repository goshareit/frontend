<template>
  <b-collapse id="nav-collapse" is-nav>
    <b-navbar-nav>
      <b-nav-item to="/dashboard">
        Dashboard
      </b-nav-item>
    </b-navbar-nav>
    <b-navbar-nav class="ml-auto">
      <b-nav-item-dropdown right>
        <template slot="button-content">
          <fa :icon="['fas', 'bell']" />
        </template>
        <b-dropdown-item v-for="invite in invites" :key="invite.id" :href="'#' + invite.id">
          <b-container>
            <b-row>
              <b-col>
                {{ invite.room.name }}
              </b-col>
              <b-col>
                <b-button variant="primary" @click.prevent="acceptInvite(invite.id)">
                  Accept
                </b-button>
              </b-col>
              <b-col>
                <b-button variant="danger" @click.prevent="declineInvite(invite.id)">
                  Decline
                </b-button>
              </b-col>
            </b-row>
          </b-container>
        </b-dropdown-item>
      </b-nav-item-dropdown>
      <b-nav-item-dropdown right>
        <template slot="button-content">
          <em>{{ username }}</em>
        </template>
        <b-dropdown-item to="/settings">
          Settings
        </b-dropdown-item>
        <b-dropdown-item href="#" @click.prevent="logOut()">
          Log Out
        </b-dropdown-item>
      </b-nav-item-dropdown>
    </b-navbar-nav>
  </b-collapse>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'UserNav',
  computed: {
    ...mapState({
      username: state => state.user.username,
      invites: state => state.invite.invites
    })
  },
  methods: {
    async logOut() {
      await this.$store.dispatch('user/signOutRequest')
        .then(() => this.$router.replace({ path: '/' }))
    },
    async acceptInvite(inviteId) {
      await this.$store.dispatch('invite/acceptInviteRequest', { inviteId })
    },
    async declineInvite(inviteId) {
      await this.$store.dispatch('invite/deleteInviteRequest', { inviteId })
    }
  }
}
</script>
