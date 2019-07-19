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
      <b-dropdown-item href="#">
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
      username: 'Something'
    }
  }
}
</script>
