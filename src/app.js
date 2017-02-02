import xs from 'xstream'
import {propEq, prop} from 'ramda'

import view from './view'

export default function main (sources) {
  const action$ = intent(sources)
  const state$ = model(action$)
  return {
    DOM: state$.map(view)
  }
}

function intent (sources) {
  const viewportHeight$ = sources.window.events('resize')
    .map(ev => ev.target.innerHeight)
    .startWith(window.innerHeight)
    .map(payload => ({
      type: 'viewport-change',
      payload
    }))

  return xs.merge(
    viewportHeight$
  )
}

function model (action$) {
  const initialState = {
    controls: true,
    viewportHeight: 0,
    topbar: { style: { height: 60 } },
    content: { style: { height: 0 } },
    footer: { style: { height: 214 } }
  }

  const viewportChange$ = action$
    .filter(propEq('type', 'viewport-change'))
    .map(prop('payload'))
    .map(viewportHeight => function (state) {
      return {
        ...state,
        viewportHeight,
        content: {
          ...state.content,
          style: {
            ...state.content.style,
            height: state.controls ? viewportHeight - state.footer.style.height : viewportHeight
          }
        }
      }
    })

  const reducer$ = xs.merge(
    viewportChange$
  )

  return reducer$.fold((state, reducer) => reducer(state), initialState)
    .drop(1)
}
