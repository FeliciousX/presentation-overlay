import xs from 'xstream'

import Immutable from 'immutable'
import {propEq, prop} from 'ramda'

export default function model (action$) {
  const initialState = Immutable.fromJS({
    controls: true,
    viewportHeight: 0,
    topbar: { height: 60, style: { marginTop: 0 } },
    content: { style: { height: 0 } },
    footer: { style: { height: 214 } }
  })

  const viewportChange$ = action$
    .filter(propEq('type', 'viewport-change'))
    .map(prop('payload'))
    .map(viewportHeight => function (state) {
      return state.set('viewportHeight', viewportHeight)
        .set('controls', true)
        .setIn(['topbar', 'style', 'marginTop'], 0)
        .updateIn(['content', 'style', 'height'], height =>
          viewportHeight - state.getIn(['footer', 'style', 'height']) - state.getIn(['topbar', 'height'])
        )
    })

  const hideControl$ = action$
    .filter(propEq('type', 'content-mouseenter'))
    .mapTo(function (state) {
      return state.set('controls', false)
        .updateIn(['topbar', 'style', 'marginTop'], marginTop => -state.getIn(['topbar', 'height']))
        .setIn(['content', 'style', 'height'], state.get('viewportHeight'))
    })

  const showControl$ = action$
    .filter(propEq('type', 'content-mousemove'))
    .map(prop('payload'))
    .filter(ev => ev.clientY > 400)
    .mapTo(function (state) {
      return state.set('controls', true)
        .setIn(['topbar', 'style', 'marginTop'], 0)
        .updateIn(['content', 'style', 'height'], height =>
          state.get('viewportHeight') - state.getIn(['footer', 'style', 'height']) - state.getIn(['topbar', 'height'])
        )
    })

  const reducer$ = xs.merge(
    viewportChange$,
    hideControl$,
    showControl$
  )

  return reducer$.fold((state, reducer) => reducer(state), initialState)
    .map(m => m.toJS())
    .drop(1)
}
