# pure-random-number

> A module for generating cryptographically secure pseudo-random numbers.

Zero dependencies ~56LOC, pure es6/esm, runs on browser + node without transpilation.

This module is based on code [originally written](https://gist.github.com/sarciszewski/88a7ed143204d17c3e42) by [Scott Arciszewski](https://github.com/sarciszewski), (WTFPL / CC0 / ZAP)

## Usage

Basic:

```js
import { randomNumber } from 'pure-random-number'

const n = await randomNumber(1, 20) // defaults to crypto:subtle getRandomValues()
console.log('Cryptographically Secure Random Number', n)
```

Bring your own generator:

```js
let prevHash = await sha256('Hello World')
const prng = async (nBytes) => {
    if (nBytes > 32) throw new Error('Entropy unsupported')
    prevHash = await sha256(prevHash)
    return prevHash
}

const n = await randomNumber(1, 20, prng)

console.log('Deterministic Random Number', n)
```

## API

see JSdoc annotations for accurate descriptions.

### `await randomNumber(minimum: number, maximum: number, generator = randomBytes)`

Returns a stable random positive integer within the specified range.

Note that the range is __inclusive__, and both numbers __must be positive integer values__.

It is not possible to securely generate a random value for floating point numbers, so if you are working with fractional numbers (eg. `1.24`), you will have to decide on a fixed 'precision' and turn them into integer values (eg. `124`).

### `bytesNeeded(min: number, max: number)`

Returns amount of bytes required for a given range

### `randomSeedNumber(seed: Uint8Array, minimum: number, maximum: number)`

Returns a stable random positive integer extracted from seed within the specified range.


## Changelog
* **3.2.0** (July 7, 2024) Removed obsolete validators, exported sync randomSeedNumber() & bytesNeeded()
* **3.0.0** (July 7, 2024): Converted to ESM, removed sync version
* **2.1.0** (June 12, 2020): Added sync version.
* __2.0.0__ (May 3, 2020): Removed dependencies and ported to standardjs
* __1.0.2__ (March 8, 2016): __*Security release!*__ Patched handling of large numbers; input values are now checked for `MIN_SAFE_INTEGER` and `MAX_SAFE_INTEGER`, and the correct bitwise operator is used (`>>>` rather than `>>`).
* __1.0.1__ (March 8, 2016): Unimportant file cleanup.
* __1.0.0__ (March 8, 2016): Initial release.

## License

Apache 2.0 - Decent Labs
