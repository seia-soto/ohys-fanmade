// NOTE: Options
const baseURI = 'https://ohys.seia.io/'
const originalURI = 'https://torrents.ohys.net/'
const myanimelistURI = 'https://myanimelist.net/'

const titlePattern = /\[Ohys-Raws\]\s(.*)\ .*\((.[^\s]+)\s(.\d{3,4}x\d{3,4})\s(.*)\).*?\.([^.]*)/
const myanimelistQueryDelay = 100

const acceptableLanguages = {
  en: 'en',
  eng: 'en',
  'en-us': 'en',
  ko: 'ko',
  kr: 'ko',
  kor: 'ko',
  'ko-kr': 'ko'
}
const directoryScopes = {
  '2019': 'disk',
  '2018': 'disk18',
  '2017': 'disk17'
}
const defaultScopes = {
  page: 0,
  releasedYear: 2019,
  resolution: 'all',
  viewOption: 'table'
}
const uriScopes = {
  ohys: {
    jsonAPI: 'proxies/ohys.php' // NOTE: https://ohys.seia.io/json.php?dir=disk&p=0
  },
  myanimelist: {
    prefixAPI: 'proxies/myanimelist.php' // NOTE: https://myanimelist.net/search/prefix.json?type=anime&keyword=sword%20art%20online&v=1
  }
}

// NOTE: Utils
function requestChunk(uri, callback) {
  let request = new XMLHttpRequest()

  request.onreadystatechange = function() {
    if (request.readyState == 4 && request.status == 200) {
      callback(request.responseText)
    }
  }

  request.open('GET', uri)
  request.send(null)
}
function predictData(torrent) {
  const predictionData = titlePattern.exec(torrent.t)

  const prediction = {
    name: predictionData[1], // NOTE: Name of torrent
    broadcaster: predictionData[2], // NOTE: broadcaster of torrent
    resolution: predictionData[3], // NOTE: Resolution of torrent
    audioType: predictionData[4], // NOTE: Audio type like 'x264 AAC'
    videoType: predictionData[5], // NOTE: Video type like 'mp4'
    link: originalURI + 't/' + torrent.a,
    original: torrent.t
  }
  return prediction
}

// NOTE: Functions
$(document).ready(function() {
  // NOTE: Predict DOM
  const appContext = $('#app')
  const navMenuSearchInput = $('#searchInputNav')
  const navMenuSwitch = $('nav > .ui.top.fixed.borderless.menu > ui.container > .right.menu > .item').not('#searchInputNav')
  const headerSubheader = $('header > .ui.container > h2.ui.header > .sub.header')
  const headerButtonDiscord = $('header > .ui.container > a.ui.primary.button')
  const headerButtonRaws = $('header > .ui.container > a.ui.secondary.button')
  const contextTitle = $('article > h2.ui.header')
  const contextSearchInputPlaceholder = $('#searchInputCtx > input')
  const contextSearchInputButton = $('#searchInputCtx > .ui.teal.button')
  const additionalOptionsHeader = $('article > div.ui.basic.fluid.accordion.segment > div.active.title')
  const additionalOptionsColumns = $('article > div.ui.basic.fluid.accordion.segment > div.active.content > .ui.basic.equal.width.stackable.grid.segment > .column')
  const additionalOptionsSubtitle_ReleasedYear = $(additionalOptionsColumns[0]).find('h3')
  const additionalOptionsSubtitle_Resolution = $(additionalOptionsColumns[1]).find('h3')
  const additionalOptionsSubtitle_ViewOption = $(additionalOptionsColumns[2]).find('h3')
  const additionalOptionsDropdown_RelasedYear = $(additionalOptionsColumns[0]).find('.ui.fluid.selection.dropdown')
  const additionalOptionsDropdown_Resolution = $(additionalOptionsColumns[1]).find('.ui.fluid.selection.dropdown')
  const additionalOptionsDropdown_ViewOption = $(additionalOptionsColumns[2]).find('.ui.fluid.selection.dropdown')
  const moreButton = $('article > div.ui.basic.center.aligned.segment > button')

  // NOTE: Initial option
  let page = 0
  let search = ''

  // NOTE: Utils (requires DOM)
  function predictOptions() {
    return {
      page: page || defaultScopes.page,
      releasedYear: $(additionalOptionsDropdown_RelasedYear).dropdown('get value') || defaultScopes.releasedYear,
      resolution: $(additionalOptionsDropdown_Resolution).dropdown('get value') || defaultScopes.resolution,
      viewOption: $(additionalOptionsDropdown_ViewOption).dropdown('get value') || defaultScopes.viewOption
    }
  }
  function prepareTableList(overwrite) {
    $(appContext).empty()
    $(appContext).attr('class', 'ui list')
  }
  function appendListItem(prediction) {
    const item = $('<div/>', {
      class: 'item'
    })

    const itemHeader = $('<a/>', {
      class: 'header',
      text: prediction.name,
      href: prediction.link
    })
    const itemDescription = $('<div/>', {
      text: 'Ohys-Raws / ' +
        prediction.broadcaster + ' / ' +
        prediction.resolution + ' / ' +
        prediction.audioType + ' / ' +
        prediction.videoType
    })

    item.append(itemHeader)
    item.append(itemDescription)

    appContext.append(item)
  }
  function prepareCardList(overwrite) {
    $(appContext).empty()
    $(appContext).attr('class', 'ui five stackable link cards')
  }
  function appendCardItem(prediction) {
    const outline = $('<a/>', {
      class: 'card',
      href: prediction.link
    })

    const cardImage = $('<img/>', {
      src: prediction.myanimelistQuery.image_url
    })
    const cardImageContainer = $('<div/>', {
      class: 'image'
    })

    const cardContentContainer = $('<div/>', {
      class: 'content'
    })
    const cardHeader = $('<div/>', {
      class: 'header',
      text: prediction.name
    })
    const cardMeta = $('<div/>', {
      class: 'meta',
      text: prediction.broadcaster + ' (' + prediction.myanimelistQuery.payload.status + ', ' + prediction.myanimelistQuery.payload.aired + ')'
    })
    const cardDescription = $('<div/>', {
      class: 'description',
      text: prediction.resolution + ' / ' +
        prediction.audioType + ' / ' +
        prediction.videoType
    })

    const cardExtra = $('<div/>', {
      class: 'extra content'
    })
    const cardExtraLeft = $('<span/>', {
      text: 'Rating ' + prediction.myanimelistQuery.payload.score
    })
    const cardExtraRight = $('<span/>', {
      class: 'right floated'
    })
    const cardExtraRightRating = $('<div/>', {
      class: 'ui star rating',
      'data-rating': Math.round(prediction.myanimelistQuery.payload.score / 2)
    })

    cardImageContainer.append(cardImage)

    cardContentContainer.append(cardHeader)
    cardContentContainer.append(cardMeta)
    cardContentContainer.append(cardDescription)

    cardExtra.append(cardExtraRight.append(cardExtraRightRating))
    cardExtra.append(cardExtraLeft)

    outline.append(cardImageContainer)
    outline.append(cardContentContainer)
    outline.append(cardExtra)

    appContext.append(outline)

    $(cardExtraRightRating)
      .rating({
        maxRating: 5
      })
      .rating('disable')
  }
  function fetchTorrentList(options, query, callback) {
    const uri = uriScopes.ohys.jsonAPI + '?dir=' + directoryScopes[options.releasedYear] + '&p=' + options.page + '&q=' + (query || '')

    requestChunk(uri, callback)
  }
  function fetchMyanimelistData(name, callback) {
    const uri = uriScopes.myanimelist.prefixAPI + '?type=anime&v=1&keyword=' + name.replace(/[\&\s]/gi, '_')

    requestChunk(uri, callback)
  }
  function buildTorrentList(options, query) {
    fetchTorrentList(options, query, function(chunk) {
      const data = JSON.parse(chunk)

      if (data.length < 30) {
        moreButton.hide()
      } else {
        moreButton.show()
      }

      data.forEach(function(torrent, i) {
        const prediction = predictData(torrent)

        if (options.resolution !== 'all' && options.resolution !== prediction.resolution) {
          return null
        }

        switch (options.viewOption) {
          case 'table':
            appendListItem(prediction)
            break;
          case 'card':
            setTimeout(function() {
              fetchMyanimelistData(prediction.name, function(response) {
                prediction.myanimelistQuery = JSON.parse(response).categories.filter(function(category) {
                  return category.type === 'anime'
                })[0].items[0]

                appendCardItem(prediction)
              })
            }, (i * myanimelistQueryDelay) + myanimelistQueryDelay)
            break;
          default:
            alert('Invalid view option provided!')
        }
      })
    })
  }
  function buildListFrom(what, resetResult) {
    page = 0
    search = $(what).find('input').val() || ''
    onload = true

    const options = predictOptions()

    if (resetResult) {
      if (options.viewOption === 'table') {
        prepareTableList()
      } else {
        // NOTE: Build as cards
        prepareCardList()
      }
    }
    buildTorrentList(options, search)
  }

  // NOTE: Event handles
  $(moreButton).click(function() {
    // NOTE: Skip to next page
    page++

    buildTorrentList(predictOptions(), search)
  })
  $(searchInputCtx).find('.button').click(function() {
    buildListFrom(searchInputCtx, true)
  })
  $(searchInputCtx).find('input').keypress(function(e) {
    if ((e.keyCode ? e.keyCode : e.which) == 13) { // NOTE: When press enter key
      buildListFrom(searchInputCtx, true)
    }
  })
  $(searchInputNav).find('.button').click(function() {
    buildListFrom(searchInputNav, true)
  })
  $(searchInputNav).find('i').keypress(function(e) {
    if ((e.keyCode ? e.keyCode : e.which) == 13) { // NOTE: When press enter key
      buildListFrom(searchInputNav, true)
    }
  })

  // NOTE: Boot app
  buildListFrom(searchInputCtx, true)
})
