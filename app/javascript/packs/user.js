import Vue from 'vue/dist/vue.esm'
import TurbolinksAdapter from 'vue-turbolinks'
import VueResource from 'vue-resource'

Vue.use(VueResource)
Vue.use(TurbolinksAdapter)

document.addEventListener('turbolinks:load', () => {
  Vue.http.headers.common['X-CSRF-Token'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

  var element = document.getElementById("user-form")

  if (element != null) {
    var user = JSON.parse(element.dataset.user)

    var app = new Vue({
      el: element,
      data: function() {
        return { 
          errors: {},
          user: user
        }
      },
      methods: {
        Submit: function() {
          this.errors = { 
            name: ((this.name == null) || this.name === "" ? "* Name cannot be blank" : void 0),
          }
          if (user.id === null) {
            this.$http.post('/users' , {
              user: this.user
            }).then(function(response){
              Turbolinks.visit('/users/' + response.body.id)
            });
            (function(response) {
              this.errors = response.data.errors;
            })
          } else { 
            this.$http.put('/users/' + user.id , {
              user: this.user
            }).then(function(response) {
              Turbolinks.visit('/users/' + response.body.id)
            });
            (function(response) {
              this.errors = response.data.errors;
            });
          }
        }
      }
    });
  }
});