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

  const contentMouseEnter$ = sources.DOM.select('#content').events('mouseenter')
    .mapTo({ type: 'content-mouseenter' })

  const contentMouseMove$ = sources.DOM.select('#content').events('mousemove')
    .map(ev => ({
      type: 'content-mousemove',
      payload: ev
    }))

  return xs.merge(
    viewportHeight$,
    contentMouseEnter$,
    contentMouseMove$
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
        controls: true,
        topbar: {
          ...state.topbar,
          style: {
            ...state.topbar.style,
            height: 60
          }
        },
        content: {
          ...state.content,
          style: {
            ...state.content.style,
            height: viewportHeight - state.footer.style.height - state.topbar.style.height
          }
        }
      }
    })

  const hideControl$ = action$
    .filter(propEq('type', 'content-mouseenter'))
    .mapTo(function (state) {
      return {
        ...state,
        controls: false,
        topbar: {
          ...state.topbar,
          style: {
            ...state.topbar.style,
            height: 0
          }
        },
        content: {
          ...state.content,
          style: {
            ...state.content.style,
            height: state.viewportHeight
          }
        }
      }
    })

  const showControl$ = action$
    .filter(propEq('type', 'content-mousemove'))
    .map(prop('payload'))
    .filter(ev => ev.clientY > 400)
    .mapTo(function (state) {
      return {
        ...state,
        controls: true,
        topbar: {
          ...state.topbar,
          style: {
            ...state.topbar.style,
            height: 60
          }
        },
        content: {
          ...state.content,
          style: {
            ...state.content.style,
            height: state.viewportHeight - state.footer.style.height - state.topbar.style.height
          }
        }
      }
    })

  const reducer$ = xs.merge(
    viewportChange$,
    hideControl$,
    showControl$
  )

  return reducer$.fold((state, reducer) => reducer(state), initialState)
    .drop(1)
}
