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
    controls: true,
    topbar: { style: { height: 60 } },
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
            height: state.controls ? height - state.footer.style.height : height
          }
        }
      }
    })

  return reducer$.fold((state, reducer) => reducer(state), initialState)
}
