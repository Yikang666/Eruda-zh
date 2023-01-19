describe('resources', function () {
  let $tool = $('.eruda-resources')

  beforeEach(function () {
    eruda.show('resources')
  })

  describe('localStorage', function () {
    it('show', function () {
      localStorage.clear()
      localStorage.setItem('testKey', 'testVal')
    })

    it('clear', function () {
      $tool.find('.eruda-local-storage .eruda-clear-storage').click()
    })
  })

  describe('sessionStorage', function () {
    it('show', function () {
      sessionStorage.clear()
      sessionStorage.setItem('testKey', 'testVal')
    })

    it('clear', function () {
      $tool.find('.eruda-session-storage .eruda-clear-storage').click()
    })
  })

  describe('cookie', function () {
    it('show', function () {
      util.cookie.set('testKey', 'testVal')
      $tool.find('.eruda-refresh-cookie').click()
    })

    it('clear', function () {
      $tool.find('.eruda-clear-cookie').click()
    })
  })
})
