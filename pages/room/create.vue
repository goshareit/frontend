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
import _ from 'lodash'

export default {
  middleware: 'authenticated',
  data() {
    return {
      topic: null,
      name: '',
      secret: false
    }
  },
  computed: {
    topicOk() {
      if (this.topic == null) return
      return Number.isInteger(this.topic) && _.find(this.topics, t => t.value === this.topic) !== undefined
    },
    nameIsValidForm() {
      return /^[a-zA-Z0-9]+$/.test(this.name)
    },
    nameTooShort() {
      return this.name.length < 5
    },
    nameTooLong() {
      return this.name.length > 24
    },
    nameOk() {
      if (this.name.length === 0) return null
      return this.nameIsValidForm && !this.nameTooShort && !this.nameTooLong
    },
    ok() {
      return this.topicOk && this.nameOk
    }
  },
  async asyncData({ store }) {
    const topics = await store.dispatch('room/loadRoomTopicsRequest')
      .then((resp) => {
        if (resp.status === 200) {
          return {
            topics: _.concat(
              [{
                value: null,
                text: 'Choose an Option',
                disabled: true
              }],
              _.map(resp.data, (entry) => {
                return {
                  value: entry.id,
                  text: entry.name
                }
              })
            )
          }
        }
      })

    const rooms = await store.dispatch('room/readOwnedRoomsRequest')
      .then((resp) => {
        if (resp.status === 200) {
          return {
            rooms: resp.data
          }
        }
      })

    return {
      ...topics,
      ...rooms
    }
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
          this.$router.replace('/dashboard')
        }
      })
    }
  }
}
</script>
