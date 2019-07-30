<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand :to="isAuthenticated ? '/dashboard' : '/'">
        GoShare
      </b-navbar-brand>
      <b-navbar-toggle target="nav-collapse" />
      <UserNav v-if="isAuthenticated" />
      <GuestNav v-else />
    </b-navbar>
    <nuxt />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import GuestNav from '../components/GuestNav'
import UserNav from '../components/UserNav'

export default {
  components: { GuestNav, UserNav },
  computed: mapState({
    isAuthenticated: state => state.user.isAuthenticated
  })
}
</script>

<style>
</style>
