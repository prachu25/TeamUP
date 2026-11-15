import axios from 'axios'
import toast from 'react-hot-toast'

const TOKEN_KEY = 'teamup_basic_token'

// ---------- Basic Auth credential handling ----------
// Backend is stateless, so we keep the credentials in the browser
// (sessionStorage: survives refresh, cleared when the tab closes).

const toBase64 = (text) => {
    const bytes = new TextEncoder().encode(text)
    let binary = ''
    bytes.forEach((b) => (binary += String.fromCharCode(b)))
    return btoa(binary)
}

export const setCredentials = (username, password) => {
    sessionStorage.setItem(TOKEN_KEY, toBase64(`${username}:${password}`))
}

export const clearCredentials = () => sessionStorage.removeItem(TOKEN_KEY)

export const hasCredentials = () => !!sessionStorage.getItem(TOKEN_KEY)

// ---------- Axios instance ----------

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
})

// Attach the Authorization header to every request,
// except register/login (a wrong header on those can cause a 401).
api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem(TOKEN_KEY)
    const isAuthUrl = config.url?.startsWith('/api/auth/')
    if (token && !isAuthUrl) {
        config.headers.Authorization = `Basic ${token}`
    }
    return config
})

// Handle 401 / 403 in one place.
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status
        const isAuthUrl = error.config?.url?.startsWith('/api/auth/')

        if (status === 401 && !isAuthUrl) {
            clearCredentials()
            toast.error('Session expired. Please log in again.')
            window.location.assign('/login')
        } else if (status === 403) {
            toast.error("You don't have permission to do that.")
        } else if (!error.response) {
            toast.error('Cannot reach the server. Is the backend running?')
        }
        return Promise.reject(error)
    }
)

// Helper to read a readable message from a failed request.
export const getErrorMessage = (error, fallback = 'Something went wrong') =>
    error.response?.data?.message ||
    (typeof error.response?.data === 'string' ? error.response.data : null) ||
    fallback

// ---------- Auth ----------
export const registerUser = (data) => api.post('/api/auth/register', data)
export const loginUser = (data) => api.post('/api/auth/login', data)
export const logoutRequest = () => api.put('/api/user/logout')

// ---------- Hackathons ----------
export const getHackathons = () => api.get('/api/hackathons')
export const searchHackathons = (name) =>
    api.get('/api/hackathons/search', { params: { name } })
export const participateInHackathon = (hackathonId, userId) =>
    api.post(`/api/hackathons/${hackathonId}/participate`, null, { params: { userId } })
export const cancelParticipation = (userId, hackathonId) =>
    api.delete('/api/participants/cancle', { params: { userId, hackathonId } }) // "cancle" matches the backend spelling

// ---------- Teams ----------
export const getTeams = () => api.get('/api/teams')
export const createTeam = (userId, data) =>
    api.post('/api/teams/create', data, { params: { userId } })

// ---------- Join requests ----------
export const sendJoinRequest = (teamId, userId) =>
    api.post('/api/join-requests/send', null, { params: { teamId, userId } })
export const acceptJoinRequest = (requestId, leaderId) =>
    api.put(`/api/join-requests/accept/${requestId}`, null, { params: { leaderId } })
export const rejectJoinRequest = (requestId, leaderId) =>
    api.put(`/api/join-requests/reject/${requestId}`, null, { params: { leaderId } }) // confirm: is this id a request id or team id?

// ---------- Users ----------
export const updateUser = (userId, data) => api.put(`/api/users/${userId}`, data)

export default api