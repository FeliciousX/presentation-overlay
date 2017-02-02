import {div, section} from '@cycle/dom'

export default ({topbar, content, footer}) =>
  div({ props: { id: 'wrapper' } }, [
    div({
      props: { id: 'topbar' },
      style: {
        ...topbar.style,
        height: `${topbar.style.height}px`
      }
    }, 'Title'),
    div({
      props: { id: 'content' },
      style: {
        ...content.style,
        height: `${content.style.height}px`
      }
    }, [
      section('Hello World')
    ]),
    div({
      props: { id: 'footer' },
      style: {
        ...footer.style,
        height: `${footer.style.height}px`
      }
    }, 'Footer')
  ])
