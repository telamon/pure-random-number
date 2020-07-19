# pure-random-number

> A module for generating cryptographically secure pseudo-random numbers.

- no dependencies
- no transpilation
- [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
- browser support via (Webpack/Rollup/Browserify)

This module is based on code [originally written](https://gist.github.com/sarciszewski/88a7ed143204d17c3e42) by [Scott Arciszewski](https://github.com/sarciszewski), released under the WTFPL / CC0 / ZAP.

## Usage

Sync:
```js
const { randomSync } = require('pure-random-number')

const n = randomSync(10, 30)
console.log('Secure unbiased random number:', n)
```


Async:
```js
const randomNumber = require('pure-random-number')

randomNumber(10, 30)
  .then(number => console.log('Your number is:', number))
  .catch(err => console.error(err))
```

## API
### randomSync(minimum, maximum)

Same as `randomNumber(minimum, maximum)` except blocks
until a sufficiently random number has been aquired.

### randomNumber(minimum, maximum)

Returns a Promise that resolves to a random number within the specified range.

Note that the range is __inclusive__, and both numbers __must be integer values__. It is not possible to securely generate a random value for floating point numbers, so if you are working with fractional numbers (eg. `1.24`), you will have to decide on a fixed 'precision' and turn them into integer values (eg. `124`).

* __minimum__: The lowest possible value in the range.
* __maximum__: The highest possible value in the range. Inclusive.

## Changelog
* **2.1.0** (June 12, 2020): Added sync version.
* __2.0.0__ (May 3, 2020): Removed dependencies and ported to standardjs
* __1.0.2__ (March 8, 2016): __*Security release!*__ Patched handling of large numbers; input values are now checked for `MIN_SAFE_INTEGER` and `MAX_SAFE_INTEGER`, and the correct bitwise operator is used (`>>>` rather than `>>`).
* __1.0.1__ (March 8, 2016): Unimportant file cleanup.
* __1.0.0__ (March 8, 2016): Initial release.

## Contributing

Be aware that by making a pull request, you agree to release your modifications under the license stated below.

## License

Parent license(s) permit change of terms for derivative works.
Thus I now proclaim the license for this repository to be limited to
`GNU AGPL version 3`

> AGPL prevents non-open parties from doing what I just did
