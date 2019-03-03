const BaseURL = 'https://app.seia.io/Ohys-Fanmade/'
const CurrentURL = new URL(window.location.href)

const ResolutionPattern = /\d{3,4}x\d{3,4}/

const ListType = 'new'

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

function searchTorrent() {
  const SearchInput = document.querySelector('#SearchInput')
  clearTable('Searching torrents...')

  requestData(
    BaseURL + 'json.php?' +
    'p=' + CurrentURL.searchParams.get('page') +
    '&dir=' + ListType +
    '&q=' + SearchInput.value
  ).then(buffer => {
    clearTable()

    const data = JSON.parse(buffer)
    if (data[0]) {
      data.forEach(torrent => {
        const TorrentName = torrent.t
        const Resolution = TorrentName.match(ResolutionPattern) || 'Not recognized'
        const DownloadLink = '<a href="' + BaseURL + torrent.a + '">Download</a>'

        appendTable({
          torrent: TorrentName,
          resolution: Resolution,
          download: DownloadLink
        })
      })
    } else {
      clearTable('No results.')
    }
  })
}

document.addEventListener('DOMContentLoaded', function(event) {
  requestData(
    BaseURL + 'json.php?' +
    'p=' + CurrentURL.searchParams.get('page') +
    '&dir=' + ListType
  ).then(buffer => {
    const data = JSON.parse(buffer)

    data.forEach(torrent => {
      const TorrentName = torrent.t
      const Resolution = TorrentName.match(ResolutionPattern) || 'Not recognized'
      const DownloadLink =
        '<a href="' + BaseURL + torrent.a + '">Download</a>'

      appendTable({
        torrent: TorrentName,
        resolution: Resolution,
        download: DownloadLink
      })
    })
  })
})
