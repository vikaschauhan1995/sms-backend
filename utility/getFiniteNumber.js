/**
 * Checks if a variable can be converted to a finite number and returns it.
 *
 * @param {*} value The variable to check and convert.
 * @returns {number | null} The finite number if conversion is successful, otherwise null.
 */
function getFiniteNumber(value) {
  // 1. Handle cases where the input is already a number type
  //    This includes actual numbers, NaN, Infinity, -Infinity.
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  // 2. If it's not a string or number, it's likely not a valid number for conversion.
  //    This catches objects, arrays, booleans, undefined, etc.
  if (typeof value !== "string") {
    return null;
  }

  // 3. Trim whitespace from the string
  const trimmedValue = value.trim();

  // 4. Handle empty string after trimming.
  //    Number("") converts to 0, but often an empty string should not be treated as a number.
  if (trimmedValue === "") {
    return null;
  }

  // 5. Attempt to convert the string to a number.
  //    The `Number()` constructor is good for general conversion:
  //    - "123" -> 123
  //    - "3.14" -> 3.14
  //    - "  -5  " -> -5
  //    - "0" -> 0
  //    - "011" -> 11 (automatically removes leading zeros)
  //    - "abc" -> NaN
  //    - "123a" -> NaN
  const convertedNumber = Number(trimmedValue);

  // 6. Check if the converted value is a finite number.
  //    `Number.isFinite()` is preferred over `isNaN()` because it also excludes `Infinity` and `-Infinity`.
  if (Number.isFinite(convertedNumber)) {
    return convertedNumber;
  } else {
    // If it's not a finite number, it means the string was not purely numeric
    return null;
  }
}

module.exports = {
    getFiniteNumber
}