import Vue from 'vue'
import Component from 'vue-class-component'
import { Change, Build } from 'BuildbotJsonInterfaces'

class SampleVueComponentProps {
  changes: Change[]
}

class ChangeRowProps {
  change: Change
}

@Component({
  template: '<button @click="onClick">Click!</button>'
})
export default class MyComponent extends Vue {
  message: string = 'Hello!'

  onclick(): void {
    window.alert(this.message)
  }
}
