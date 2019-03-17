const BaseURL = 'https://ohys.seia.io/'
const OriginalURL = 'https://torrents.ohys.net/t/'
const DirectoryPatturnScope = {
  '2019 (New)': 'new',
  '2018': 'old18',
  '2017': 'old17',
  '2016': 'old16'
}
const ResolutionPatturnScope = {
  'all resolution': /\d{3,4}x\d{3,4}/,
  '1080P (FHD)': /1920x1080/,
  '720P (HD)': /1280x720/,
  '576P (DVD)': /1024x576/,
  '480P (SD)': /640×480p/
}

let ViewPage = 0

function toggleSidebar() {
  $('.ui.sidebar')
    .sidebar('toggle')
  ;
}

function setCookie(name, value, days) {
  let expires = ''

  if (days) {
    const Time = new Date()

    Time.setTime(Time.getTime() + (days * 24 * 60 * 60 * 1000))
    expires = '; expires=' + Time.toUTCString()
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/'
}

function getCookie(name) {
  let nameEqual = name + '='
  let ca = document.cookie.split(';')

  for (var i = 0; i < ca.length; i++) {
    let c = ca[i]

    while (c.charAt(0) == ' ') {
      c = c.substring(1, c.length)
      if (c.indexOf(nameEqual) == 0) return c.substring(nameEqual.length, c.length)
    }
  }
  return null
}

function eraseCookie(name) {
  document.cookie = name + '=; Max-Age=-99999999;'
}

function appendList(item) {
  const List = $('#resultList')

  const Outer = $('<div/>', {
    class: 'item'
  })
  const Inner = $('<div/>', {
    class: 'header',
    text: item.name
  })
  const Link = $('<a/>', {
    href: item.link,
    text: 'Download ' + '(' + item.resolution + ')'
  })

  Inner.add(Link).appendTo(Outer.appendTo(List))
}

function makeRequestURI(options) {
  let RequestURL = BaseURL + 'json.php?' +
    'dir=' + options.dir + '&' +
    'p=' + options.p

  if (options.q !== '') RequestURL += '&q=' + options.q
  return RequestURL
}

function requestData(url) {
  let request = new XMLHttpRequest()

  request.open('GET', url, false)
  request.setRequestHeader(
    'Content-Type', 'application/x-www-form-urlencoded; Charset=utf-8'
  )

  request.send(null)
  if (request.readyState === 4  && request.status === 200) {
    return request.responseText
  } else {
    return request.status
  }
}

function makeList() {
  const requestURI = makeRequestURI({
    dir: DirectoryPatturnScope[$('#dirSelector').dropdown('get value') || '2019 (New)'],
    p: ViewPage,
    q: document.querySelector('#searchInput').value
  })
  const data = JSON.parse(requestData(requestURI))

  document.querySelector('#AppendButton').style.visibility = 'visible'

  if (ViewPage === 0) {
    clearList()
  }
  if (data[0]) {
    if (data.length < 30) {
      document.querySelector('#AppendButton').style.visibility = 'hidden'
    }
    data.forEach(function(item) {
      if (item.t.match(ResolutionPatturnScope[$('#resolutionSelector').dropdown('get value').toUpperCase() || 'all resolution'])) {
        appendList({
          name: item.t,
          resolution: item.t.match(ResolutionPatturnScope['all resolution']),
          link: OriginalURL + item.a
        })
      }
    })
  } else {
    clearList('No result')

    document.querySelector('#AppendButton').style.visibility = 'hidden'
  }
}

function clearList(asText) {
  const List = $('#resultList')

  List.text(asText || '')
}

function downloadList() {
  const Links = $('#resultList a')

  for (var i = 0; i < Links.length; i++) {
    setTimeout(function(el) {
      window.location = el.href
    }, 900 + i * 900, Links[i])
  }
}

$(document).ready(function () {
  makeList()
})
