import axios from 'axios'
import queryString from 'query-string'
import firebase from './../firebase'

const axiosClient = axios.create({
  baseURL: 'https://asia-northeast1-realtime-demo-chart.cloudfunctions.net/api',
  // baseURL: 'http://localhost:5001/realtime-demo-chart/asia-northeast1/api',
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: (params) => queryString.stringify(params),
})

axiosClient.interceptors.request.use(async (config) => {
  //Process token here
  if (firebase.auth().currentUser) {
    //User
    const token = await firebase.auth().currentUser.getIdToken(true)
    if (token) config.headers['Authorization'] = `Bearer ${token}`
    return config
  } else {
    try {
      //Guest
      const guestId = window.localStorage.getItem('guestId')
      if (guestId) {
        config.headers['guestId'] = guestId
        return config
      }
    } catch (error) {
      console.log(error)
    }
  }
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
    console.log(error)
  }
)

export default axiosClient
