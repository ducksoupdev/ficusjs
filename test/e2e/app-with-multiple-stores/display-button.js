import {html, createComponent, withStore} from '../util/component.js'
import { store } from './store.js'

createComponent(
  'display-button',
  withStore(store, {
    computed: {
      count () {
        return this.store.count.state.count
      }
    },
    render () {
      return html`<div>You have clicked ${this.count} times!</div>`
    }
  })
)