import test from 'tape'
import crypto from 'node:crypto'
import { randomNumber } from './index.js'
globalThis.crypto ||= crypto

test('generate random number', async t => {
  try {
    const n = await randomNumber(1, 7)
    console.info('Random', n)
    t.ok(n >= 1)
    t.ok(n <= 7)
  } catch (err) {
    t.error(err)
  }
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
      const n = await randomNumber(10, 30)
      if (!stats[n]) stats[n] = 0
      ++stats[n]
      if (!(i % interval)) {
        console.log('Progress:', i / nTries)
        printStats(i)
      }
    }
    console.log('Final distribution (optimal 1/21 = 4.7619%')
    printStats(nTries)
  } catch (err) { t.error(err) }
})
