import Vue from 'vue'
import SampleVueComponent from './components/SampleVueComponent.vue'
import ChangesList from './components/ChangesList.vue'
import Change from './components/Change.vue'
import BuildHistory from './components/BuildHistory.vue'

console.log('Hello from the buildbot-vue-plugin-boilerplate!')

var module = angular.module('buildbot_vue_plugin_boilerplate', [
  'ui.router',
  'ui.bootstrap',
  'ui.bootstrap.popover',
  'ngAnimate',
  'guanlecoja.ui',
  'bbData'
])

module.config([
  '$stateProvider',
  'glMenuServiceProvider',
  'bbSettingsServiceProvider',
  'config',
  (
    $stateProvider,
    glMenuServiceProvider,
    bbSettingsServiceProvider,
    config
  ) => {
    // Config object coming in from the master.cfg
    // console.log('config', config)

    // Name of the state
    const name = 'vuePluginBoilerplate'

    // Menu configuration
    glMenuServiceProvider.addGroup({
      name,
      caption: 'Vue Plugin Boilerplate',
      icon: 'question-circle',
      order: 0
    })

    // Configuration
    const cfg = {
      group: name,
      caption: 'Vue Plugin Boilerplate'
    }

    // Register new state
    const state = {
      template: '<my-vue-directive></my-vue-directive>',
      // templateUrl: `vue_plugin_boilerplate/views/${name}.html`,
      name,
      url: '/vuePluginBoilerplate',
      data: cfg
    }

    $stateProvider.state(state)

    bbSettingsServiceProvider.addSettingsGroup({
      name: 'VuePluginBoilerplate',
      caption: 'Vue Plugin Boilerplate related settings',
      items: [
        {
          type: 'integer',
          name: 'buildLimit',
          caption: 'Number of builds to fetch',
          default_value: 200
        },
        {
          type: 'integer',
          name: 'changeLimit',
          caption: 'Number of changes to fetch',
          default_value: 30
        }
      ]
    })
  }
])

module.directive('myVueDirective', [
  '$q',
  '$window',
  'dataService',
  'bbSettingsService',
  'resultsService',
  '$uibModal',
  '$timeout',
  (
    $q,
    $window,
    dataService,
    bbSettingsService,
    resultsService,
    $uibModal,
    $timeout
  ) => {
    const settings = bbSettingsService.getSettingsGroup('VuePluginBoilerplate')

    function link(scope, element, attrs) {
      /* create an instance of the data accessor */
      var dataAccessor = dataService.open().closeOnDestroy(scope)
      console.log('dataccessor', dataAccessor)

      var builders = dataAccessor.getBuilders({
        order: '-builderid'
      })
      var builds = dataAccessor.getBuilds({
        limit: settings.buildLimit.value,
        order: '-started_at'
      })
      var buildrequests = dataAccessor.getBuildrequests({
        limit: settings.buildLimit.value,
        order: '-submitted_at'
      })
      var workers = dataAccessor.getWorkers({
        order: '-workerid'
      })
      var buildsets = dataAccessor.getBuildsets({
        limit: settings.buildLimit.value,
        order: '-submitted_at'
      })
      var changes = dataAccessor.getChanges({
        limit: settings.changeLimit.value,
        order: '-changeid'
      })
      var changesources = dataAccessor.getChangesources({
        limit: 50,
        order: '-changesourceid'
      })
      var sourcestamps = dataAccessor.getSourcestamps({
        limit: 50,
        order: '-ssid'
      })

      var props = {
        maxDate: new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate(),
          0,
          0,
          0
        ),
        builders,
        builds,
        buildrequests,
        workers,
        buildsets,
        changes,
        changesources,
        sourcestamps
      }

      var ComponentClass = Vue.extend(ChangesList)

      /* cannot pass the changes directly, as the magic of buildbot 
          data module clashes with the magic of vue observers */
      var data = {
        builders: [],
        builds: [],
        buildrequests: [],
        workers: [],
        buildsets: [],
        changes: [],
        changesources: [],
        sourcestamps: []
      }

      var e = new ComponentClass({
        data: data,
        el: element.get(0)
      })

      function update() {
        data.builders = builders.slice()
        data.builds = builds.slice()
        data.buildrequests = buildrequests.slice()
        data.workers = workers.slice()
        data.buildsets = buildsets.slice()
        data.changes = changes.slice()
        data.changesources = changesources.slice()
        data.sourcestamps = sourcestamps.slice()
      }

      builders.onChange = () => update()
      builds.onChange = () => update()
      buildrequests.onChange = () => update()
      workers.onChange = () => update()
      buildsets.onChange = () => update()
      changes.onChange = () => update()
      changesources.onChange = () => update()
      sourcestamps.onChange = () => update()
    }

    return {
      link: link
    }
  }
])
