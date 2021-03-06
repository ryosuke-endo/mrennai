import Vue from 'vue/dist/vue'
import axios from 'axios/dist/axios'

import modalMixins from '../mixins/modal.js'

import formError from '../components/common/form/error.js'
import fileUpload from '../components/common/sp/file_upload.js'
import icon from '../components/common/sp/icon.js'
import modal from '../components/common/form/modal.js'

axios.defaults.headers['X-CSRF-TOKEN'] = $('meta[name=csrf-token]').attr('content')

$(function() {
  const topicForm = Vue.extend({
    mixins: [modalMixins],
    data() {
      return {
        categories: [],
        topic: {
          title: '',
          body: '',
          category_id: '',
          name: '匿子さん',
          image: '',
          errors: {
            count: 0,
            keys: [],
            messages: []
          }
        },
      }
    },

    created() {
      self = this
      axios.get('/api/categories.json')
      .then(function(res) {
        self.categories = res.data
        self.getCategoryId()
      })
    },
    components: {
      'form-error': formError,
      'file-upload': fileUpload,
      'icon': icon,
      'modal': modal
    },

    methods: {
      getCategoryId() {
        const id = parseInt(location.href.match(/\d$/).join(''))
        return this.topic.category_id = id
      },
      addUrl(url) {
        const text = this.topic.body
        if(text.length === 0) {
          this.topic.body = url
        } else {
          this.topic.body = (`${text}\n\n${url}`)
        }
      },
      submit() {
        self = this
        const topic_params = {
          topic: self.topic
        }
        axios({
          method: "post",
          url: "/api/topics",
          data: topic_params
        })
        .then(function(res) {
          location.href = `/topics/complete?id=${res.data.id}`
        })
        .catch(function(error) {
          self.topic.errors.count = parseInt(Object.keys(error.response.data.errors).length)
          self.topic.errors.keys = error.response.data.errors
          self.topic.errors.messages = error.response.data.error_messages
        })
      },
      isError(name) {
        if (this.topic.errors.keys[name]) {
          return "field_with_errors"
        }
      }
    }
  })
  new topicForm().$mount('#topic-form-vue')
});
