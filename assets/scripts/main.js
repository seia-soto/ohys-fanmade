const BaseURL = 'https://ohys.seia.io/'
const OriginalURL = 'https://torrents.ohys.net/t/'

let ViewList = 'new'
let ViewPage = 0
let ViewMode = 1

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

function appendTable(toAppend) {
  const TorrentTable = document.querySelector('#TorrentTable')

  let newRow = TorrentTable.insertRow(TorrentTable.rows.length)
  let newCells = {
    torrent: newRow.insertCell(0),
    resolution: newRow.insertCell(1),
    download: newRow.insertCell(2)
  }

  newCells.torrent.innerHTML = toAppend.torrent
  newCells.resolution.innerHTML = toAppend.resolution
  newCells.download.innerHTML = toAppend.download
}

function clearTable(toShow) {
  const TorrentTable = document.querySelector('#TorrentTable')

  TorrentTable.innerHTML = toShow || ''
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

function makeRequestURI(options) {
  let RequestURL = BaseURL + 'json.php?' +
    'dir=' + options.dir + '&' +
    'p=' + options.p

  if (options.q !== '') RequestURL += '&q=' + options.q
  return RequestURL
}

function makeList(options) {
  const LoadmoreButton = document.querySelector('#LoadmoreButton')
  const ResolutionSelector = document.querySelector('#ResolutionSelector')
  const RequestURL = makeRequestURI({
    dir: document.querySelector('#DirSelector').value,
    p: ViewPage,
    q: document.querySelector('#SearchInput').value
  })
  const ResolutionPatturn = new RegExp(ResolutionSelector.value)

  const buffer = requestData(RequestURL)
  const data = JSON.parse(buffer)

  if (options.clearTable) clearTable('')
  if (data.length < 30) {
    LoadmoreButton.style.display = 'none'
  } else {
    LoadmoreButton.style.display = ''
  }

  data.forEach(function(torrent) {
    const TorrentName = torrent.t
    const Resolution = TorrentName.match(ResolutionPatturn)
    const DownloadLink = '<a href="' + OriginalURL + torrent.a + '">Download</a>'

    if (Resolution !== null) {
      appendTable({
        torrent: TorrentName,
        resolution: Resolution,
        download: DownloadLink
      })
    }
  })
}

function downloadList() {
  Object.values(TorrentTable.rows).forEach(function(row, i) {
    setTimeout(function() {
      window.location = row.querySelector('a').href
    }, 900 + i * 900)
  })
}

function switchTheme() {
  const Body = document.querySelector('body')
  const App = document.querySelector('#app')

  const SearchButton = document.querySelector('#SearchButton')
  const LoadmoreButton = document.querySelector('#LoadmoreButton')

  if (ViewMode == 0) {
    Body.style['background-color'] = '#232b2b'
    App.style.color = 'lightgrey'

    SearchButton.style.color = 'lightgrey'
    LoadmoreButton.style.color = 'lightgrey'

    ViewMode = 1
  } else {
    Body.style['background-color'] = 'white'
    App.style.color = 'black'

    SearchButton.style.color = 'black'
    LoadmoreButton.style.color = 'black'

    ViewMode = 0
  }
}

function setMode() {
  switchTheme()
  eraseCookie('nightmode')

  if (ViewMode == 0) {
    setCookie('nightmode', '1', 7)
  } else {
    setCookie('nightmode', '0', 7)
  }
}
