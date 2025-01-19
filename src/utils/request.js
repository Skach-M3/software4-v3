import axios from 'axios'
import { Message } from 'element-ui'
import router from '../router'

const server = axios.create({
  // 过期时间
  timeout: 600000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
})

server.defaults.baseURL = '/api'

// 请求拦截器
server.interceptors.request.use(
  config => {
    // 在发送请求之前可以进行一些处理，例如添加认证信息等
    // config.headers['Authorization'] = 'Bearer ' + getToken();
    return config
  },
  error => {
    // 请求错误处理
    return Promise.reject(error)
  }
)

// 响应拦截器
server.interceptors.response.use(
  response => {
    // 对响应数据进行处理
    const res = response.data
    console.log(response);
    let msg = res.msg || '未知错误，请联系管理员'
    if (response.status === 200) { //这里对返回数据进行处理，要符合返回数据的数据结构
      msg = res
      return Promise.resolve(msg)
    }
    switch (response.status) {
      case 401:
        msg = '认证失败，无法访问系统资源'
        router.replace('/')
        break
      
      default:
        msg = '系统未知错误'
        break
    }
    
      Message.error(msg)
      return Promise.reject(msg)
    
  },
  error => {
    // 响应错误处理
    if (error.code === 'ECONNABORTED') {
        // 请求超时
        console.log('请求超时');
        
    }
    return Promise.reject('请求超时')
  }
)

export default server