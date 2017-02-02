import xs from 'xstream'

import view from './view'

export default function main (sources) {
  return {
    DOM: xs.of({}).map(view)
  }
}
