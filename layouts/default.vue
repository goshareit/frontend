<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand to="/">
        GoShare
      </b-navbar-brand>
      <b-navbar-toggle target="nav-collapse" />
      <b-collapse id="nav-collapse" is-nav>
        <UserNav v-if="isAuthenticated" />
        <GuestNav v-else />
      </b-collapse>
    </b-navbar>
    <b-container>
      <nuxt />
    </b-container>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import GuestNav from '../components/GuestNav'
import UserNav from '../components/UserNav'

export default {
  components: { GuestNav, UserNav },
  computed: mapState({
    isAuthenticated: state => state.isAuthenticated
  })
}
</script>

<style>
</style>
