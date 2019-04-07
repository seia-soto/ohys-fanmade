const BaseURL = 'https://ohys.seia.io/'
const OriginalURL = 'https://torrents.ohys.net/'
const DirectoryPatturnScope = {
  '2019 (NEW)': 'new',
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
const Translations = {
  en: {
    not_found: 'No torrent found with search options.',

    download: 'Download ',

    preparing_download: 'Preparing to download...',

    downloading: 'Downloading ',
    of: ' of ',
    torrents: 'torrents ',

    compressing_files: 'Compressing files...',

    download_list: 'Download list*',

    just_one_second: 'Just one second',
    error_occured: 'Error occured'
  },
  ko: {
    not_found: '검색 조건에 일치하는 토렌트가 없습니다.',

    download: '다운로드 ',

    preparing_download: '다운로드 준비 중...',

    downloading: '현재 ',
    of: '개 토렌트 다운로드됨, ',
    torrents: '개의 대기열',

    compressing_files: '파일 압축 중...',

    download_list: '리스트 다운로드*',

    just_one_second: '잠시만 기다려주세요',
    error_occured: '오류 발생'
  },
  ja: {
    not_found: '検索条件に一致するトレントがありません。',

    download: 'ダウンロード ',

    preparing_download: 'ダウンロード準備中...',

    downloading: '現在 ',
    of: '個のトレントダウンロード, ',
    torrents: '個のキュー',

    compressing_files: 'ファイル圧縮中...',

    download_list: 'リストダウンロード*',

    just_one_second: 'しばらくお待ちください',
    error_occured: 'エラー発生'
  }
}

let ViewPage = 0

function toggleModal() {
  $('.ui.modal')
    .modal('toggle')
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
    text: (Translations[language].download || 'Download ') + '(' + item.resolution + ')'
  })

  Inner.add(Link).appendTo(Outer.appendTo(List))
}

function prependList(item) {
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

  Inner.add(Link).appendTo(Outer.prependTo(List))
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
  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; Charset=utf-8')

  request.send(null)
  if (request.readyState === 4  && request.status === 200) {
    return request.responseText
  } else {
    return request.status
  }
}

function makeList() {
  const appendButton = document.querySelector('#AppendButton')
  const downloadButton = document.querySelector('#downloadButton')

  messageReset()

  const requestURI = makeRequestURI({
    dir: DirectoryPatturnScope[$('#dirSelector').dropdown('get value').toUpperCase() || '2019 (NEW)'],
    p: ViewPage,
    q: document.querySelector('#searchInput').value
  })
  const data = JSON.parse(requestData(requestURI))

  if (ViewPage === 0) {
    clearList()
  }
  if (data[0]) {
    if (data.length < 30) {
      appendButton.style.display = 'none'
    } else {
      appendButton.style.display = ''
    }
    downloadButton.style.display = ''

    data.forEach(function(item) {
      if (item.t.match(ResolutionPatturnScope[$('#resolutionSelector').dropdown('get value').toUpperCase() || 'all resolution'])) {
        appendList({
          name: item.t,
          resolution: item.t.match(ResolutionPatturnScope['all resolution']),
          link: OriginalURL + '/t/' + item.a
        })
      }
    })
    messageSuccess()
  } else {
    messageError(Translations[language].not_found || 'No torrent found with search options.')
  }
}

function clearList(asText) {
  const List = $('#resultList')

  List.text(asText || '')
}

function downloadList() {
  const LinksMap = document.querySelector('#resultList').getElementsByTagName('a')
  const Button = document.querySelector('#downloadButton')

  Button.disabled = true
  Button.innerHTML = Translations[language].preparing_download || 'Preparing to download...'

  const Compressed = new JSZip()

  let Links = Object.keys(LinksMap).map(function(k) {
    return LinksMap[k]
  })

  Links.forEach(function(el, i) {
    setTimeout(function() {
      Button.innerHTML = (Translations[language].downloading || 'Downloading ') +
        (i + 1) + (Translations[language].of || ' of ') +
        Links.length + (Translations[language].torrents || ' torrents')

      const File = {
        name: decodeURIComponent(el.href.split('/')[el.href.split('/').length - 1]),
        context: requestData(BaseURL + 'port.php?to=' + encodeURIComponent(el.href.replace(OriginalURL, '')))
      }
      Compressed.file(File.name, File.context)

      if (i === Links.length - 1) {
        Button.innerHTML = Translations[language].compressing_files || 'Compressing files'

        const Blob = Compressed.generate({ type: 'blob' })
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(Blob, 'ohys-fanmade-downloads-' + new Date().toUTCString() + '.zip')
        } else {
          let a = document.createElement('a')

          a.style = 'display: none'
          a.href = window.URL.createObjectURL(Blob)
          a.download = 'ohys-fanmade-downloads-' + new Date().toUTCString() + '.zip'
          a.click()
        }

        Button.innerHTML = Translations[language].download_list || 'Download list*'
        Button.disabled = false
      }
    }, 1000 + i * 1000)
  })
}

function messageSuccess() {
  const taskMessage = document.querySelector('#taskMessage')

  taskMessage.style.display = 'none'
}

function messageError(context, icon) {
  const appendButton = document.querySelector('#AppendButton')
  const downloadButton = document.querySelector('#downloadButton')
  const taskMessage = document.querySelector('#taskMessage')

  appendButton.style.display = 'none'
  downloadButton.style.display = 'none'

  taskMessage.classList.remove('info')
  taskMessage.classList.add(icon || 'error')

  taskMessage.querySelector('i').classList.remove('notched')
  taskMessage.querySelector('i').classList.remove('loading')
  taskMessage.querySelector('i').classList.add('exclamation')

  taskMessage.querySelector('.header').innerHTML = Translations[language].error_occured || 'Error occured'
  taskMessage.querySelector('p').innerHTML = context || 'There is no torrent to show up, if your connection to server lost, just refresh this site to reload.'

  taskMessage.style.display = ''
}

function messageReset(context) {
  const appendButton = document.querySelector('#AppendButton')
  const downloadButton = document.querySelector('#downloadButton')
  const taskMessage = document.querySelector('#taskMessage')

  appendButton.style.display = 'none'
  downloadButton.style.display = 'none'

  taskMessage.classList.remove('error')
  taskMessage.classList.add('info')

  taskMessage.querySelector('i').classList.remove('exclamation')
  taskMessage.querySelector('i').classList.add('notched')
  taskMessage.querySelector('i').classList.add('loading')

  taskMessage.querySelector('.header').innerHTML = Translations[language].just_one_second || 'Just one second'
  taskMessage.querySelector('p').innerHTML = context || 'We\'re fetching that content for you.'

  taskMessage.style.display = ''
}

function searchTorrents() {
  ViewPage = 0

  makeList()
}

$(document).ready(function () {
  try {
    makeList()
  } catch (error) {
    console.error(error)

    messageError('Unknown connection error occured between you and server, please refresh site to reload.', 'server')
  }
})
