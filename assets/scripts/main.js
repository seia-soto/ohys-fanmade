const acceptableLanguages = {
  en: 'en',
  eng: 'en',
  'en-us': 'en',
  ko: 'ko',
  kr: 'ko',
  kor: 'ko',
  'ko-kr': 'ko',
  ja: 'ja',
  jp: 'ja',
  jpn: 'ja'
}
const language = window.navigator.userLanguage || window.navigator.language

setTimeout(function() {
  window.location.href = './' + (acceptableLanguages[language.toLowerCase()] || 'en') + '.html'
}, 750)
