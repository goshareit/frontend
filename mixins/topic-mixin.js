import { mapState } from 'vuex'
import _ from 'lodash'

export default {
  data() {
    return {
      topic: null
    }
  },
  computed: {
    topicOk() {
      if (this.topic == null) return
      return Number.isInteger(this.topic) && _.find(this.topics, t => t.value === this.topic) !== undefined
    },
    ...mapState({
      topics: (state) => {
        return _.concat(
          [{
            value: null,
            text: 'Choose an Option',
            disabled: true
          }],
          _.map(state.topic.topics, (entry) => {
            return {
              value: entry.id,
              text: entry.name
            }
          })
        )
      }
    })
  }
}
