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
export default {
  name: 'UserNav',
  data() {
    return {
      username: ''
    }
  },
  created() {
    this.$store.dispatch('user/readSelfRequest')
      .then((resp) => {
        if (resp.status === 200) {
          this.username = resp.data.username
        }
      })
  },
  methods: {
    signOut() {
      this.$store.dispatch('user/signOutRequest')
        .then((resp) => {
          if (resp.state) {
            this.$store.dispatch('user/revokeSession')
              .then(() => this.$router.go())
          }
        })
    }
  }
}
</script>
