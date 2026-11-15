import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2, UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'
import AuthLayout from '../components/AuthLayout'
import { useAuth } from '../context/AuthContext'
import { registerUser, getErrorMessage } from '../services/api'

const inputClass =
    'w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100'

export default function Register() {
    const { isAuthenticated } = useAuth()
    const navigate = useNavigate()

    const [form, setForm] = useState({
        name: '', // CHECK: field names must match your Java DTO
        email: '',
        password: '',
        confirmPassword: '', // frontend-only, not sent to the backend
    })
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    if (isAuthenticated) return <Navigate to="/dashboard" replace />

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (form.password.length < 6) {
            toast.error('Password must be at least 6 characters')
            return
        }
        if (form.password !== form.confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        setLoading(true)
        try {
            // CHECK: body sent to /api/auth/register
            const res = await registerUser({
                name: form.name,
                email: form.email,
                password: form.password,
            })
            console.log('REGISTER RESPONSE (send me this):', res.data) // remove later
            toast.success('Account created! Please log in.')
            navigate('/login')
        } catch (error) {
            toast.error(getErrorMessage(error, 'Registration failed'))
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthLayout
            title="Create your account"
            subtitle="Join TeamUp and start building with others."
            footer={
                <>
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
                        Log in
                    </Link>
                </>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-700">
                        Full name
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        autoComplete="name"
                        placeholder="Your full name"
                        value={form.name}
                        onChange={handleChange}
                        className={inputClass}
                    />
                </div>

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
                            autoComplete="new-password"
                            placeholder="At least 6 characters"
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

                <div>
                    <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-slate-700">
                        Confirm password
                    </label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        required
                        autoComplete="new-password"
                        placeholder="Re-enter your password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        className={inputClass}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 font-semibold text-white shadow-sm hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
                    {loading ? 'Creating account...' : 'Create account'}
                </button>
            </form>
        </AuthLayout>
    )
}