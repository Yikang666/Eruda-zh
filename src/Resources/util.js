import lowerCase from 'licia/lowerCase'
import contain from 'licia/contain'
import filter from 'licia/filter'

export function filterData(data, keyword) {
  keyword = lowerCase(keyword)

  if (!keyword) return data

  return filter(data, ({ key, val }) => {
    return contain(lowerCase(key), keyword) || contain(lowerCase(val), keyword)
  })
}
