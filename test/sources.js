describe('sources', function () {
  let tool = eruda.get('sources')
  let $tool = $('.eruda-sources')

  beforeEach(function () {
    eruda.show('sources')
  })

  it('raw', function () {
    tool.set('raw', '/* test */')
    expect($tool.find('.eruda-raw')).toContainHtml('/* test */')
  })
})
