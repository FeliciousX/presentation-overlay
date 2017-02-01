import 'reset.css/reset.css'
import './style.css'

import Cycle from '@cycle/xstream-run'
import {makeDOMDriver, h} from '@cycle/dom'

import xs from 'xstream'

const drivers = {
  DOM: makeDOMDriver('#app')
}

function main (sources) {
  return {
    DOM: xs.of(h('h1', {}, 'Hello World'))
  }
}

Cycle.run(main, drivers)
