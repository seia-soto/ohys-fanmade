const acceptableLanguages = {
  en: 'en',
  eng: 'en',
  'en-us': 'en',
  ko: 'ko',
  kr: 'ko',
  kor: 'ko',
  'ko-kr': 'ko'
}
const language = window.navigator.userLanguage || window.navigator.language

window.location.href = './' + (acceptableLanguages[language.toLowerCase()] || 'en') + '.html'
