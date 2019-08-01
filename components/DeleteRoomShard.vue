<template>
  <div class="delete-shard">
    <b-button variant="danger" @click="$bvModal.show('delete-room-' + room.id)">
      Delete
    </b-button>

    <b-modal :id="'delete-room-' + room.id" title="Really delete this room?" @ok="deleteRoom(room.id)">
      <p>If you really want to delete <strong>{{ room.name }}</strong>, click OK.</p>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'DeleteRoomShard',
  props: {
    room: {
      type: Object,
      required: true
    }
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

<style lang="scss">
  .delete-shard {
    display: inline-block;
  }
</style>
