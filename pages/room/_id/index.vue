<template>
  <b-container class="room" fluid>
    <b-row class="top">
      <b-col cols="9" class="player">
        <p>Room Id: {{ room.id }}</p>
        <p>Room Name: {{ room.name }}</p>
        <p>Room Owner: {{ room.ownerUniqueId }}</p>
        <p>Room Secret?: {{ room.secret }}</p>
        <p>Room Topic: {{ room.topic.name }} (#{{ room.topic.id }})</p>
      </b-col>
      <b-col cols="3" class="chatbox">
        <div id="messages">
          <div v-if="ws !== null">
            <div v-for="(entry, idx) in chatbox" :key="idx">
              <p v-if="entry.type === 'CHAT'">
                <strong>{{ entry.author }}:</strong> {{ entry.message }}
              </p>
              <p v-else-if="entry.type === 'STATUS'">
                <em>{{ entry.message }}</em>
              </p>
            </div>
          </div>
          <div v-else>
            <p>Websocket loading...</p>
          </div>
        </div>
        <div class="input">
          <form @submit.prevent="sendChat()">
            <input v-model="chatInput" type="text" placeholder="Chat...">
            <b-button type="submit" hidden />
          </form>
        </div>
      </b-col>
    </b-row>
    <b-row class="bottom">
      <b-col class="controls">
        <p class="text-center">
          Player controls will go here
        </p>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      ws: null,
      chatInput: '',
      chatbox: []
    }
  },
  computed: mapState({
    username: state => state.user.username
  }),
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
  },
  async mounted() {
    const session = this.$getSession()
    await this.$gsClient().roomWs().open(this.room.id, session.userId, session.sessionToken)
      .then((ws) => {
        if (ws === undefined) return

        ws.onmessage = (messageEvt) => {
          const payload = JSON.parse(messageEvt.data).data
          switch (payload.type) {
            case 'STATUS':
              let message = ''

              if (payload.status === 'CONNECTED') {
                message = 'You have connected to the chat'
              } else if (payload.status === 'DISCONNECTED') {
                message = 'You have disconnected from the chat'
              }

              this.chatbox.push({
                type: payload.type,
                message
              })
              break
            case 'CHAT':
              this.chatbox.push({
                type: payload.type,
                author: payload.sender,
                message: payload.message
              })
              break
          }
          if (payload.type === 'CHAT') {

          }
        }

        this.ws = ws
      })
  },
  updated() {
    this.$nextTick(() => {
      const div = document.getElementById('messages')
      if ((div.scrollHeight - div.clientHeight) <= (div.scrollTop + 100)) {
        div.scrollTop = div.scrollHeight - div.clientHeight
      }
    })
  },
  methods: {
    sendChat() {
      this.sendWs(JSON.stringify({
        type: 'CHAT',
        sender: this.username,
        message: this.chatInput
      }))
      this.chatInput = ''
    },
    sendWs(payload) {
      if (this.ws !== null) {
        this.ws.send(payload)
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.ws === null) return
    this.ws.close()
    next()
  }
}
</script>

<style lang="scss">
  $pageHeight: calc(100vh - 56px);
  $topHeight: calc(#{$pageHeight} - 15vh);

  .room {
    display: flex;
    flex-flow: column;
    height: $pageHeight;

    .top {
      border-bottom: 1px solid #000;
      flex: 1;

      .chatbox {
        display: flex;
        flex-flow: column;
        border-left: 1px solid black;
        padding: 0;
        position: relative;

        #messages {
          flex: 1;
          max-height: calc(#{$topHeight} + 40px);
          width: 100%;
          position: absolute;
          bottom: 40px;
          padding-left: 5px;
          overflow-y: auto;
        }

        .input {
          border-top: 1px solid #000;
          position: absolute;
          bottom: 0;
          height: 40px;
          width: 100%;
          padding: 0;

          input {
            width: 100%;
            height: 39px;
            border: 0;
            padding-left: 5px;
          }
        }
      }
    }

    .bottom {
      flex: 0 1 auto;
    }
  }
</style>
