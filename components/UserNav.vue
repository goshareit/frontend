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
      username: state => state.user.username
    })
  },
  methods: {
    async logOut() {
      await this.$store.dispatch('user/signOutRequest')
        .then(() => this.$router.replace({ path: '/' }))
    }
  }
}
</script>
