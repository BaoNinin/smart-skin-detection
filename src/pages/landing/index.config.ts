export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationStyle: 'custom',
      navigationBarTitleText: '智能皮肤检测'
    })
  : {
      navigationStyle: 'custom',
      navigationBarTitleText: '智能皮肤检测'
    }
