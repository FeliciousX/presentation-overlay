import {div, section} from '@cycle/dom'

export default (state) =>
  div({ props: { id: 'wrapper' } }, [
    div({ props: { id: 'topbar' } }, 'Title'),
    div({ props: { id: 'content' } }, [
      section('Hello World')
    ]),
    div({ props: { id: 'footer' } }, 'Footer')
  ])
