<template>
  <div>
    <b-form @submit.prevent="updateRoom()">
      <b-form-group
        id="topic-input-group"
        label="Room Topic:"
        label-for="topic-input"
        description="Choose a topic that best represents your room."
      >
        <b-form-select id="topic-input" v-model="topic" :options="topics" :state="topicOk" required />
      </b-form-group>

      <b-form-group
        id="name-input-group"
        label="Room Name:"
        label-for="name-input"
        description="Choose a new name for the room."
      >
        <b-form-input
          id="name-input"
          v-model="name"
          :state="nameOk"
          required
          placeholder="Enter Room Name"
        />
        <b-form-invalid-feedback :state="nameOk">
          <p v-if="!nameIsValidForm">
            Your room's name can only contain numbers, lowercase, and uppercase letters.
          </p>
          <p v-else-if="nameTooShort">
            Your room's name cannot be shorter than 5 characters.
          </p>
          <p v-else-if="nameTooLong">
            Your room's name cannot be longer than 24 characters.
          </p>
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group
        id="secret-input-group"
        label="Secret Room"
        label-for="secret-input"
      >
        <b-form-checkbox
          id="secret-input"
          v-model="secret"
          :value="true"
          :unchecked-value="false"
        >
          Require users to be invited to this room to join
        </b-form-checkbox>
      </b-form-group>

      <b-button type="submit" block variant="info" :disabled="!ok">
        Update {{ nameOk ? '"' + room.name + '"' : '' }}
      </b-button>
    </b-form>
  </div>
</template>

<script>
import TopicMixin from '../../../mixins/topic-mixin'
import RoomNameMixin from '../../../mixins/room-name-mixin'

export default {
  mixins: [TopicMixin, RoomNameMixin],
  middleware: ['authenticated'],
  computed: {
    ok() {
      return this.topicOk && this.nameOk
    }
  },
  asyncData({ store, params, error }) {
    const room = store.getters['room/getRoom'](params.id)
    if (room === undefined) {
      error({
        status: 404,
        message: 'Room not found'
      })
    } else {
      return {
        room,
        topic: room.topic.id,
        name: room.name,
        secret: room.secret
      }
    }
  },
  methods: {
    updateRoom() {
      if (!this.ok) return
      this.$store.dispatch('room/updateRoomRequest', {
        id: this.room.id,
        topicId: this.topic,
        name: this.name,
        secret: this.secret
      }).then((resp) => {
        if (resp.status === 200) {
          this.$store.commit('room/updateOwnedRoom', resp.data)
          this.$router.replace(`/room/${resp.data.id}`)
        }
      })
    }
  }
}
</script>
