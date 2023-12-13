const crypto = require('crypto')

export function copytoclipboard(element) {
    element.focus()
    element.select()
    document.execCommand('copy');
}

export function generateRandomString(length) {
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}