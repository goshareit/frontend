<template>
  <div>
    <h1>Your Dashboard</h1>
    <hr>
    <b-button variant="info" block to="/room/create">
      Create new Room
    </b-button>

    <h1>Your Rooms</h1>
    <hr>
    <div v-for="room in rooms" :key="room.id">
      <nuxt-link :to="'/room/' + room.id">
        {{ room.name + ' (' + (room.secret ? 'secret' : 'public') + ')' }}
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  middleware: 'authenticated',
  computed: mapState({
    username: state => state.user.username
  }),
  asyncData({ store }) {
    return store.dispatch('room/readOwnedRoomsRequest')
      .then((resp) => {
        if (resp.status === 200) {
          return {
            rooms: resp.data
          }
        }
      })
  },
  methods: {
    createRoom() {
      // eslint-disable-next-line no-console
      console.log('wee woo wee woo')
    }
  }
}
</script>
