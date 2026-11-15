import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2, LogIn } from 'lucide-react'
import toast from 'react-hot-toast'
import AuthLayout from '../components/AuthLayout'
import { useAuth } from '../context/AuthContext'
import { getErrorMessage } from '../services/api'

const inputClass =
    'w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100'

export default function Login() {
    const { login, isAuthenticated } = useAuth()
    const navigate = useNavigate()

    const [form, setForm] = useState({ email: '', password: '' }) // CHECK: field names
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    if (isAuthenticated) return <Navigate to="/dashboard" replace />

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            // CHECK: body sent to /api/auth/login, and the Basic Auth username (email assumed)
            await login({ email: form.email, password: form.password }, form.email, form.password)
            toast.success('Welcome back!')
            navigate('/dashboard')
        } catch (error) {
            toast.error(getErrorMessage(error, 'Invalid email or password'))
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Log in to find your next hackathon team."
            footer={
                <>
                    Don't have an account?{' '}
                    <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700">
                        Sign up
                    </Link>
                </>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={handleChange}
                        className={inputClass}
                    />
                </div>

                <div>
                    <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            required
                            autoComplete="current-password"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={handleChange}
                            className={`${inputClass} pr-11`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 font-semibold text-white shadow-sm hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
                    {loading ? 'Logging in...' : 'Log in'}
                </button>
            </form>
        </AuthLayout>
    )
}