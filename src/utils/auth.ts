import Taro from '@tarojs/taro'

const ANONYMOUS_ID_STORAGE_KEY = 'anonymousId'

function createAnonymousId() {
  return `anon_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`
}

export function getOrCreateAnonymousId() {
  const existingId = Taro.getStorageSync(ANONYMOUS_ID_STORAGE_KEY)
  if (existingId) {
    return existingId as string
  }

  const anonymousId = createAnonymousId()
  Taro.setStorageSync(ANONYMOUS_ID_STORAGE_KEY, anonymousId)
  return anonymousId
}
