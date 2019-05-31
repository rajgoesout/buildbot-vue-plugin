<template>
  <div>
    <a v-bind:href="baseURL + $attrs.change.revision">{{
      $attrs.change.comments.split('\n')[0]
    }}</a>
    <br />
    Author: {{ $attrs.change.author }}
    <br />
    Timestamp: {{ dt($attrs.change.when_timestamp) }} <br />Commit message:
    <br />
    <div v-for="line in $attrs.change.comments.split('\n')" :key="line">
      {{ line }}
    </div>
    Changed files:
    <br />
    <div v-for="file in $attrs.change.files" :key="file">{{ file }}</div>
    <button @click="$emit('close')">Close</button>
  </div>
</template>

<script>
const baseURL = 'https://github.com/macports/macports-ports/commit/'
export default {
  name: 'Change',
  data() {
    return {
      baseURL: baseURL
    }
  },
  methods: {
    dt: function(timestamp) {
      return new Date(timestamp * 1000)
    }
  }
}
</script>
