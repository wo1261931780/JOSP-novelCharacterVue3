import axios from 'axios'

const request = axios.create({
  baseURL: '/api',
  timeout: 300000  // 5分钟，给 AI 生成足够时间
})

request.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 200) {
      return Promise.reject(new Error(res.message || 'Error'))
    }
    return res.data
  },
  error => {
    return Promise.reject(error)
  }
)

export default request
