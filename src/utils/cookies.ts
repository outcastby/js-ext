import Cookies from 'js-cookie'
import sjcl from 'sjcl'
import Config from '../config'

const set = (key: string, value: string): void => {
  Cookies.set(key, sjcl.encrypt(Config.get(['jsExt', 'secretKey']), value), {
    expires: Config.get('cookiesExpires'),
    secure: process.env.NODE_ENV === 'production',
  })
}

const get = (key: string): string | undefined => Cookies.get(key)

const remove = (key: string): void => Cookies.remove(key)

const getDecrypted = (key: string): string | undefined =>
  sjcl.decrypt(Config.get(['jsExt', 'secretKey']), get(key) || '')

export default {
  set,
  get,
  remove,
  getDecrypted,
}
