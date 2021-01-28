export function browser() {
  // CHROME
  if (navigator.userAgent.indexOf("Chrome") != -1) {
    return 'chrome'
  }
  // FIREFOX
  else if (navigator.userAgent.indexOf("Firefox") != -1) {
    return 'firefox'
  }
  // INTERNET EXPLORER
  else if (navigator.userAgent.indexOf("MSIE") != -1) {
    console.log("Internet Exploder");
  }
  // EDGE
  else if (navigator.userAgent.indexOf("Edge") != -1) {
    console.log("Internet Exploder");
  }
  // SAFARI
  else if (navigator.userAgent.indexOf("Safari") != -1) {
    return 'safari'
  }
  // OPERA
  else if (navigator.userAgent.indexOf("Opera") != -1) {
    console.log("Opera");
  }
  // YANDEX BROWSER
  else if (navigator.userAgent.indexOf("YaBrowser") != -1) {
    console.log("YaBrowser");
  }
  // OTHERS
  else {
    console.log("Others");
  }
}