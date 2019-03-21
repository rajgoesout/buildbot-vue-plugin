
// import { SampleReactComponent } from "./SampleReactComponent"
// import * as React from 'react';
// import * as ReactDOM from 'react-dom';
import Vue from 'vue'
// import { Hello } from './Hello.vue'
// import SampleVueComponent from './SampleVueComponent'

console.log ( "Hello from Rajdeep's Vue Buildbot!" )


// Register new module
class VuePluginBoilerplate {
    constructor() {
        return [
            'ui.router',
            'ui.bootstrap',
            'ui.bootstrap.popover',
            'ngAnimate',
            'guanlecoja.ui',
            'bbData'
        ];
    }
}

class VuePluginBoilerplateConfig {
    constructor($stateProvider, glMenuServiceProvider, bbSettingsServiceProvider, config) {

        // Config object coming in from the master.cfg
        //console.log( "config", config )

        // Name of the state
        const name = 'VuePluginBoilerplate';

        // Menu configuration
        glMenuServiceProvider.addGroup({
            name,
            caption: 'Vue Plugin Boilerplate',
            icon: 'question-circle',
            order: 0
        });

        // Configuration
        const cfg = {
            group: name,
            caption: 'Vue Plugin Boilerplate'
        };

        // Register new state
        const state = {
            controller: "VuePluginBoilerplateController",
            controllerAs: "c",
            template: "<div id='vueContent'><sample-component></sample-component></div>",
            //templateUrl: `vue_plugin_boilerplate/views/${name}.html`,
            name,
            url: "/VuePluginBoilerplate",
            data: cfg
        };

        $stateProvider.state(state);

        // bbSettingsServiceProvider.addSettingsGroup({ 
        //     name: 'VuePluginBoilerplate',
        //     caption: 'Vue Plugin Boilerplate related settings',
        //     items: [{
        //         type: 'integer',
        //         name: 'buildLimit',
        //         caption: 'Number of builds to fetch',
        //         default_value: 500
        //     }
        //     ]});
    }
}

class VuePluginBoilerplateController {
    constructor($scope, $element, $q, $window, dataService, bbSettingsService, resultsService,
        $uibModal, $timeout) {
    
        // Find the div.vueContent in the template (note, this is some kind 
        //  of angular data structure, not an actual dom element.
        const vueContentElement = $element.find('#vueContent');
        // This is an actual DOM element that React needs 
        this.vueRawElement = angular.element(vueContentElement).get(0);

        this.dataAccessor = dataService.open().closeOnDestroy($scope)

        this.changeLimit = 50;

        this.changes = this.dataAccessor.getChanges({limit: this.changeLimit, order: '-changeid'})

		this.changes.onChange = () => this.update()
        
        this.renderVue();

    }

    update() {
    	console.log ("Updating Vue View");

    	// your plugin might do some stuff in here to massage the data into a more
    	//  view-amenable form before calling the render function

    	this.renderVue();
    }

    renderVue() {
	    var props = {changes: this.changes}

        // ReactDOM.render(
        //     React.createElement(SampleReactComponent, props, null),
        //       this.vueRawElement
        // );
        var SampleComp = {
            data: function(){
                return{
                    count: 0
                }
            },
            template: '<p>hello {{ count }}</p>'
          }
        new Vue({
            el: this.vueRawElement,
            components: {
                'sample-component': SampleComp
            }
        })
        // new Vue({
        //     render: h => h(Hello),
        // }).$mount(this.vueRawElement)
          
	}


}



angular.module('buildbot_vue_plugin_boilerplate', new VuePluginBoilerplate())
.config(['$stateProvider', 'glMenuServiceProvider', 'bbSettingsServiceProvider', 'config', VuePluginBoilerplateConfig])
.controller('vuePluginBoilerplateController', ['$scope', '$element', '$q', '$window', 'dataService', 'bbSettingsService', 'resultsService', '$uibModal', '$timeout', VuePluginBoilerplateController]);
