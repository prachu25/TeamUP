import { Link } from 'react-router-dom'
import { Users } from 'lucide-react'

export default function AuthLayout({ title, subtitle, children, footer }) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-brand-50 to-white px-4 py-10">
            <div className="w-full max-w-md">
                <Link to="/" className="mb-8 flex items-center justify-center gap-2 text-2xl font-bold text-slate-900">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white">
                        <Users size={22} />
                    </span>
                    TeamUp
                </Link>

                <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-lg shadow-slate-200/50">
                    <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
                    <p className="mt-1 text-slate-500">{subtitle}</p>
                    <div className="mt-6">{children}</div>
                </div>

                <p className="mt-6 text-center text-sm text-slate-600">{footer}</p>
            </div>
        </div>
    )
}