const BaseURL = 'https://app.seia.io/Ohys-Fanmade/'
const OriginalURL = 'https://torrents.ohys.net/t/'

const ResolutionPattern = /\d{3,4}x\d{3,4}/

let ViewList = 'new'
let ViewPage = 0
let ViewLast = { name: '', uri: '' }
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
  return new Promise(function(resolve, reject) {
    let request = new XMLHttpRequest()

    request.open('GET', url, false)
    request.setRequestHeader(
      'Content-Type', 'application/x-www-form-urlencoded; Charset=utf-8'
    )

    request.send(null)
    if (request.readyState === 4  && request.status === 200) {
      resolve(request.responseText)
    } else {
      reject(request.status)
    }
  })
}

function makeList(options) {
  const SearchInput = document.querySelector('#SearchInput')
  const DirSelector = document.querySelector('#DirSelector')

  if (DirSelector.value !== ViewList) {
    ViewList = DirSelector.value
    ViewPage = 0
  }

  let RequestURL =
    BaseURL + 'json.php?' +
    'dir=' + (DirSelector.value || ViewList) +
    '&p=' + ViewPage
  if (options.includeInput && SearchInput.value !== '') RequestURL += ('&q=' + SearchInput.value)
  if (options.clearTable) clearTable('Loading...')

  requestData(RequestURL).then(function(buffer) {
    if (options.clearTable) clearTable('')
    const data = JSON.parse(buffer)

    if (data[0]) {
      if (ViewLast.name === data[0].t && ViewLast.uri !== RequestURL) {
        alert('End of results! There is no more data to append.')
        return
      }
      ViewLast = {
        name: data[0].t,
        uri: RequestURL
      }

      data.forEach(function(torrent) {
        const TorrentName = torrent.t
        const Resolution = TorrentName.match(ResolutionPattern) || 'Not recognized'
        const DownloadLink = '<a href="' + OriginalURL + torrent.a + '">Download</a>'

        appendTable({
          torrent: TorrentName,
          resolution: Resolution,
          download: DownloadLink
        })
      })
    } else {
      if (options.clearTable) clearTable('No results.')
    }
  })
}

function rebuildList(options) {
  ViewList = options.ViewList || ViewList
  ViewPage = options.ViewPage || ViewPage

  makeList({
    includeInput: false,
    clearTable: true
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
