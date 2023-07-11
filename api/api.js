const { Config } = require('../config');
const axios = require('axios')

const api = axios.create({
  baseURL: Config().TGSTATS_URL,
  responseType: 'json',
});

const getCategories = async (localization) => {
  console.log(Config().TGSTATS_TOKEN)
  const response = await api.get('database/categories', {
    params: {
      token: Config().TGSTATS_TOKEN,
      lang: 'ru'
    },
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  })
  return response.data
}

const getPosts = async () => {
  const response = await api.get('posts/search', {
    params: {
      token: Config().TGSTATS_TOKEN,
      q: 'Технологія',
      language: 'ua',
      country: 'ua',
      category: 'tech',
      limit: 50,
      peerType: 'channel'
    },
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  })
  return response.data
}

const getChannels = async () => {
  const response = await api.get('channels/search', {
    params: {
      token: Config().TGSTATS_TOKEN,
      language: 'ukrainian',
      country: 'ua',
      category: 'tech',
      limit: 100,
      peerType: 'channel'
    },
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  })
  return response.data
}

module.exports.getChannels = getChannels
module.exports.getPosts = getPosts
module.exports.getCategories = getCategories
