describe('settings', function () {
  let tool = eruda.get('settings')
  let $tool = $('.eruda-settings')

  let cfg = eruda.Settings.createCfg('test')
  cfg.set({
    testSwitch: false,
    testSelect: '1',
    testRange: 1,
    testColor: '#fff',
  })

  beforeEach(function () {
    tool.clear()
  })

  it('switch', function () {
    let text = 'Test Switch'

    tool.switch(cfg, 'testSwitch', text)
  })

  it('separator', function () {
    tool.separator()
  })

  it('select', function () {
    let text = 'Test Select'

    tool.select(cfg, 'testSelect', text, ['1', '2', '3'])
  })

  it('range', function () {
    let text = 'Test Range'

    tool.range(cfg, 'testRange', text, { min: 0, max: 1, step: 0.1 })
  })

  it('remove', function () {
    let text = 'Test Switch'
    tool.switch(cfg, 'testSwitch', text)
    tool.remove(cfg, 'testSwitch')
  })
})
