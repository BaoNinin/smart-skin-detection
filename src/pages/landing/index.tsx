import { View, Text, Image } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { useState } from 'react'
import { useI18n, syncTabBar } from '@/i18n'

const landingBg = '/assets/landing-bg.png'
const logoImage = '/assets/logo.png'

export default function LandingPage() {
  const { t, toggle } = useI18n()
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)

  useDidShow(() => {
    syncTabBar(t)
  })

  const handleStartDetection = () => {
    const privacyAgreed = Taro.getStorageSync('privacyAgreed')
    if (privacyAgreed) {
      Taro.navigateTo({ url: '/pages/camera/index' })
    } else {
      setShowPrivacyModal(true)
    }
  }

  const handleAgreePrivacy = () => {
    Taro.setStorageSync('privacyAgreed', true)
    setShowPrivacyModal(false)
    Taro.navigateTo({ url: '/pages/camera/index' })
  }

  const handleDisagreePrivacy = () => {
    setShowPrivacyModal(false)
    Taro.showToast({
      title: t.landing.privacyDeniedToast,
      icon: 'none',
      duration: 2000
    })
  }

  const handleGoToHistory = () => {
    Taro.switchTab({ url: '/pages/history/index' })
  }

  const handleGoToProfile = () => {
    Taro.switchTab({ url: '/pages/profile/index' })
  }

  return (
    <View className="min-h-screen relative bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500">
      {/* 背景图片 */}
      <Image
        src={landingBg}
        className="absolute inset-0 w-full h-full opacity-30"
        mode="aspectFill"
      />

      {/* 语言切换按钮 */}
      <View
        onClick={toggle}
        style={{
          position: 'fixed',
          top: '54px',
          left: '16px',
          zIndex: 100,
          backgroundColor: 'rgba(255,255,255,0.15)',
          borderRadius: '20px',
          padding: '6px 14px',
          border: '1px solid rgba(255,255,255,0.4)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Text style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', letterSpacing: '0.5px' }}>
          {t.common.langToggle}
        </Text>
      </View>

      {/* 内容层 */}
      <View className="relative z-10 min-h-screen bg-gradient-to-b from-transparent via-blue-900/50 to-blue-900/70 backdrop-blur-sm">
        <View className="flex flex-col items-center justify-center px-8 py-12">
          <View className="mb-8">
            <View className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Image
                src={logoImage}
                className="w-24 h-24"
                style={{ marginLeft: '12px' }}
                mode="aspectFit"
              />
            </View>
          </View>

          <Text className="text-3xl font-bold text-gray-800 mb-2 text-center block">
            {t.landing.title}
          </Text>
          <Text className="text-base text-gray-500 text-center mb-12 block">
            {t.landing.subtitle}
          </Text>

          <View
            onClick={handleStartDetection}
            className="w-full bg-blue-700 rounded-2xl py-4 px-6 flex items-center justify-center shadow-md mb-8"
          >
            <Text className="text-xl text-white font-semibold block">
              {t.landing.startBtn}
            </Text>
          </View>

          <View className="w-full space-y-3">
            <View
              onClick={handleGoToHistory}
              className="w-full bg-white rounded-xl py-4 px-6 flex items-center justify-center shadow-sm"
            >
              <Text className="text-lg text-gray-700 block">{t.landing.historyBtn}</Text>
            </View>

            <View
              onClick={handleGoToProfile}
              className="w-full bg-white rounded-xl py-4 px-6 flex items-center justify-center shadow-sm"
            >
              <Text className="text-lg text-gray-700 block">{t.landing.profileBtn}</Text>
            </View>
          </View>
        </View>

        <View className="px-8 pb-8">
          <View className="bg-white rounded-xl p-6 shadow-sm">
            <Text className="text-sm text-gray-600 text-center block">
              {t.landing.tipText}
            </Text>
          </View>
        </View>
      </View>

      {/* 隐私授权弹窗 */}
      {showPrivacyModal && (
        <View
          className="fixed inset-0 bg-black/60 flex items-end justify-center z-50"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
        >
          <View className="bg-white rounded-t-3xl p-6 w-full max-h-screen overflow-y-auto">
            <Text className="text-xl font-bold text-gray-800 mb-4 block text-center">
              {t.landing.privacyTitle}
            </Text>

            <View className="bg-blue-50 rounded-2xl p-4 mb-4">
              <Text className="text-sm font-semibold text-blue-800 mb-2 block">
                {t.landing.privacyFuncTitle}
              </Text>
              <Text className="text-sm text-gray-700 leading-6 block">
                {t.landing.privacyFuncDesc}
              </Text>
            </View>

            <View className="bg-green-50 rounded-2xl p-4 mb-4">
              <Text className="text-sm font-semibold text-green-800 mb-2 block">
                {t.landing.privacyDataTitle}
              </Text>
              <View className="space-y-1">
                <Text className="text-sm text-gray-700 block">{t.landing.privacyDataItem1}</Text>
                <Text className="text-sm text-gray-700 block">{t.landing.privacyDataItem2}</Text>
                <Text className="text-sm text-gray-700 block">{t.landing.privacyDataItem3}</Text>
                <Text className="text-sm text-gray-700 block">{t.landing.privacyDataItem4}</Text>
              </View>
            </View>

            <Text className="text-xs text-gray-400 text-center mb-4 block">
              {t.landing.privacyFooter}
            </Text>

            <View className="flex gap-3">
              <View
                onClick={handleDisagreePrivacy}
                className="flex-1 bg-gray-100 rounded-2xl py-4 flex items-center justify-center"
              >
                <Text className="text-gray-600 text-base font-medium block">{t.landing.privacyDisagree}</Text>
              </View>
              <View
                onClick={handleAgreePrivacy}
                className="flex-1 bg-blue-700 rounded-2xl py-4 flex items-center justify-center"
              >
                <Text className="text-white text-base font-medium block">{t.landing.privacyAgree}</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}
