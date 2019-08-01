<template>
  <b-container>
    <SignUpForm />
  </b-container>
</template>

<script>
import SignUpForm from '../components/SignUpForm'

export default {
  components: { SignUpForm },
  middleware: 'unauthenticated'
}
</script>
