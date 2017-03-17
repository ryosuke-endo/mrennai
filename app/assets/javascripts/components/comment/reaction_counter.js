import Vue from 'vue/dist/vue'
import { mapState } from 'vuex/dist/vuex'
import axios from 'axios/dist/axios'

axios.defaults.headers['X-CSRF-TOKEN'] = $('meta[name=csrf-token]').attr('content')

export default Vue.extend({
  props: {
    reactionable_id: {
      type: String
    },
    type: {
      type: String
    }
  },
  methods: {
    hexName(icon) {
      return icon.image_file_name.replace(/(unicode\/|\.png)/, '')
    },
    spriteClass(icon) {
      return `emoji-${this.hexName(icon)}`
    },
    reactionCount(icon) {
      const count = this.type === "Topic" ?
        this.icons.topic[icon.id].length : this.icons.comment[this.reactionable_id][icon.id].length
      return count
    },
    submit(icon) {
      const self = this
      const params = {
        reactionable_id: this.reactionable_id,
        type: this.type,
        icon: {
          name: this.hexName(icon)
        }
      }
      axios({
        method: "POST",
        url: `/api/reactions/${this.type}`,
        data: params
      })
      .then(function(res) {
        self.$store.dispatch('addIcon', res.data)
        self.isReactioned(icon)
      })
      .catch(function(err) {
        console.log("reactioned fail")
      })
    },
    isReactioned(icon) {
      const ids = this.type === "Topic" ?
        this.icons.topic.user_reactioned_ids : this.icons.comment[this.reactionable_id].user_reactioned_ids
      if (ids === undefined) {
        return
      }
      if (ids.indexOf(icon.id) >= 0) {
        return "is-active"
      }
    },
    filterIcons() {
      if (this.type == "Topic") {
        const keys = Object.keys(this.icons.topic).filter((x) => parseInt(x))
        const mapIcon = keys.map((x) => this.icons.topic[x])
        return mapIcon
      } else {
        const keys = Object.keys(this.icons.comment[this.reactionable_id]).filter((x) => parseInt(x))
        const mapIcon = keys.map((x) => this.icons.comment[this.reactionable_id][x])
        return mapIcon
      }
    }
  },
  computed: mapState([
    'icons',
    'visiable'
  ]),
  template: `
  <div class="c-container c-flex c-flex__wrap" v-if="visiable">
    <div v-for="icon in filterIcons()" class="p-emoji__container c-flex c-border c-border-r-5" :class="isReactioned(icon[0])" @click="submit(icon[0])">
      <div :class="spriteClass(icon[0])">
      </div>
      <div class="p-emoji__counter">
        {{reactionCount(icon[0])}}
      </div>
    </div>
  </div>
  `
})
