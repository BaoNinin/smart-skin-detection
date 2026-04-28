export function getSkinTypeDescription(skinType: string) {
  switch (skinType) {
    case '干性皮肤':
      return '肌肤干燥，容易产生细纹，需要加强保湿'
    case '油性皮肤':
      return '皮脂分泌旺盛，容易出油和长痘，需要控油祛痘'
    case '混合性皮肤':
      return 'T区出油，两颊干燥，需要分区护理'
    case '中性皮肤':
      return '水油平衡，状态理想，做好日常保养即可'
    case '敏感性皮肤':
      return '肌肤屏障脆弱，容易受刺激，需要温和护理'
    default:
      return '请结合肌肤状态做好清洁、保湿和防晒护理'
  }
}

export function calculateSkinScore(metrics: {
  moisture: number
  oiliness: number
  sensitivity: number
  acne?: number
  wrinkles?: number
  spots?: number
  pores?: number
  blackheads?: number
}) {
  const scores = [metrics.moisture, 100 - metrics.oiliness, 100 - metrics.sensitivity]
  const optionalScores = [metrics.acne, metrics.wrinkles, metrics.spots, metrics.pores, metrics.blackheads]

  optionalScores.forEach(value => {
    if (value !== undefined && value !== null) {
      scores.push(100 - value)
    }
  })

  return Math.round(scores.reduce((sum, current) => sum + current, 0) / scores.length)
}
