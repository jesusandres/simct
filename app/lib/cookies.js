/**
 * @author https://gist.github.com/cravindra
 */

/**
 * Returns a cookie value if a name is specified. Otherwise returns the entire cookies as an object
 * @param [name] - The name of the cookie to fetch the value for. Returns the entire map of cookies if not specified
 * @returns {string|Object} - The value of the cookie specified by `name` if specified. Otherwise returns a name value map of the available cookies
 */
export function getCookie (name) {
  const cookies = document.cookie.split(';')
    .reduce((acc, cookieString) => {
      const [key, value] = cookieString.split('=').map(s => s.trim())
      if (key && value) {
        acc[key] = decodeURIComponent(value)
      }
      return acc
    }, {})
  return name ? cookies[name] || '' : cookies
}

/**
 *
 * @param name - The name of the cookie to be set
 * @param value - The value of the cookie
 * @param options - supports any cookie option like path, expires, maxAge and domain. [MDN Cookie Reference](https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie)
 */
export function setCookie (name, value, options = {}) {
  document.cookie = `${name}=${encodeURIComponent(value)}${
        Object.keys(options)
            .reduce((acc, key) => {
                return acc + `;${key.replace(/([A-Z])/g, $1 => '-' + $1.toLowerCase())}=${
                    options[key]}`
            }, '')
        }`
}
