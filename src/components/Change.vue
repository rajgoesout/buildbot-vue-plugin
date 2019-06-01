<template>
  <div class="change-modal">
    <a class="heading" v-bind:href="$attrs.change.revlink" target="_blank">{{
      $attrs.change.comments.split('\n')[0]
    }}</a>
    <br />
    <strong> Author:</strong> {{ $attrs.change.author }}
    <br />
    <strong>Timestamp:</strong> {{ dt($attrs.change.when_timestamp) }}
    <br />
    <strong>Comments:</strong>
    <br />
    <div
      class="comments"
      v-for="line in $attrs.change.comments.split('\n')"
      :key="line.length"
    >
      <div class="" v-html="createLinks(line)"></div>
    </div>
    <strong>Changed files:</strong>
    <br />
    <div v-for="file in $attrs.change.files" :key="file">{{ file }}</div>
    <strong>Builders:</strong><br />
    <!-- <p>{{ _onChange() }}</p> -->
    <div v-for="builder in $attrs.builders" :key="builder.builderid">
      {{ builder.name }} {{ builder.builds }}
    </div>
    <!-- <div v-for="bbid in $attrs.change.buildersById" :key="bbid.builderid">
      {{ bbid.name }}
      {{ bbid }}
      {{ populateChange($attrs.change) }}
    </div> -->
    <br />
    <div class="close-btn" @click="$emit('close')">❌</div>
  </div>
</template>

<script>
import Autolinker from 'autolinker'

const baseURL = 'https://github.com/macports/macports-ports/commit/'

export default {
  name: 'Change',
  data() {
    return {
      baseURL: baseURL
    }
  },
  methods: {
    createLinks: function(text) {
      var linkedText = Autolinker.link(text)
      return linkedText
    },
    dt: function(timestamp) {
      return new Date(timestamp * 1000)
    },
    _onChange: function() {
      let build, change
      // this.onchange_debounce = undefined;
      // we only display builders who actually have builds
      // for (build of Array.from(this.builds)) {
      //     this.all_builders.get(build.builderid).hasBuild = true;
      // }

      // this.sortBuildersByTags(this.all_builders);

      if (this.$attrs.changesBySSID == null) {
        this.$attrs.changesBySSID = {}
      }
      if (this.$attrs.changesByRevision == null) {
        this.$attrs.changesByRevision = {}
      }
      for (change of Array.from(this.$attrs.changes)) {
        this.$attrs.changesBySSID[change.sourcestamp.ssid] = change
        this.$attrs.changesByRevision[change.revision] = change
        this.populateChange(change)
      }

      for (build of Array.from(this.$attrs.builds)) {
        this.matchBuildWithChange(build)
      }

      this.filtered_changes = []

      for (let ssid in this.$attrs.changesBySSID) {
        change = this.$attrs.changesBySSID[ssid]
        if (change.comments) {
          change.subject = change.comments.split('\n')[0]
        }
        for (let builder of Array.from(change.builders)) {
          if (builder.builds.length > 0) {
            this.filtered_changes.push(change)
            break
          }
        }
      }
    },
    /*
     * fill a change with a list of builders
     */
    populateChange: function(change) {
      change.builders = []
      change.buildersById = {}
      for (let builder of Array.from(this.$attrs.builders)) {
        // if (builder.hasBuild) {
        builder = {
          builderid: builder.builderid,
          name: builder.name,
          builds: []
        }
        change.builders.push(builder)
        change.buildersById[builder.builderid] = builder
        // console.log(change)
      }
      // }
    },
    /*
     * Match builds with a change
     */
    matchBuildWithChange: function(build) {
      let change, revision
      // const buildrequest = this.$attrs.buildrequests.get(build.buildrequestid)
      const buildrequest = this.$attrs.buildrequests.filter(br => {
        return br.buildrequestid === build.buildrequestid
      })
      if (buildrequest == null) {
        return
      }
      // const buildset = this.$attrs.buildsets.get(buildrequest.buildsetid)
      const buildset = this.$attrs.buildsets.filter(bs => {
        return bs.buildsetid === buildrequest.buildsetid
      })
      if (buildset == null) {
        return
      }
      if (buildset != null && buildset.sourcestamps != null) {
        for (let sourcestamp of Array.from(buildset.sourcestamps)) {
          change = this.$attrs.changesBySSID[sourcestamp.ssid]
          if (change != null) {
            break
          }
        }
      }

      if (
        change == null &&
        (build.properties != null
          ? build.properties.got_revision
          : undefined) != null
      ) {
        const rev = build.properties.got_revision[0]
        // got_revision can be per codebase or just the revision string
        if (typeof rev === 'string') {
          change = this.$attrs.changesByRevision[rev]
          if (change == null) {
            change = this.makeFakeChange('', rev, build.started_at)
          }
        } else {
          let codebase
          for (codebase in rev) {
            revision = rev[codebase]
            change = this.$attrs.changesByRevision[revision]
            if (change != null) {
              break
            }
          }

          if (change == null) {
            revision = rev === {} ? '' : rev[rev.keys()[0]]
            change = this.makeFakeChange(codebase, revision, build.started_at)
          }
        }
      }

      if (change == null) {
        revision = `unknown revision ${build.builderid}-${build.buildid}`
        change = this.makeFakeChange(
          'unknown codebase',
          revision,
          build.started_at
        )
      }

      return change.buildersById[build.builderid].builds.push(build)
    },
    makeFakeChange: function(codebase, revision, when_timestamp) {
      let change = this.$attrs.changesBySSID[revision]
      if (change == null) {
        change = {
          codebase,
          revision,
          changeid: revision,
          when_timestamp,
          author: `unknown author for ${revision}`,
          comments:
            revision +
            '\n\nFake comment for revision: No change for this revision, please setup a changesource in Buildbot'
        }
        this.$attrs.changesBySSID[revision] = change
        this.populateChange(change)
      }
      return change
    }
  }
}
</script>
<style scoped>
.change-modal {
  margin: 12px;
}
.heading {
  font-size: 20px;
}
.close-btn {
  position: absolute;
  top: 2px;
  right: 2px;
}
.comments {
  background-color: azure;
  padding: 2px 2px 4px 8px;
}
</style>
