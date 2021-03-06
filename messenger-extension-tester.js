var el = document.createElement('div')
el.innerHTML = ` <style>
  * {
    box-sizing: border-box;
  }

  html, body {
    margin: 0;
    background: #888;
    color: white;
    font-family: segoe ui, helvetica neue, helvetica, sans-serif;
  }

  body {
    padding: 15px;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  .container {
    position: relative;
    border-radius: 3px;
    width: 405px;
    background: white;
    transition: opacity .3s, transform .3s;
  }

  .closed {
    transform: scale(.01);
    opacity: 0;
  }

  .header {
    padding: 15px 0;
    min-height: 3em;
    text-align: center;
  }

  .title {
    font-weight: bold;
    color: black;
  }

  .header::after {
    content: '';
    position: absolute;
    top: 12px;
    left: 20px;
    border-radius: 50%;
    width: 25px;
    height: 25px;
    background: #ccc;
  }

  small {
    font-size: 12px;
    display: block;
  }

  .card {
    border-radius: 3px;
    overflow: hidden;
  }

  .card + .card {
    margin-top: 1rem;
  }

  .frame {
    border-radius: 0 0 3px 3px;
    overflow: hidden;
  }

  iframe {
    position: relative;
    z-index: 2;
    display: block;
    border-radius: 0 0 3px 3px;
    width: 100%;
    transition: padding .3s;
  }

  .container--ext iframe {
    height: calc(100vh - 75px);
  }

  .container--cards iframe {
    height: 100%;
  }

  .resizer {
    position: absolute;
    z-index: 1;
    bottom: -15px;
    left: -15px;
    right: -15px;
    top: 50%;
  }

  .resizer::after {
    content: '';
    position: absolute;
    right: 6px;
    bottom: 6px;
    width: 1em;
    height: 1em;
    border: 3px solid #bbb;
    border-width: 0 3px 3px 0;
    border-radius: 0 0 6px 0;
    transition: border-color .2s;
  }
  .resizer:hover::after {
    border-color: #fff;
  }

  aside {
    position: absolute;
    top: 15px;
    left: 435px;
    width: calc(100vw - 450px);
    max-width: 300px;
  }

  input[type=text] {
    display: block;
    border: 0;
    border-radius: 3px;
    margin: 0;
    padding: .25em .5rem;
    line-height: 1.5em;
    height: 2em;
    width: 100%;
    font-size: inherit;
    background: #555;
    color: white;
    outline: 0;
  }

  input.location {
    margin-bottom: 1em;
  }

  .pages {
    margin-bottom: 1em;
    border-radius: 3px;
    font-size: 14px;
    background: #555;
    color: white;
  }

  .pages a {
    display: block;
    padding: 2px .5rem;
  }
  .pages a:first-child {
    padding-top: .5em;
  }
  .pages a:last-child {
    padding-bottom: .5em;
  }

  .pages a:hover {
    background: #333;
  }

  .bases,
  .cards,
  .psids {
    margin: 0 -.2em 1em;
  }

  .btn {
    border: 0;
    border-radius: 3px;
    margin: 0 .2em;
    padding: .25em .5rem;
    line-height: 1.5em;
    font-size: inherit;
    background: #555;
    color: white;
    outline: 0;
  }

  .btn:hover,
  .btn.active {
    background: #333;
  }

  .section,
  section {
    display: block;
    margin-bottom: 1em;
    border-radius: 3px;
    padding: .5rem;
    font-size: 12px;
    background: #555;
  }

  .section button {
    margin-top: 5px;
    border: 0;
    font-size: inherit;
    background: #777;
    color: white;
  }

  .container--cards {
    display: none;
  }
  .tab--cards .container {
    display: none;
  }
  .tab--cards .container--cards {
    display: block;
  }

/*
  @media (min-width: 700px) {
    .container {
      margin: auto;
    }
    aside {
      left: calc(50vw + 220px);
      width: calc(50vw - 235px);
    }
  }*/
  </style>
  <div class="container container--ext">
    <div class="header">
      <span class="title">Messenger extension tester</span>
    </div>
    <div class="frame">
      <iframe frameborder="0" name="iframe"></iframe>
      <div class="resizer" onmousedown="mouseDown(event)"></div>
    </div>
  </div>
  <div class="container container--cards">
    <div class="header">
      <span class="title">Card tester</span>
    </div>
    <div class="frame"></div>
  </div>
  <aside>
    <div>
      <input type="text" class="location" oninput="setLocation(event.target.value)" />
    </div>
    <div class="psids"></div>
    <div class="bases"></div>
    <div class="cards"></div>
    <div class="pages"></div>
    <div class="events"></div>
    <div class="section dimensions">
      Width: <span class="width"></span>
      &nbsp;
      Height: <span class="height"></span>
      <div>
        <button onclick="setWidth(320);setHeight(504)">iPhone 5</button>
        <button onclick="setWidth(375);setHeight(604)">iPhone 6</button>
        <button onclick="setWidth(405);setHeight(604)">messenger.com</button>
        <button onclick="setWidth(414);setHeight(660)">iPhone 6+</button>
        <button onclick="setWidth(768);setHeight(900)">iPad</button>
      </div>
    </div>
    <div class="section">
      <input type="checkbox" class="confirm" onchange="toggleConfirm()" /> Always confirm
      <input type="checkbox" class="tab" onchange="toggleTab()" /> Show cards
    </div>
  </aside>`

const defaultContext = {
  name: 'default',
  psid: 'defaultpsid',
  thread_type: 'USER_TO_PAGE',
  tid: 'defaultcontext',
  signed_request: 'invalid signed request'
}

setTimeout(() => {
  init()
}, 200)

let elem, iframe, interval
function init () {
  document.body.appendChild(el)
  iframe = document.querySelector('iframe')
  elem = {
    cardsFrame: document.querySelector('.container--cards .frame'),
    events: document.querySelector('.events'),
    bases: document.querySelector('.bases'),
    pages: document.querySelector('.pages'),
    cards: document.querySelector('.cards'),
    psids: document.querySelector('.psids'),
    container: document.querySelector('.container'),
    title: document.querySelector('.title'),
    location: document.querySelector('.location'),
    width: document.querySelector('.width'),
    height: document.querySelector('.height'),
    confirm: document.querySelector('.confirm'),
    tab: document.querySelector('.tab'),
    aside: document.querySelector('aside'),
  }

  // Prepare ME shim
  window.userMessengerExtensions = window.MessengerExtensions
  delete window.MessengerExtensions
  Object.defineProperty(window, 'MessengerExtensions', {
    get() {
      setTimeout(() => {
        if (iframe.contentWindow.extAsyncInit && !iframe.contentWindow.extAsyncInit.hasRun) {
          iframe.contentWindow.extAsyncInit.hasRun = true
          iframe.contentWindow.extAsyncInit()
          iframe.contentWindow.addEventListener('focusin', focusinHandler)
          iframe.contentWindow.addEventListener('focusout', focusoutHandler)
          startLocationPolling()

          // Hide scrollbars
          var css = '::-webkit-scrollbar {     display: none; }'
          var style = document.createElement('style');
          style.type = 'text/css';
          style.appendChild(document.createTextNode(css));
          iframe.contentDocument.head.appendChild(style)
        }
      }, 1)
      return fakeMessengerExtensions()
    }
  })

  loadCards()

  loadBases()

  loadPages()

  loadContexts()

  loadDimensions()

  setDimensions()
  window.onresize = setDimensions

  loadSettings()

  visitFirstPage()
}

function loadCards() {
  var cards = window.cards || []
  if (cards.length && !cards.find(c => c.url === localStorage.testerCard)) {
    localStorage.testerCard = cards[0].url
  } else if (!cards.length) {
    return
  }

  if (cards.length > 1) {
    elem.cards.innerHTML = cards
      .map(card => `<button class="btn" onclick="setCard(event)" data-card="${card.url}" class="${localStorage.testerCard === card.url ? 'active' : ''}">${card.name}</button>`)
      .join('')
    elem.cardActive = elem.cards.querySelector('.active')
  } else {
    elem.cards.innerHTML = ''
  }

  if (cards.length) {
    elem.cardsFrame.innerHTML = cards
      .map(card => `<div class="card" style="height:${card.height}px;">
        <iframe frameborder="0" name="iframe" src="${localStorage.testerBase || ''}${card.url}"></iframe>
      </div>`)
      .join('')
  }
}

function setCard(event) {
  localStorage.testerCard = event.target.dataset.card
  card.src = localStorage.testerCard
  if (elem.cardActive) {
    elem.cardActive.classList.remove('active')
  }
  elem.cardActive = event.target
  event.target.classList.add('active')
}

function loadBases() {
  var bases = window.bases || ['']
  if (bases.length > 1) {
    elem.bases.innerHTML = bases
      .map(base => `<button class="btn" onclick="setBase(event)" data-base="${base.url}" class="${localStorage.testerBase === base.url ? 'active' : ''}">${base.name}</button>`)
      .join('')
    elem.baseActive = elem.bases.querySelector('.active')
  } else {
    elem.bases.innerHTML = ''
  }
}

function setBase(event) {
  localStorage.testerBase = event.target.dataset.base
  setLocation(localStorage.testerBase + iframe.contentWindow.location.pathname)
  loadCards()
  if (elem.baseActive) {
    elem.baseActive.classList.remove('active')
  }
  elem.baseActive = event.target
  event.target.classList.add('active')
}

function loadPages() {
  elem.pages.innerHTML = (window.pages || ['/'])
    .map(page => `<a href="${page}" target="iframe">${page}</a>`)
    .join('')
}

function loadContexts() {
  elem.psids.innerHTML = (window.contexts || [defaultContext])
    .map(context => `<button class="btn" onclick="setPsid(event)" data-psid="${context.psid}" class="${localStorage.testerPsid === context.psid ? 'active' : ''}">${context.name}</button>`)
    .join('')
  elem.psidActive = elem.psids.querySelector('.active')
}

function setPsid(event) {
  localStorage.testerPsid = event.target.dataset.psid || ('test' + Math.random().toString())
  iframe.contentWindow.location.reload()
  if (elem.psidActive) {
    elem.psidActive.classList.remove('active')
  }
  elem.psidActive = event.target
  event.target.classList.add('active')
}

function loadDimensions() {
  if (localStorage.testerWidth) {
    setWidth(localStorage.testerWidth)
  }
  if (localStorage.testerHeight) {
    setHeight(localStorage.testerHeight)
  }
}

function setDimensions() {
  elem.width.innerText = frameWidth = iframe.clientWidth
  elem.height.innerText = frameHeight = iframe.clientHeight
}

function setWidth(width) {
  localStorage.testerWidth = width
  elem.container.style.width = width + 'px'
  elem.container.nextElementSibling.style.width = width + 'px'
  elem.aside.style.left = (parseInt(width) + 30) + 'px'
  setDimensions()
}

function setHeight(height) {
  localStorage.testerHeight = height
  iframe.style.height = height + 'px'
  setDimensions()
}

function loadSettings() {
  if (localStorage.testerConfirm) {
    elem.confirm.checked = true
  }
  if (localStorage.testerTab) {
    elem.tab.checked = true
    document.body.className = 'tab--' + localStorage.testerTab
  }
}

function toggleConfirm() {
  localStorage.testerConfirm = elem.confirm.checked ? 'checked' : ''
}

function toggleTab() {
  localStorage.testerTab = elem.tab.checked ? 'cards' : ''
  document.body.className = 'tab--' + localStorage.testerTab
}

function visitFirstPage() {
  const url = localStorage.testerLocation || window.pages && window.pages[0] || '/'
  elem.location.value = url
  iframe.src = url
}

function getLocation() {
  if (elem.container.classList.contains('closed') && iframe.contentWindow.location.pathname !== 'blank') {
    elem.container.classList.remove('closed')
  }
  elem.title.innerText = iframe.contentDocument.title
  elem.location.value = iframe.contentWindow.location.pathname
}

function setLocation(url) {
  iframe.src = url
  localStorage.testerLocation = url
}

function focusinHandler(evt) {
  if (evt.target.tagName === 'INPUT' && !['radio', 'checkbox', 'button', 'submit'].includes(evt.target.type)) {
    iframe.style.paddingBottom = (iframe.clientHeight / 2) + 'px'
    setDimensions()
  }
}

function focusoutHandler(evt) {
  if (evt.target.tagName === 'INPUT') {
    setTimeout(() => {
      iframe.style.paddingBottom = '0'
      setDimensions()
    }, 500)
  }
}

function startLocationPolling(evt) {
  clearInterval(interval)
  getLocation()
  interval = setInterval(getLocation, 500)
}

let lastPageX = 0, lastPageY = 0, frameWidth, frameHeight

function mouseDown (evt) {
  evt.preventDefault()
  iframe.style.pointerEvents = 'none'
  document.addEventListener('mousemove', mouseMove)
  document.addEventListener('mouseup', mouseUp)
  document.addEventListener('mouseleave', mouseUp)
}

function mouseMove (evt) {
  const newWidth = frameWidth + evt.pageX - lastPageX
  if (newWidth >= 280) {
    if (lastPageX && frameWidth) {
      setWidth(newWidth)
    }
    lastPageX = evt.pageX
  }

  const newHeight = frameHeight + evt.pageY - lastPageY
  if (newHeight >= 280) {
    if (lastPageY && frameHeight) {
      setHeight(newHeight)
    }
    lastPageY = evt.pageY
  }
}

function mouseUp (evt) {
  lastPageX = 0
  lastPageY = 0
  document.removeEventListener('mousemove', mouseMove)
  document.removeEventListener('mouseup', mouseUp)
  document.removeEventListener('mouseleave', mouseUp)
  iframe.style.pointerEvents = null
}

function fakeMessengerExtensions() {
  return Object.assign({
    getContext(id, success, err) {
      const context = window.contexts && window.contexts.length
        ? window.contexts.find(c => c.psid === localStorage.testerPsid) || window.contexts[0]
        : defaultContext
      console.debug('getContext', context)
      success(context)
    },
    askPermission(success, error, perm) {
      console.debug('askPermission')
      setTimeout(function() {
        if (quickConfirm('Grant permission to ' + perm + '?')) {
          success({
            isGranted: true,
            permissions: [perm],
          })
        } else {
          error()
        }
      }, 300)
    },
    beginShareFlow(success, error, message, mode) {
      console.debug('beginShareFlow', message, mode)
      try {
        message = message.attachment.payload.elements[0].default_action.url
      } catch(e){}
      setTimeout(function() {
        if (quickConfirm(message)) {
          success({
            is_sent: true
          })
        } else {
          success({
            is_sent: false
          })
        }
      }, 300)
    },
    requestCloseBrowser() {
      console.log('requestCloseBrowser')
      iframe.src = ''
      elem.container.classList.add('closed')
    }
  }, window.userMessengerExtensions || {})
}

function quickConfirm(msg) {
  var link
  if (typeof msg === 'string' && msg.startsWith('http')) {
    link = '<a href="' + msg + '" target="iframe">' + msg + '</a>'
  }
  if (msg && typeof msg === 'object') {
    msg = JSON.stringify(msg)
  }
  elem.events.classList.add('section')
  elem.events.innerHTML += '<div>' + (link || msg) + '</div>'
  if (localStorage.testerConfirm) {
    return true
  } else {
    return confirm(msg)
  }
}
