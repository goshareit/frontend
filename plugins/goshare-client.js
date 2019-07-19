import Client from 'goshare-client'

export default ({ app }, inject) => {
  inject('gsClient', () => new Client({
    baseUrl: process.env.GOSHARE_BASE_URL,
    signingKey: process.env.GOSHARE_SIGNING_KEY,
    maxAgeMinutes: process.env.GOSHARE_MAX_AGE_MINUTES
  }))
}
