import intent from './intent'
import model from './model'
import view from './view'

export default function main (sources) {
  const action$ = intent(sources)
  const state$ = model(action$)
  return {
    DOM: state$.map(view)
  }
}

