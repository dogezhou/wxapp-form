module.exports = function isMergeableObject(value) {
  return isNonNullObject(value) && isNotSpecial(value)
}

function isNonNullObject(value) {
  return !!value && typeof value === 'object'
}

function isNotSpecial(value) {
  var stringValue = Object.prototype.toString.call(value)

  return stringValue !== '[object RegExp]'
    && stringValue !== '[object Date]'
}
