const { log } = console
const checkPlatform = () => {
  const isAndroid = !!window.Android
  const isIOS = !!window.webkit
  return { isAndroid, isIOS }
}

const documentIsReady = (fn) => {
  if (typeof fn !== "function") return
  if (document.readyState === "complete") {
    fn()
  }
  document.addEventListener("DOMContentLoaded", fn, false)
}
const addAppApi = () => {
  const { isAndroid, isIOS } = checkPlatform()
  debugger
  if (isAndroid) {
    window.callAppApi = (...args) => {
      log("call android api", args)
      window.Android.doAction(...args)
    }
  } else if (isIOS) {
    window.callAppApi = (action, params) => {
      log("call iOS api", { action, ...params })
      debugger
      window.webkit.messageHandlers.doAction.postMessage({
        action,
        params
      })
    }
  } else {
    window.callAppApi = () => {
      log("default")
    }
  }
}
const notifyAppPageLoaded = () => {
  const { isAndroid, isIOS } = checkPlatform()
  window.callAppApi("appLoaded", "")
  if (isAndroid) {
    log("notifyAppPageOnLoaded Android")
  }
  if (isIOS) {
    log("notifyAppPageOnLoaded iOS")
  }
}

const checkEnv = () => {
  const searchParams = new URLSearchParams(window.location.search)
  const isPtVersion = searchParams.get("version") === "pt"
  window.localStorage.setItem("PT_VERSION", isPtVersion.toString())
}

// const addHeightLimit = () => {
//     const { isIOS } = checkPlatform()
//     if (isIOS) {
//         document.documentElement.style.setProperty("--iOS-height-fix", "100vh")
//     }
// }

const init = () => {
  log(123)
  checkEnv()
  addAppApi()
  notifyAppPageLoaded()
  // addHeightLimit()
}
window.onload = init
documentIsReady(init)
