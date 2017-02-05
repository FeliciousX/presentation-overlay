import xs from 'xstream'

export default function intent (sources) {
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
