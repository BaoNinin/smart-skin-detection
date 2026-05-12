import { View, Text, Image, Button, ScrollView } from '@tarojs/components'
import Taro, { useShareAppMessage } from '@tarojs/taro'
import { useState, useEffect } from 'react'
import RadarChart from '@/components/RadarChart'
import OverallScore from '@/components/OverallScore'
import BackHomeNavBar from '@/components/BackHomeNavBar'
import { calculateSkinScore } from '@/utils/skin'
import { useI18n } from '@/i18n'

interface SkinAnalysisResult {
  skinType: string
  concerns: string[]
  moisture: number
  oiliness: number
  sensitivity: number
  acne?: number
  wrinkles?: number
  spots?: number
  pores?: number
  blackheads?: number
  recommendations: string[]
}

export default function ResultPage() {
  const { t, lang } = useI18n()
  const [result, setResult] = useState<SkinAnalysisResult | null>(null)
  const [imagePath, setImagePath] = useState('')

  useEffect(() => {
    const analysisResult = Taro.getStorageSync('skinAnalysisResult')
    const currentImage = Taro.getStorageSync('currentImagePath')

    if (analysisResult) {
      setResult(analysisResult)
      setImagePath(currentImage || '')
    } else {
      Taro.showToast({ title: t.result.notFound, icon: 'none' })
      setTimeout(() => {
        Taro.switchTab({ url: '/pages/landing/index' })
      }, 1500)
    }
  }, [])

  useShareAppMessage(() => ({
    title: t.result.reportTitle,
    path: '/pages/landing/index',
  }))

  const calculateOverallScore = () => {
    if (!result) return 0
    return calculateSkinScore(result)
  }

  const overallScore = calculateOverallScore()
  const scoreRating = overallScore >= 80 ? t.result.excellent : overallScore >= 60 ? t.result.good : t.result.needsWork

  const getRadarData = () => {
    if (!result) return []
    return [
      { name: t.result.moisture, value: result.moisture, color: '#3B82F6' },
      { name: t.result.oiliness, value: 100 - result.oiliness, color: '#10B981' },
      { name: t.result.sensitivity, value: 100 - result.sensitivity, color: '#F59E0B' },
      { name: t.result.acne, value: 100 - (result.acne || 0), color: '#EF4444' },
      { name: t.result.wrinkles, value: 100 - (result.wrinkles || 0), color: '#8B5CF6' }
    ]
  }

  const handleReDetect = () => { Taro.redirectTo({ url: '/pages/camera/index' }) }
  const handleViewDetail = () => { Taro.navigateTo({ url: '/pages/result-detail/index' }) }
  const handleViewHistory = () => { Taro.switchTab({ url: '/pages/history/index' }) }

  if (!result) return null

  const statusBarHeight = Taro.getSystemInfoSync().statusBarHeight || 44
  const navBarHeight = statusBarHeight + 44

  return (
    <View className="min-h-screen bg-slate-50">
      <BackHomeNavBar title={t.result.reportTitle} />
      <View style={{ height: `${navBarHeight}px` }} />

      <ScrollView scrollY className="h-screen" style={{ height: `calc(100vh - ${navBarHeight}px)` }}>
        <View className="p-4">
          <OverallScore score={overallScore} rating={scoreRating} />

          {/* 皮肤类型 */}
          <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
            <View className="flex items-center gap-4">
              {imagePath && (
                <Image src={imagePath} mode="aspectFill" className="w-24 h-24 rounded-xl" />
              )}
              <View className="flex-1">
                <Text className="text-sm text-gray-500 mb-2 block">{t.result.skinType}</Text>
                <View className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100">
                  <Text className="text-lg text-blue-800 font-semibold block">{result.skinType}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* 雷达图 */}
          <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
            <View className="flex items-center justify-between mb-4">
              <Text className="text-lg font-semibold text-gray-800 block">{t.result.radarTitle}</Text>
              <Text className="text-sm text-gray-500 block">{t.result.analysisBasis}</Text>
            </View>
            <RadarChart data={getRadarData()} width={280} height={280} />
            <View className="mt-4 text-center">
              <Text className="text-sm text-gray-500 block">{t.result.scoreText(overallScore)}</Text>
            </View>
          </View>

          {/* 五大指标 */}
          <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
            <Text className="text-lg font-semibold text-gray-800 mb-4 block">
              {t.result.metricsTitle}
            </Text>
            <View className="space-y-3">
              {[
                { label: t.result.moisture, val: result.moisture, color: 'blue' },
                { label: t.result.oilControl, val: 100 - result.oiliness, color: 'green' },
                { label: t.result.calm, val: 100 - result.sensitivity, color: 'yellow' },
                { label: t.result.acneControl, val: 100 - (result.acne || 0), color: 'red' },
                { label: t.result.antiWrinkle, val: 100 - (result.wrinkles || 0), color: 'purple' },
              ].map(({ label, val, color }) => (
                <View key={label} className="flex items-center justify-between">
                  <View className="flex items-center gap-2">
                    <View className={`w-3 h-3 rounded-full bg-${color}-500`} />
                    <Text className="text-sm text-gray-700 block">{label}</Text>
                  </View>
                  <View className="flex items-center gap-2">
                    <Text className={`text-2xl font-bold text-${color}-500 block`}>{val}</Text>
                    <Text className="text-xs text-gray-500 block">{t.result.pts}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* 主要问题 */}
          {result.concerns && result.concerns.length > 0 && (
            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <Text className="text-lg font-semibold text-gray-800 mb-3 block">{t.result.concerns}</Text>
              <View className="flex flex-wrap gap-2">
                {result.concerns.map((concern, index) => (
                  <View key={index} className="inline-flex items-center px-3 py-1.5 rounded-full bg-amber-100">
                    <Text className="text-sm text-amber-700 block">{concern}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* 操作按钮 */}
          <View className="space-y-3 mb-8">
            <Button onClick={handleViewDetail} className="w-full bg-blue-700 text-white rounded-full py-4 font-medium">
              {t.result.next}
            </Button>
            <Text className="text-sm text-gray-500 text-center block">{t.result.viewDetail}</Text>
            <View className="flex gap-3">
              <Button onClick={handleViewHistory} className="w-full bg-white text-gray-700 border-2 border-gray-200 rounded-full py-3">
                {t.tabbar.history}
              </Button>
            </View>
            <Button onClick={handleReDetect} className="w-full bg-white text-gray-700 border-2 border-gray-200 rounded-full py-3">
              {t.result.reDetect}
            </Button>
          </View>
        </View>
      </ScrollView>
      <Text className="text-xs text-gray-400 text-center block py-4">{t.common.aiDisclaimer}</Text>
    </View>
  )
}
