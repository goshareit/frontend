<template>
  <b-navbar-nav class="ml-auto">
    <b-nav-item-dropdown right>
      <template slot="button-content">
        <em>{{ username }}</em>
      </template>
      <b-dropdown-item :to="'/user/' + username">
        My Profile
      </b-dropdown-item>
      <b-dropdown-item :to="'/room/' + username">
        My Room
      </b-dropdown-item>
      <b-dropdown-item href="#" @click.prevent="signOut()">
        Sign Out
      </b-dropdown-item>
    </b-nav-item-dropdown>
  </b-navbar-nav>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'UserNav',
  computed: {
    ...mapState({
      username: state => state.user.username
    })
  },
  methods: {
    async signOut() {
      await this.$store.dispatch('user/signOutRequest')
        .then(async (resp) => {
          if (resp.state) {
            await this.$store.dispatch('user/revokeSession')
              .then(() => this.$router.go())
          }
        })
    }
  }
}
</script>
