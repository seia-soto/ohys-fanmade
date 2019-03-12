# Ohys-Fanmade

The fanmade site of Ohys-Raws.

## Features

- Search uploaded raws and print it as list.
- Download all torrent files from list.
- See resolution of uploaded raw at list.

## Adaptation

Move `index.sample.html` to `index.html`, then open `assets/scripts/main.js` with your editor.

You can see `BaseURL` at line 5, edit it to relative path from public.

```js
const BaseURL = 'https://app.seia.io/Ohys-Fanmade/'
const OriginalURL = 'https://torrents.ohys.net/t/'
```

If you want to use minified version of statics, change `~.ext` to `~.min.ext` in `index.html`.
Included JavaScript and CSS both have minified version.

## Browser accessibility

Preparing
