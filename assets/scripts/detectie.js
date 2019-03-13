// Original pen: https://codepen.io/gapcode/pen/vEJNZN
function detectIE() {
  const ua = window.navigator.userAgent

  let msie = ua.indexOf('MSIE ')
  if (msie > 0) return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10)

  let trident = ua.indexOf('Trident/')
  if (trident > 0) {
    let rv = ua.indexOf('rv:')
    return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10)
  }

  /*
  let edge = ua.indexOf('Edge/')
  if (edge > 0) return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10)
  */

  return false
}

if (detectIE() !== false) {
  document.querySelector('#fullAppFrame').innerHTML
    = '<h3>Currently Internet Explorer version 11 and lower are not supported!</h3><a class="button" style="margin-right: 4px;" href="https://b2.seia.io/at/729/">Read what is going on<a><a class="button button-primary" href="https://www.google.com/chrome/">Get Chrome web browser</a>'
}
