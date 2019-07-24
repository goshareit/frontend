<template>
  <p>Room page for {{ room.name }}</p>
</template>
<script>
export default {
  asyncData({ params, store, error }) {
    return store.dispatch('room/readRoomRequest', {
      id: params.id
    }).then((resp) => {
      switch (resp.status) {
        case 404:
          error({
            statusCode: 404,
            message: 'Unknown Room'
          })
          break
        case 401:
          error({
            statusCode: 401,
            message: 'This room is secret'
          })
          break
        case 200:
          return {
            room: resp.data
          }
      }
    })
  }
}
</script>
