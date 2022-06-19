const { average } = require('../utils/for_testing')

// Describir o agrupar todos los test que vas a ejecutar en un mismo contexto,
// en esto caso el contexto es average ya que todos los test van a ser para la funcion average
describe.skip('average', () => {
  test('of one value is the value itself', () => {
    expect(average([1])).toBe(1)
  })

  test('of many is calculated correctly', () => {
    expect(average([1, 2, 3, 4, 5, 6])).toBe(3.5)
  })

  test('of empty array is zero', () => {
    expect(average([])).toBe(0)
  })

  test('of array contains undefined', () => {
    expect(average[undefined]).toBeUndefined()
  })
})
