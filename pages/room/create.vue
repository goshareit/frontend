<template>
  <b-form @submit.prevent="createRoom()">
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
      description="Choose a name for your new room."
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
      Create {{ nameOk ? '"' + name + '"' : '' }}
    </b-button>
  </b-form>
</template>

<script>
import { mapGetters } from 'vuex'
import TopicMixin from '../../mixins/topic-mixin'
import RoomNameMixin from '../../mixins/room-name-mixin'

export default {
  middleware: 'authenticated',
  mixins: [TopicMixin, RoomNameMixin],
  data() {
    return {
      secret: false
    }
  },
  computed: {
    ok() {
      return this.topicOk && this.nameOk
    },
    ...mapGetters({
      ownedRoomCount: 'room/ownedRoomCount'
    })
  },
  methods: {
    createRoom() {
      if (!this.ok) return
      this.$store.dispatch('room/createRoomRequest', {
        topic: this.topic,
        name: this.name,
        secret: this.secret
      }).then((resp) => {
        if (resp.status === 200) {
          this.$store.commit('room/pushOwnedRoom', resp.data)
          this.$router.replace('/dashboard')
        }
      })
    }
  }
}
</script>
