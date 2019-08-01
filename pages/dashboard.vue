<template>
  <b-container>
    <h1>Your Dashboard</h1>
    <hr>
    <b-button variant="info" block to="/room/create">
      Create new Room
    </b-button>

    <h1>Owned Rooms ({{ ownedRoomCount }})</h1>
    <hr>
    <div v-for="room in ownedRooms" :key="room.id">
      <nuxt-link :to="'/room/' + room.id">
        {{ room.name + ' (' + (room.secret ? 'secret' : 'public') + ')' }}
      </nuxt-link>

      <DeleteRoomShard :room="room" />
      <InviteUserShard :room="room" />
    </div>

    <h1>Room Memberships ({{ memberRoomCount }})</h1>
    <hr>
    <div v-for="ctx in memberRooms" :key="ctx.room.id">
      <nuxt-link :to="'/room/' + ctx.room.id">
        {{ ctx.room.name }}
      </nuxt-link>
    </div>
  </b-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import DeleteRoomShard from '../components/DeleteRoomShard'
import InviteUserShard from '../components/InviteUserShard'

export default {
  components: { DeleteRoomShard, InviteUserShard },
  middleware: 'authenticated',
  computed: {
    ...mapState({
      username: state => state.user.username,
      ownedRooms: state => state.room.owned,
      memberRooms: state => state.room.member
    }),
    ...mapGetters({
      ownedRoomCount: 'room/ownedRoomCount',
      memberRoomCount: 'room/memberRoomCount'
    })
  }
}
</script>
