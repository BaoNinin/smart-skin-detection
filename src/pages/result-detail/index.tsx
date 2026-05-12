import { View, Text, Image, ScrollView, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import RadarChart from '@/components/RadarChart'
import OverallScore from '@/components/OverallScore'
import BackHomeNavBar from '@/components/BackHomeNavBar'
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

export default function ResultDetailPage() {
  const { t, lang } = useI18n()
  const [result, setResult] = useState<SkinAnalysisResult | null>(null)
  const [imagePath, setImagePath] = useState('')

  useEffect(() => {
    const analysisResult = Taro.getStorageSync('skinAnalysisResult')
    const currentImage = Taro.getStorageSync('currentImagePath')
    if (analysisResult) {
      setResult(analysisResult)
      setImagePath(currentImage || '')
    }
  }, [])

  const calculateOverallScore = () => {
    if (!result) return 0
    const scores = [result.moisture, 100 - result.oiliness, 100 - result.sensitivity]
    if (result.acne) scores.push(100 - result.acne)
    if (result.wrinkles) scores.push(100 - result.wrinkles)
    if (result.spots) scores.push(100 - result.spots)
    if (result.pores) scores.push(100 - result.pores)
    if (result.blackheads) scores.push(100 - result.blackheads)
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
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

  if (!result) return null

  const statusBarHeight = Taro.getSystemInfoSync().statusBarHeight || 44
  const navBarHeight = statusBarHeight + 44

  return (
    <View className="min-h-screen bg-gray-50">
      <BackHomeNavBar title={t.result.viewDetail} backgroundColor="#1E40AF" textColor="#FFFFFF" />
      <View style={{ height: `${navBarHeight}px` }} />
      <ScrollView scrollY className="h-screen" style={{ height: `calc(100vh - ${navBarHeight}px)` }}>
        <View className="p-4">
          <View className="bg-gradient-to-r from-blue-700 to-blue-800 rounded-2xl p-6 text-white mb-4">
            <Text className="text-2xl font-bold block">{t.history.canvasReportTitle}</Text>
            <Text className="text-sm opacity-90 block mt-2">
              {new Date().toLocaleDateString(lang === 'en' ? 'en-US' : 'zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </Text>
          </View>
          <OverallScore score={overallScore} rating={scoreRating} />
          {imagePath && (
            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <Text className="text-lg font-semibold text-gray-800 mb-3 block">{t.history.canvasLatestResult}</Text>
              <Image src={imagePath} mode="aspectFill" lazyLoad className="w-full h-80 rounded-xl" />
            </View>
          )}
          <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
            <Text className="text-lg font-semibold text-gray-800 mb-4 block">{t.result.radarTitle}</Text>
            <RadarChart data={getRadarData()} width={280} height={280} />
          </View>
          <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
            <Text className="text-lg font-semibold text-gray-800 mb-3 block">{t.result.skinType}</Text>
            <View className="bg-slate-50 rounded-xl p-4">
              <Text className="text-2xl font-bold text-blue-800 block mb-2">{result.skinType}</Text>
            </View>
          </View>
          <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
            <Text className="text-lg font-semibold text-gray-800 mb-4 block">{t.result.skinScore}</Text>
            <View className="space-y-4">
              {[
                { icon: '💧', key: 'moisture' as const, label: t.result.moisture, value: result.moisture },
                { icon: '🛢️', key: 'oiliness' as const, label: t.result.oiliness, value: result.oiliness },
                { icon: '🌡️', key: 'sensitivity' as const, label: t.result.sensitivity, value: result.sensitivity },
                { icon: '🔴', key: 'acne' as const, label: t.result.acne, value: result.acne || 0 },
                { icon: '🌀', key: 'wrinkles' as const, label: t.result.wrinkles, value: result.wrinkles || 0 },
              ].map(item => (
                <View key={item.key}>
                  <View className="flex items-center justify-between mb-2">
                    <View className="flex items-center gap-2">
                      <Text className="text-xl block">{item.icon}</Text>
                      <Text className="text-base font-medium text-gray-800 block">{item.label}</Text>
                    </View>
                    <Text className="text-xl font-bold text-blue-700 block">{item.value}</Text>
                  </View>
                  <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <View className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${item.value}%` }} />
                  </View>
                </View>
              ))}
            </View>
          </View>
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
          {result.recommendations && result.recommendations.length > 0 && (
            <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <Text className="text-lg font-semibold text-gray-800 mb-3 block">{t.result.recommendations}</Text>
              <View className="space-y-2">
                {result.recommendations.map((rec, index) => (
                  <View key={index} className="flex items-start bg-gray-50 rounded-lg p-3">
                    <View className="w-6 h-6 rounded-full bg-blue-700 flex items-center justify-center mr-3 flex-shrink-0">
                      <Text className="text-white text-xs font-bold block">{index + 1}</Text>
                    </View>
                    <Text className="text-sm text-gray-700 flex-1 block">{rec}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          <View className="flex gap-3 mb-8">
            <Button className="flex-1 bg-white text-gray-700 border-2 border-gray-200 rounded-full py-3">
              {t.history.shareBtn}
            </Button>
            <Button className="flex-1 bg-white text-gray-700 border-2 border-gray-200 rounded-full py-3">
              {t.history.exportReport}
            </Button>
          </View>
        </View>
      </ScrollView>
      <Text className="text-xs text-gray-400 text-center block py-4">{t.common.aiDisclaimer}</Text>
    </View>
  )
}
