<template>
  <div>
    <p>Room Id: {{ room.id }}</p>
    <p>Room Name: {{ room.name }}</p>
    <p>Room Owner: {{ room.ownerUniqueId }}</p>
    <p>Room Secret?: {{ room.secret }}</p>
    <p>Room Topic: {{ room.topic.name }} (#{{ room.topic.id }})</p>

    <b-button to="update" append>
      Update
    </b-button>
  </div>
</template>

<script>
export default {
  asyncData({ store, params, error }) {
    const room = store.getters['room/getRoom'](params.id)
    if (room === undefined) {
      error({
        status: 404,
        message: 'Room not found'
      })
    } else {
      return { room }
    }
  }
}
</script>
