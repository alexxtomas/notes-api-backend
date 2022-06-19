const add = (a, b) => {
  return a - b
}

// if (add(0, 0) !== 0) {
//   new Error('add of 0 and 0 expected to be 0')
// }

// if (add(1, 3) !== 4) {
//   new Error('add of 1 and 3 expected to be 4')
// }

const checks = [
  { a: 0, b: 0, result: 0 },
  { a: 1, b: 3, result: 4 },
  { a: -3, b: 3, result: 3 }
]

checks.forEach(check => {
  const { a, b, result } = check

  console.assert(
    add(a, b) === result,
    `add of ${a} and ${b} expected to be ${result}`

  )
})

console.log(`${checks.length} checks performed...`)

// console.assert(
//   add(0, 0) === 0,
//   'add of 0 and 0 expected to be 0'
// )

// console.assert(
//   add(1, 3) === 4,
//   'add of 1 and 3 expected to be 4'
// )
