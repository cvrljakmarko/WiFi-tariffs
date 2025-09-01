import axios from 'axios'

const client = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: { 'Content-Type': 'application/json' }
})

// Basic response/error handling
client.interceptors.response.use(
    (res: any) => res,
    (error: { response: { status: any; data: { error: any } }; message: any }) => {
        // Normalize error message
        const status = error.response?.status
        const msg =
            error.response?.data?.error ||
            error.message ||
            'Request failed'
        return Promise.reject(new Error(status ? `HTTP ${status}: ${msg}` : msg))
    }
)

export default client
