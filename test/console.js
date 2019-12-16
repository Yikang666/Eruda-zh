describe('console', function() {
  let tool = eruda.get('console')
  tool.config.set('asyncRender', false)
  let $tool = $('.eruda-console')
  let logger = tool._logger

  function log(i) {
    return logs()[i].el
  }

  function logs() {
    return logger._displayLogs
  }

  beforeEach(function() {
    eruda.show('console')
    logger.silentClear()
  })

  it('string', function() {
    let text = '<span>This is a log</span>'

    tool.log(text)
    expect($(log(0))).toContainText(text)
  })

  it('clear', function() {
    expect($tool.find('.eruda-logs li')).toHaveLength(0)
  })

  it('recognize url', function() {
    tool.log('http://liriliri.github.io/eruda/?plugin=fps')
    expect($(log(0))).toContainHtml(
      '<a href="http://liriliri.github.io/eruda/?plugin=fps" target="_blank">http://liriliri.github.io/eruda/?plugin=fps</a>'
    )
  })

  it('basic object', function() {
    let obj = { a: 1 }

    tool.log(obj)
    expect($(log(0))).toContainText('Object { a: 1 }')
  })

  it('html', function() {
    tool.html('<span class="color-blue">Blue</span>')
    expect($(log(0))).toContainElement('span.color-blue')
  })

  it('timing', function() {
    tool.time('eruda')
    tool.timeEnd('eruda')
    expect($(log(0))).toHaveText(/eruda: [.\d]+ms/)
  })

  it('error', function() {
    tool.error(new Error('error test'))
    expect($(log(0))).toContainElement('.eruda-stack')
    expect($(log(0))).toContainText('error test')
  })

  it('assert', function() {
    tool.assert(true, 'assert')
    expect(logs()).toHaveLength(0)

    tool.assert(false, 'assert')
    expect(logs()).toHaveLength(1)
  })

  it('count', function() {
    tool.count('test')
    tool.count('test')
    expect($(log(1))).toContainText('test: 2')
  })

  describe('substitution', function() {
    it('number', function() {
      tool.log('Eruda is %d', 1.2, 'year old')
      expect($(log(0))).toContainText('Eruda is 1 year old')
      logger.silentClear()

      tool.log('%i', 1.2, 'year old')
      expect($(log(0))).toContainText('1 year old')
      logger.silentClear()

      tool.log('%f', 1.2, 'year old')
      expect($(log(0))).toContainText('1.2 year old')
    })

    it('string', function() {
      tool.log('My name is %s', 'eruda')
      expect($(log(0))).toContainText('My name is eruda')
    })

    it('object', function() {
      tool.log('Object is %O', { a: 1 })
      expect($(log(0))).toContainText('Object is { a: 1 }')
      logger.silentClear()

      tool.log('Dom is %o', document.createElement('script'))
      expect($(log(0))).toContainText('Dom is <script></script>')
    })

    it('style', function() {
      tool.log('%cblue%cgreen', 'color:blue', 'color:green')
      expect($(log(0))).toContainText('bluegreen')
    })

    it('Repeat log', function() {
      for (let i = 0; i < 10; i++) tool.log(1)
      let $log = $tool.find('.eruda-log-item')
      expect(logs()).toHaveLength(1)
      expect($(log(0))).toContainText('10')
    })
  })

  describe('table', function() {
    it('wrong args', function() {
      tool.table('test')
      expect($tool.find('.eruda-table')).not.toContainElement('table')
    })

    it('sort keys', function() {
      tool.table([{ a: 1 }, { d: 2, a: 2 }, { c: 1 }])
      expect($(log(0)).find('.eruda-table thead tr')).toContainHtml(
        '<th>(index)</th><th>a</th><th>c</th><th>d</th>'
      )
    })

    it('basic', function() {
      tool.table([{ test: 1 }, { test: 2, test2: 3 }])
      expect($(log(0)).find('.eruda-table tbody tr')).toHaveLength(2)
      expect($(log(0)).find('.eruda-table thead th')).toHaveLength(3)
    })

    it('filter', function() {
      tool.table([{ test: 1 }, { test: 2, test2: 3 }], 'test')
      expect($(log(0)).find('.eruda-table thead th')).toHaveLength(2)
    })
  })

  describe('filter', function() {
    // Test case from https://github.com/liriliri/eruda/issues/14
    it('function', function() {
      tool.filter(function(log) {
        return log.type !== 'error'
      })

      let obj = {}
      Object.defineProperty(obj, 'a', {
        get: function() {
          tool.error('deprecated')

          return 1
        }
      })
      tool.log(obj)
      expect(logs()).toHaveLength(1)

      tool.filter('all')
    })

    it('all info error warn log', function() {
      tool
        .log('log')
        .info('info')
        .error('error')
        .warn('warn')
        .debug('debug')
      expect(logs()).toHaveLength(5)

      tool.filter('info')
      expect(logs()).toHaveLength(1)
      expect(log(0).log.type).toBe('info')

      tool.filter('error')
      expect(logs()).toHaveLength(1)
      expect(log(0).log.type).toBe('error')

      tool.filter('warn')
      expect(logs()).toHaveLength(1)
      expect(log(0).log.type).toBe('warn')

      tool.filter('debug')
      expect(logs()).toHaveLength(1)
      expect(log(0).log.type).toBe('debug')

      tool.filter('all')
    })

    it('regex', function() {
      tool.log('test').log('test2')
      expect(logs()).toHaveLength(2)

      tool.filter(/test2/)
      expect(logs()).toHaveLength(1)
      expect($(log(0))).toContainText('test2')

      tool.filter('all')
    })
  })

  describe('config', function() {
    let config = tool.config

    it('max number', function() {
      config.set('maxLogNum', '10')
      for (let i = 0; i < 20; i++) tool.log(i)
      expect(logs()).toHaveLength(10)
    })

    it('override console', function() {
      config.set('overrideConsole', true)
      console.log('test')
      expect($(log(0))).toContainText('test')
    })

    it('display extra info', function() {
      config.set('displayExtraInfo', true)
      tool.log('test')
      expect($(log(0))).toContainElement('.eruda-header')
    })
  })

  describe('ui', function() {
    it('clear', function() {
      tool.log('test')
      $('.eruda-clear-console').click()
      expect($tool.find('.eruda-logs li')).toHaveLength(0)
    })

    it('filter', function() {
      tool.log('test')
      tool.warn('test')
      expect(logs()).toHaveLength(2)
      $('.eruda-filter[data-filter="warn"]').click()
      expect(logs()).toHaveLength(1)
      $('.eruda-filter[data-filter="all"]').click()
    })
  })

  describe('execute', function() {
    it('js', function() {
      $tool.find('textarea').val('1+2')
      $('.eruda-execute').click()
      expect($(log(1))).toContainText('3')
    })
  })

  describe('events', function() {
    it('log', function() {
      let sum = 0
      function add(num) {
        sum += num
      }
      tool.on('log', add)
      tool.log(5)
      expect(sum).toBe(5)
      tool.log(6)
      expect(sum).toBe(11)
      tool.off('log', add)
      tool.log(1)
      expect(sum).toBe(11)
    })
  })
})
