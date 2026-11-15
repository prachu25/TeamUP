import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
    const { user, logout } = useAuth()
    return (
        <div className="mx-auto max-w-2xl p-10">
            <h1 className="text-2xl font-bold">Dashboard (temporary)</h1>
            <pre className="mt-4 overflow-auto rounded-lg bg-slate-900 p-4 text-sm text-green-300">
                {JSON.stringify(user, null, 2)}
            </pre>
            <button
                onClick={logout}
                className="mt-4 rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white"
            >
                Log out
            </button>
        </div>
    )
}