import xs from 'xstream'
import {propEq, prop} from 'ramda'

export default function model (action$) {
  const initialState = {
    controls: true,
    viewportHeight: 0,
    topbar: { height: 60, style: { marginTop: 0 } },
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
            marginTop: 0
          }
        },
        content: {
          ...state.content,
          style: {
            ...state.content.style,
            height: viewportHeight - state.footer.style.height - state.topbar.height
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
            marginTop: -state.topbar.height
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
            marginTop: 0
          }
        },
        content: {
          ...state.content,
          style: {
            ...state.content.style,
            height: state.viewportHeight - state.footer.style.height - state.topbar.height
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
