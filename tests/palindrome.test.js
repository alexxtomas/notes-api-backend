const { palindrome } = require('../utils/for_testing')

test.skip('palindrome of alex', () => {
  const result = palindrome('alex')

  expect(result).toBe('xela')
})

test.skip('palindrome of empty string', () => {
  const result = palindrome('')

  expect(result).toBe('')
})

test.skip('palindrome of undefined', () => {
  const result = palindrome()

  expect(result).toBeUndefined()
})
