import { Link } from 'react-router-dom'
import { Users, Trophy, Send, Rocket, CheckCircle2, Search } from 'lucide-react'

const features = [
    {
        icon: Search,
        title: 'Discover hackathons',
        text: 'Browse and search upcoming hackathons, and see everything you need before you join.',
    },
    {
        icon: Users,
        title: 'Build your team',
        text: 'Create your own team and lead it, or find one that already needs your skills.',
    },
    {
        icon: Send,
        title: 'Send join requests',
        text: 'Request a spot in any team. Leaders review and accept or reject in one click.',
    },
]

const steps = [
    'Create your free account',
    'Participate in a hackathon',
    'Create a team or join an existing one',
    'Build something great together',
]

export default function Landing() {
    return (
        <div className="min-h-screen bg-white">
            {/* Navbar */}
            <header className="sticky top-0 z-10 border-b border-slate-100 bg-white/80 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
                    <Link to="/" className="flex items-center gap-2 text-xl font-bold text-slate-900">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
                            <Users size={20} />
                        </span>
                        TeamUp
                    </Link>
                    <nav className="flex items-center gap-3">
                        <Link
                            to="/login"
                            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900"
                        >
                            Log in
                        </Link>
                        <Link
                            to="/register"
                            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
                        >
                            Sign up
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Hero */}
            <section className="bg-gradient-to-b from-brand-50 to-white">
                <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:py-28">
                    <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 text-sm font-medium text-brand-700">
                        <Trophy size={16} /> Built for hackathon builders
                    </span>
                    <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
                        Find the right team for your next hackathon
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
                        TeamUp connects hackathon participants with teammates. Join a hackathon, form a
                        team, and start building together.
                    </p>
                    <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Link
                            to="/register"
                            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white shadow-lg shadow-brand-600/25 hover:bg-brand-700"
                        >
                            <Rocket size={18} /> Get started free
                        </Link>
                        <Link
                            to="/login"
                            className="rounded-xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            I already have an account
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="mx-auto max-w-6xl px-4 py-20">
                <h2 className="text-center text-3xl font-bold text-slate-900">
                    Everything you need to team up
                </h2>
                <div className="mt-12 grid gap-6 md:grid-cols-3">
                    {features.map(({ icon: Icon, title, text }) => (
                        <div
                            key={title}
                            className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                                <Icon size={24} />
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3>
                            <p className="mt-2 text-slate-600">{text}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* How it works */}
            <section className="bg-slate-50">
                <div className="mx-auto max-w-3xl px-4 py-20">
                    <h2 className="text-center text-3xl font-bold text-slate-900">How it works</h2>
                    <ul className="mt-10 space-y-4">
                        {steps.map((step, i) => (
                            <li
                                key={step}
                                className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm"
                            >
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 font-semibold text-white">
                                    {i + 1}
                                </span>
                                <span className="font-medium text-slate-800">{step}</span>
                                <CheckCircle2 className="ml-auto text-brand-500" size={20} />
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-100 py-8 text-center text-sm text-slate-500">
                © {new Date().getFullYear()} TeamUp. Build together.
            </footer>
        </div>
    )
}