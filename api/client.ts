import axios, { AxiosError, AxiosResponse } from 'axios'

const client = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: { 'Content-Type': 'application/json' }
})

client.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error: AxiosError) => {
        const msg = error.message || 'Request failed'
        return Promise.reject(new Error(msg))
    }
)

export default client
