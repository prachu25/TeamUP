import { createContext, useContext, useState } from 'react'
import {
    loginUser,
    logoutRequest,
    setCredentials,
    clearCredentials,
    hasCredentials,
} from '../services/api'

const AuthContext = createContext(null)
const USER_KEY = 'teamup_user'

export function AuthProvider({ children }) {
    // Restore the user after a page refresh (only if credentials are still stored).
    const [user, setUser] = useState(() => {
        try {
            const saved = sessionStorage.getItem(USER_KEY)
            return saved && hasCredentials() ? JSON.parse(saved) : null
        } catch {
            return null
        }
    })

    // payload = body sent to /api/auth/login
    // username/password = what Basic Auth will use for later requests
    const login = async (payload, username, password) => {
        const res = await loginUser(payload)
        console.log('LOGIN RESPONSE (send me this):', res.data) // remove later
        setCredentials(username, password)
        sessionStorage.setItem(USER_KEY, JSON.stringify(res.data))
        setUser(res.data)
        return res.data
    }

    const logout = async () => {
        try {
            await logoutRequest() // backend is stateless; this is best-effort
        } catch {
            // ignore: we clear credentials locally either way
        }
        clearCredentials()
        sessionStorage.removeItem(USER_KEY)
        setUser(null)
    }

    const updateLocalUser = (newUser) => {
        sessionStorage.setItem(USER_KEY, JSON.stringify(newUser))
        setUser(newUser)
    }

    return (
        <AuthContext.Provider
            value={{ user, isAuthenticated: !!user, login, logout, updateLocalUser }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)