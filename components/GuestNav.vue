<template>
  <b-collapse id="nav-collapse" is-nav>
    <b-navbar-nav class="ml-auto">
      <b-nav-item to="/login">
        Login
      </b-nav-item>
      <b-nav-item to="/signup">
        Sign Up
      </b-nav-item>
    </b-navbar-nav>
  </b-collapse>
</template>

<script>
export default {
  name: 'GuestNav'
}
</script>
