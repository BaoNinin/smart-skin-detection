import { create } from 'zustand'
import Taro from '@tarojs/taro'
import zh from './zh'
import en from './en'

type Lang = 'zh' | 'en'

interface LangStore {
  lang: Lang
  t: typeof zh
  toggle: () => void
  setLang: (lang: Lang) => void
}

const STORAGE_KEY = 'appLanguage'

const getSavedLang = (): Lang => {
  try {
    const saved = Taro.getStorageSync(STORAGE_KEY)
    if (saved === 'zh' || saved === 'en') return saved
  } catch {}
  return 'zh'
}

/** Update the native WeChat tab bar labels to match current language */
export const syncTabBar = (t: typeof zh) => {
  try {
    Taro.setTabBarItem({ index: 0, text: t.tabbar.home })
    Taro.setTabBarItem({ index: 1, text: t.tabbar.history })
    Taro.setTabBarItem({ index: 2, text: t.tabbar.profile })
  } catch {}
}

export const useLangStore = create<LangStore>((set) => {
  const initialLang = getSavedLang()
  return {
    lang: initialLang,
    t: initialLang === 'en' ? en : zh,
    toggle: () =>
      set((state) => {
        const next: Lang = state.lang === 'zh' ? 'en' : 'zh'
        const nextT = next === 'en' ? en : zh
        try { Taro.setStorageSync(STORAGE_KEY, next) } catch {}
        syncTabBar(nextT)
        return { lang: next, t: nextT }
      }),
    setLang: (lang: Lang) => {
      const nextT = lang === 'en' ? en : zh
      try { Taro.setStorageSync(STORAGE_KEY, lang) } catch {}
      syncTabBar(nextT)
      set({ lang, t: nextT })
    },
  }
})

/** Convenience hook — use this in every component */
export const useI18n = () => {
  const { t, lang, toggle } = useLangStore()
  return { t, lang, toggle }
}
