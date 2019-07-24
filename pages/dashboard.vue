<template>
  <div>
    <h1>Your Dashboard</h1>
    <hr>
    <b-button variant="info" block @click.prevent="$bvModal.show('create-room-modal')">
      Create new Room
    </b-button>

    <b-modal id="create-room-modal">
      Heyyyy
    </b-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  middleware: 'authenticated',
  computed: mapState({
    username: state => state.user.username
  }),
  methods: {
    createRoom() {
      // eslint-disable-next-line no-console
      console.log('wee woo wee woo')
    }
  }
}
</script>
