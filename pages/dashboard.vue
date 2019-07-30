<template>
  <b-container>
    <h1>Your Dashboard</h1>
    <hr>
    <b-button variant="info" block to="/room/create">
      Create new Room
    </b-button>

    <h1>Your Rooms ({{ ownedRoomCount }})</h1>
    <hr>
    <div v-for="room in ownedRooms" :key="room.id">
      <nuxt-link :to="'/room/' + room.id">
        {{ room.name + ' (' + (room.secret ? 'secret' : 'public') + ')' }}
      </nuxt-link>

      <b-button variant="danger" @click="$bvModal.show('delete-room-' + room.id)">
        Delete
      </b-button>

      <b-modal :id="'delete-room-' + room.id" title="Really delete this room?" @ok="deleteRoom(room.id)">
        <p>If you really want to delete <strong>{{ room.name }}</strong>, click OK.</p>
      </b-modal>
    </div>
  </b-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  middleware: 'authenticated',
  computed: {
    ...mapState({
      username: state => state.user.username,
      ownedRooms: state => state.room.owned,
      memberRooms: state => state.room.member
    }),
    ...mapGetters({
      ownedRoomCount: 'room/ownedRoomCount'
    })
  },
  methods: {
    deleteRoom(id) {
      this.$store.dispatch('room/deleteRoomRequest', { id })
        .then((resp) => {
          if (resp.status === 200 && resp.state) {
            this.$store.commit('room/deleteOwnedRoom', { id })
          }
        })
    }
  }
}
</script>
