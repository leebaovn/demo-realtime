import axios from 'axios'
import queryString from 'query-string'
import firebase, { auth } from './../firebase'

const axiosClient = axios.create({
  baseURL: 'http://localhost:5001/realtime-demo-chart/asia-northeast1/api',
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: (params) => queryString.stringify(params),
})

axiosClient.interceptors.request.use(async (config) => {
  //Process token here

  const token = await firebase.auth().currentUser.getIdToken(true)
  if (token) config.headers['Authorization'] = `Bearer ${token}`
  return config
})

axiosClient.interceptors.response.use(
  async (response) => {
    if (response && response.data) {
      return response.data
    }
    return response
  },
  (error) => {
    throw error
  }
)

export default axiosClient
