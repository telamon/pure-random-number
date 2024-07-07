/**
 * Generates a stable random positive integer.
 * The range is inclusive.
 * The optional generator function might be invoked multiple times until
 * a secure number is found.
 * @param {number} minimum Minium value positive integer
 * @param {number} maximum Minimum value positive integer
 * @param {(n_bytes: number) => Promise<Uint8Array[n_bytes]>} generator Optional generator function
 * @returns {number} A random positive integer
 */
export async function randomNumber (minimum = 1, maximum = 6, generator = randomBytes) {
  if (typeof generator !== 'function') throw new Error('Expected generator to be a function')
  if (!Number.isSafeInteger(minimum) || minimum < 0) throw new Error('MinNotSafePositiveInteger')
  if (!Number.isSafeInteger(maximum) || maximum < 0) throw new Error('MaxNotSafePositiveInteger')
  if (!(maximum > minimum)) throw new RangeError('MinHigherThanMax')
  const range = maximum - minimum
  const { bytesNeeded } = calculateParameters(range)

  while (true) {
    const bytes = await generator(bytesNeeded)
    const n = randomSeedNumber(bytes, minimum, maximum)
    if (n === -1) continue // re-roll
    return n
  }
}

/**
 * Extracts a random positive integer from seed,
 * use exported function bytesNeeded() to approximate amount of bytes
 * that will be consumed.
 *
 * Returns -1 if provided seed results in a biased number,
 * generate a new seed and call again.
 *
 * @param {Uint8Array} seed Random bytes
 * @param {number} minimum Minium value positive integer
 * @param {number} maximum Minimum value positive integer
 * @returns {number} A random positive integer or -1 on failure
 */
export function randomSeedNumber (seed, minimum = 1, maximum = 6) {
  if (!Number.isSafeInteger(minimum) || minimum < 0) throw new Error('MinNotSafePositiveInteger')
  if (!Number.isSafeInteger(maximum) || maximum < 0) throw new Error('MaxNotSafePositiveInteger')
  if (!(maximum > minimum)) throw new RangeError('MinHigherThanMax')

  const range = maximum - minimum
  const { bytesNeeded, mask } = calculateParameters(range)
  if (seed.length < bytesNeeded) throw new Error('Seed to short')
  const bytes = toU8(seed)
  let randomValue = 0
  /* Turn the random bytes into an integer, using bitwise operations. */
  for (let i = 0; i < bytesNeeded; i++) {
    randomValue |= (bytes[i] << (8 * i))
  }
  /* We apply the mask to reduce the amount of attempts we might need
   * to make to get a number that is in range. This is somewhat like
   * the commonly used 'modulo trick', but without the bias:
   *
   *   "Let's say you invoke secure_rand(0, 60). When the other code
   *    generates a random integer, you might get 243. If you take
   *    (243 & 63)-- noting that the mask is 63-- you get 51. Since
   *    51 is less than 60, we can return this without bias. If we
   *    got 255, then 255 & 63 is 63. 63 > 60, so we try again.
   *
   *    The purpose of the mask is to reduce the number of random
   *    numbers discarded for the sake of ensuring an unbiased
   *    distribution. In the example above, 243 would discard, but
   *    (243 & 63) is in the range of 0 and 60."
   *
   *   (Source: Scott Arciszewski)
   */
  randomValue = randomValue & mask
  if (randomValue <= range) {
    return minimum + randomValue
  } else {
    return -1
  }
}

/**
 * Calculates the amount of entropy required
 * for a given number range.
 * @param {number} min Integer
 * @param {number} max Integer
 * @returns {number} number of bytes
 */
export function bytesNeeded (min, max) {
  return calculateParameters(max - min).bytesNeeded
}

function randomBytes (n) {
  const buf = new Uint8Array(n)
  globalThis.crypto.getRandomValues(buf)
  return buf
}

function calculateParameters (range) {
  /* This does the equivalent of:
   *
   *    bitsNeeded = Math.ceil(Math.log2(range));
   *    bytesNeeded = Math.ceil(bitsNeeded / 8);
   *    mask = Math.pow(2, bitsNeeded) - 1;
   *
   * ... however, it implements it as bitwise operations, to sidestep any
   * possible implementation errors regarding floating point numbers in
   * JavaScript runtimes. This is an easier solution than assessing each
   * runtime and architecture individually.
   */
  let bitsNeeded = 0
  let bytesNeeded = 0
  let mask = 1

  while (range > 0) {
    if (bitsNeeded % 8 === 0) {
      bytesNeeded += 1
    }
    bitsNeeded += 1
    mask = mask << 1 | 1 /* 0x00001111 -> 0x00011111 */
    /* SECURITY PATCH (March 8, 2016):
     *   As it turns out, `>>` is not the right operator to use here, and
     *   using it would cause strange outputs, that wouldn't fall into
     *   the specified range. This was remedied by switching to `>>>`
     *   instead, and adding checks for input parameters being within the
     *   range of 'safe integers' in JavaScript.
     */
    range = range >>> 1 /* 0x01000000 -> 0x00100000 */
  }
  return { bitsNeeded, bytesNeeded, mask }
}

/**
 * Normalize buffers to Uint8Array or throw
 * @param {ArrayBuffer|Uint8Array|Buffer} o
 * @returns Uint8Array
 */
export function toU8 (o) {
  if (o instanceof ArrayBuffer) return new Uint8Array(o)
  if (o instanceof Uint8Array) return o
  // node:Buffer to Uint8Array
  if (!(o instanceof Uint8Array) && o?.buffer) {
    return new Uint8Array(o.buffer, o.byteOffset, o.byteLength)
  }
  throw new Error('Expected Uint8Array')
}
