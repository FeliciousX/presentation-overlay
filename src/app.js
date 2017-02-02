import view from './view'

export default function main (sources) {
  const viewportHeight$ = sources.window.events('resize')
    .map(ev => ev.target.innerHeight)
    .startWith(window.innerHeight)

  const state$ = model(viewportHeight$).debug('help')
  return {
    DOM: state$.map(view)
  }
}

function model (viewportHeight$) {
  const initialState = {
    topbar: { style: { marginTop: 0, height: 60 } },
    content: { style: { height: 0 } },
    footer: { style: { height: 214 } }
  }

  const reducer$ = viewportHeight$
    .map(height => function (state) {
      return {
        ...state,
        content: {
          ...state.content,
          style: {
            ...state.content.style,
            height: height - state.footer.style.height
          }
        }
      }
    })

  return reducer$.fold((state, reducer) => reducer(state), initialState)
}
