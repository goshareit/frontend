<template xmlns:v-video-player="http://www.w3.org/1999/xhtml">
  <b-container class="room" fluid>
    <b-row class="top">
      <b-col cols="7" lg="9">
        <div
          v-video-player:roomVideoPlayer="playerData"
          class="player"
          @play="playerPlayed"
          @pause="playerPaused"
          @ended="playerEnded"
          @loadeddata="playerLoadedData"
          @waiting="playerWaiting"
          @playing="playerPlaying"
          @timeupdate="playerTimeUpdate"
          @canplay="playerCanPlay"
          @canplaythrough="playerCanPlayThrough"
          @ready="playerReady"
          @statechanged="playerStateChanged"
        />
      </b-col>
      <b-col cols="5" lg="3" class="chatbox">
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
    <b-row>
      <b-col class="bottom">
        <b-nav>
          <b-nav-item-dropdown
            :text="room.name"
            dropup
          >
            <b-dropdown-item v-if="isOwner" to="update" append>
              Update Room
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-nav>
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
      chatbox: [],
      playerData: {
        muted: true,
        language: 'en',
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        sources: [{
          type: 'video/mp4',
          src: 'https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm'
        }]
      }
    }
  },
  computed: {
    isOwner() {
      return this.uniqueId === this.room.ownerUniqueId
    },
    ...mapState({
      uniqueId: state => state.user.uniqueId,
      username: state => state.user.username
    })
  },
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
    },
    playerPlayed(playEvt) {
      // eslint-disable-next-line no-console
      console.log('played')
      // eslint-disable-next-line no-console
      console.log(playEvt)
    },
    playerPaused(pauseEvt) {
      // eslint-disable-next-line no-console
      console.log('paused')
      // eslint-disable-next-line no-console
      console.log(pauseEvt)
    },
    playerEnded(endedEvt) {
      // eslint-disable-next-line no-console
      console.log('ended')
      // eslint-disable-next-line no-console
      console.log(endedEvt)
    },
    playerLoadedData(loadedDataEvt) {
      // eslint-disable-next-line no-console
      console.log('loaded data')
      // eslint-disable-next-line no-console
      console.log(loadedDataEvt)
    },
    playerWaiting(waitingEvt) {
      // eslint-disable-next-line no-console
      console.log('waiting...')
      // eslint-disable-next-line no-console
      console.log(waitingEvt)
    },
    playerPlaying(playingEvt) {
      // eslint-disable-next-line no-console
      console.log('playing')
      // eslint-disable-next-line no-console
      console.log(playingEvt.state)
      // eslint-disable-next-line no-console
      console.log(playingEvt.cache_)
    },
    playerTimeUpdate(timeUpdateEvt) {
      // eslint-disable-next-line no-console
      console.log('time updated')
      // eslint-disable-next-line no-console
      console.log(timeUpdateEvt)
    },
    playerCanPlay(canPlayEvt) {
      // eslint-disable-next-line no-console
      console.log('can play')
      // eslint-disable-next-line no-console
      console.log(canPlayEvt)
    },
    playerCanPlayThrough(canPlayThroughEvt) {
      // eslint-disable-next-line no-console
      console.log('can play through')
      // eslint-disable-next-line no-console
      console.log(canPlayThroughEvt)
    },
    playerReady(readyEvt) {
      // eslint-disable-next-line no-console
      console.log('ready')
      // eslint-disable-next-line no-console
      console.log(readyEvt)
    },
    playerStateChanged(stateChangedEvt) {
      // eslint-disable-next-line no-console
      console.log('state changed')
      // eslint-disable-next-line no-console
      console.log(stateChangedEvt)
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
      flex: 1;

      .player {
        width: 100%;
        height: 100%;
      }

      .chatbox {
        max-height: $pageHeight;
        border-left: 1px solid black;
        padding: 0;
        position: relative;

        #messages {
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
      border-top: 1px solid #000
    }
  }
</style>
