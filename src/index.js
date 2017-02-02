import 'reset.css/reset.css'
import './style.css'

import Cycle from '@cycle/xstream-run'
import {makeDOMDriver} from '@cycle/dom'

import main from './app'

import fromEvent from 'xstream/extra/fromEvent'

function makeEventDriver (Node) {
  return function eventDriver () {
    return {
      events: (eventName) => fromEvent(Node, eventName)
    }
  }
}

const drivers = {
  DOM: makeDOMDriver('#app'),
  window: makeEventDriver(window)
}

window.requestAnimationFrame(() => Cycle.run(main, drivers))
