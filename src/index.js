import 'reset.css/reset.css'
import './style.css'

import Cycle from '@cycle/xstream-run'
import {makeDOMDriver} from '@cycle/dom'

import main from './app'

const drivers = {
  DOM: makeDOMDriver('#app')
}

Cycle.run(main, drivers)
