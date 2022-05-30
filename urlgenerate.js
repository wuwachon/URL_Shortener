const letters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const url = function(length) {
  let str = ''
  for(let i = 0; i < length; i++) {
    str += letters[Math.floor(Math.random() * 62)]
  }
  return str
}

module.exports = url