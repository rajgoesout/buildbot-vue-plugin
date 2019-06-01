<template>
  <div>
    <datepicker @selected="doStuff"></datepicker>
    <!-- {{ rdate + dt(rdate) }} -->
    <button @click="changeDir">{{ buttonTxt }}</button>
    <h2 v-if="before">Showing all changes before {{ dt(rdate) }}</h2>
    <h2 v-else>Showing all changes after {{ dt(rdate) }}</h2>
    <!-- <VueHotelDatepicker :minDate="minDate" :maxDate="maxDate" /> -->
    <table>
      <thead>
        <tr>
          <th>Build Status</th>
          <th>Timestamp</th>
          <th>Comments</th>
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
import Router from 'vue-router'
import VueHotelDatepicker from '@northwalker/vue-hotel-datepicker'
import Datepicker from 'vuejs-datepicker'
import VModal from 'vue-js-modal'
import Change from './Change'

Vue.use(Router)

var router = new Router({
  mode: 'history',
  routes: [
    // {
    //   path: '/',
    //   component: ChangesList
    // },
    {
      path: '/change/:id',
      component: Change,
      meta: { showModal: true }
    }
  ]
})

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
          changes: this.$data.changes,
          change: change,
          builders: this.$data.builders,
          builds: this.$data.builds,
          buildrequests: this.$data.buildrequests,
          buildsets: this.$data.buildsets,
          // changesBySSID: {},
          // changesByRevision: {},
          buttons: [
            {
              title: 'Close'
            }
          ]
        },
        {
          width: 1000,
          height: 'auto',
          pivotX: 0.8,
          scrollable: true,
          resizable: true
        }
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
