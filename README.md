# Ohys-Fanmade

The fanmade site of Ohys-Raws.

## Todo

- [x] Loading JSON data with XHR
- [x] Printing file resolution
- [x] Making page identifier at bottom
- [x] Adding directory selector at top
- [x] Searching torrents

## Adaptation

Open `assets/scripts/main.js` with your editor.

You can see `BaseURL` at line 5, edit it where file uploaded.

```js
document.addEventListener('DOMContentLoaded', function(event) {
  const TorrentTable = document.querySelector('#TorrentTable')
  const SearchInput = document.querySelector('#SearchInput')

  const BaseURL = 'https://torrents.ohys.net/t/'
  const CurrentURL = new URL(window.location.href)

  const ResolutionPattern = /\d{3,4}x\d{3,4}/

  const ListType = 'new'
  ...
```
