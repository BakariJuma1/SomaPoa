import axios from 'axios'

const api = axios.create({
  baseURL: 'https://somapoa.onrender.com',
  withCredentials: true, // so browser sends JWT cookies
})

export default api
