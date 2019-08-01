<template>
  <b-container>
    <LogInForm />
  </b-container>
</template>

<script>
import LogInForm from '../components/LogInForm'

export default {
  middleware: 'unauthenticated',
  components: { LogInForm }
}
</script>
