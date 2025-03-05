
interface Window {
  globalConfig: {
    LANDING_PAGE_DOMAIN: string
    version: number
  }
  callAppApi: (
    arg: string | object,
    params: string,
    callback?: () => void,
  ) => void
  wallet: {
    call: unknown
  }
  Android: {
    doAction: (name: string, params: string, callback?: () => void) => void
    getSystemBars: () => string
    getSystemLanguage: () => string
  }
  webkit: {
    messageHandlers: {
      doAction: {
        postMessage: (body: object) => void | string
      }
    }
  }
}
