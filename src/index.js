import 'reset.css/reset.css'
import './style.css'

import fromEvent from 'xstream/extra/fromEvent'

const viewportHeight$ = fromEvent(window, 'resize')
  .map(ev => ev.target.innerHeight)
  .startWith(window.innerHeight)

function next (height) {
  console.log(height)
  const contentEl = document.getElementById('content')
  contentEl.style.height = `${height}px`
}

viewportHeight$.addListener({next})

