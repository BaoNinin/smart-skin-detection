import { View, Text } from '@tarojs/components'
import { useI18n } from '@/i18n'

export default function MallPage() {
  const { t } = useI18n()
  return (
    <View className="min-h-screen bg-gray-50 flex items-center justify-center">
      <View className="text-center">
        <Text className="text-4xl block mb-4">🛍️</Text>
        <Text className="text-xl font-semibold text-gray-800 block">{t.mall.title}</Text>
        <Text className="text-sm text-gray-500 mt-2 block">{t.mall.noProducts}</Text>
      </View>
    </View>
  )
}
