import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5555',
  withCredentials: true, // so browser sends JWT cookies
})

export default api
