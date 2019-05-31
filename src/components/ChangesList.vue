<template>
  <div>
    <datepicker @selected="doStuff"></datepicker>
    <!-- {{ rdate + dt(rdate) }} -->
    <button @click="changeDir">{{ buttonTxt }}</button>
    <h2 v-if="before">Showing all changes before {{ dt(rdate) }}</h2>
    <h2 v-else>Showing all changes after {{ dt(rdate) }}</h2>
    <modals-container />
    <!-- <VueHotelDatepicker :minDate="minDate" :maxDate="maxDate" /> -->
    <table>
      <thead>
        <tr>
          <th>Build Status</th>
          <th>Timestamp</th>
          <th>Comment</th>
          <th>Committer</th>
          <th>Author</th>
          <th>Details</th>
        </tr>
      </thead>
      <tbody v-if="before">
        <tr v-for="change in changes" :key="change.id">
          <td v-if="change.when_timestamp < rdate" key="a"></td>
          <td v-if="change.when_timestamp < rdate" key="when_timestamp">
            {{ dt(change.when_timestamp) }}
          </td>
          <td v-if="change.when_timestamp < rdate" key="comments">
            {{ change.comments }}
          </td>
          <td v-if="change.when_timestamp < rdate" key="committer"></td>
          <td v-if="change.when_timestamp < rdate" key="author">
            {{ change.author }}
          </td>
          <td v-if="change.when_timestamp < rdate" key="details">
            <button v-on:click="show(change)">More</button>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr v-for="change in changes" :key="change.id">
          <td v-if="change.when_timestamp > rdate" key="a"></td>
          <td v-if="change.when_timestamp > rdate" key="when_timestamp">
            {{ dt(change.when_timestamp) }}
          </td>
          <td v-if="change.when_timestamp > rdate" key="comments">
            {{ change.comments }}
          </td>
          <td v-if="change.when_timestamp > rdate" key="committer"></td>
          <td v-if="change.when_timestamp > rdate" key="author">
            {{ change.author }}
          </td>
          <td v-if="change.when_timestamp > rdate" key="details">
            <button v-on:click="show(change)">More</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Vue from 'vue'
import VueHotelDatepicker from '@northwalker/vue-hotel-datepicker'
import Datepicker from 'vuejs-datepicker'
import VModal from 'vue-js-modal'
import Change from './Change'

Vue.use(VModal, {
  dynamic: true,
  injectModalsContainer: true,
  dynamicDefaults: { clickToClose: false }
})

var apiURL = 'https://api.github.com/repos/macports/macports-ports/commits/'

export default {
  name: 'App',
  components: {
    VueHotelDatepicker,
    Datepicker
  },
  data() {
    return {
      buttonTxt: 'Show changes after this date',
      before: true,
      commit: 'null',
      rdate: new Date().getTime() / 1000,
      minDate: new Date(
        new Date().getFullYear() - 12,
        new Date().getMonth(),
        new Date().getDate(),
        0,
        0,
        0
      ),
      maxDate: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
        0,
        0,
        0
      )
    }
  },
  // created: function() {
  //   this.fetchData()
  // },
  methods: {
    show(change) {
      this.$modal.show(
        Change,
        {
          change: change,
          buttons: [
            {
              title: 'Deal with it',
              handler: () => {
                alert('Woot!')
              }
            },
            {
              title: '', // Button title
              default: true, // Will be triggered by default if 'Enter' pressed.
              handler: () => {} // Button click handler
            },
            {
              title: 'Close'
            }
          ]
        },
        { draggable: true },
        { scrollable: true },
        { height: '600px' }
      )
    },
    hide() {
      this.$modal.hide(Change)
    },
    changeDir: function() {
      if (this.$data.before) {
        this.$data.before = false
        this.$data.buttonTxt = 'Show changes before this date'
      } else {
        this.$data.before = true
        this.$data.buttonTxt = 'Show changes after this date'
      }
    },
    doStuff: function(date) {
      console.log('original ' + this.$data.rdate)
      this.$data.rdate = date.getTime() / 1000
      console.log('final ' + this.$data.rdate)
    },
    dt: function(timestamp) {
      return new Date(timestamp * 1000)
    },
    fetchData: function(revision) {
      // var xhr = new XMLHttpRequest()
      // var self = this
      // xhr.open('GET', apiURL + revision)
      // xhr.onload = function() {
      //   self.commit = JSON.parse(xhr.responseText)
      //   // alert(self.commit);
      //   // console.log(self.commits[0].html_url);
      // }
      // xhr.send()
    }
  }
}
</script>

<style scoped></style>
