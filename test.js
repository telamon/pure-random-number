const test = require('tape')

const gen = require('.')
const { randomSync } = gen
test('generate random number', async t => {
  try {
    const n = await gen(1, 7)
    console.info('Random', n)
    t.ok(n >= 1)
    t.ok(n <= 7)
  } catch (err) {
    t.error(err)
  }
  t.end()
})

// Async is cool but sometimes a synchronized variant is required
// as a drop-in replacement for Math.random()
test('generate syncronized random number', t => {
  try {
    const n = randomSync(1, 7)
    console.info('Random', n)
    t.ok(n >= 1)
    t.ok(n <= 7)
  } catch (err) {
    t.error(err)
  }
  t.end()
})

test('distribution', async t => {
  try {
    const stats = {}
    const nTries = 2000000
    const interval = nTries / 20
    const printStats = p => {
      for (const k in stats) {
        const ppm = Math.round((stats[k] / p) * 100000) / 1000
        console.log(k, stats[k], `${ppm}%`)
      }
    }
    for (let i = 0; i < nTries; i++) {
      const n = await gen(10, 30)
      if (!stats[n]) stats[n] = 0
      ++stats[n]
      if (!(i % interval)) {
        console.log('Progress:', i / nTries)
        printStats(i)
      }
    }
    console.log('Final distribution')
    printStats(nTries)
  } catch (err) { t.error(err) }
  t.end()
})
