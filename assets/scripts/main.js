document.addEventListener('DOMContentLoaded', function(event) {
  const TorrentTable = document.querySelector('#TorrentTable')
  const SearchInput = document.querySelector('#SearchInput')

  const BaseURL = 'https://torrents.ohys.net/t/'
  const CurrentURL = new URL(window.location.href)

  const ResolutionPattern = /\d{3,4}x\d{3,4}/

  const ListType = 'new'

  function appendTable(toAppend) {
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

  function clearTable() {
    TorrentTable.innerHTML = ''
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

  // Automattical job
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
