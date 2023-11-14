function validateUsername(username) {
  // Define the regular expression pattern for allowed characters.
  const pattern = /^[a-zA-Z0-9_]{6,20}$/;

  // Check if the username matches the pattern and is within the specified length range.
  if (pattern.test(username)) {
    return true; // Valid username
  } else {
    return false; // Invalid username
  }
}

module.exports = validateUsername;