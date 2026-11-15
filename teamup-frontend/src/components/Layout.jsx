
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LogOut, Trophy, Users, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const nav = [
  { to: 'hackathons', label: 'Hackathons', icon: Trophy },
  { to: 'teams', label: 'Teams', icon: Users },
  { to: 'leader-dashboard', label: 'Leader Dashboard', icon: Crown },
];

export default function Layout() {
  const { session, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-bold transition-colors ${isActive
      ? 'bg-lime text-ink'
      : 'text-white/80 hover:bg-white/10'
    }`;

  return (
    <div className="min-h-screen md:flex">

      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col bg-violet-deep p-5 text-white md:flex">

        <div className="mb-8 font-display text-2xl font-extrabold">
          TeamUp
        </div>

        <nav className="flex flex-1 flex-col gap-1.5">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={linkClass}>
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <p className="mb-3 truncate text-xs text-white/60">
          {session?.email}
        </p>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-bold text-white/80 hover:bg-white/10"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>

      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1 px-4 pb-28 pt-6 md:px-10 md:pb-10 md:pt-10">
        <div className="mx-auto max-w-5xl">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-10 flex justify-around border-t border-line bg-white px-2 py-2 md:hidden">

        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 rounded-lg px-4 py-1.5 text-xs font-bold ${isActive ? 'bg-lime text-ink' : 'text-muted'
              }`
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}

        <button
          onClick={onLogout}
          className="flex flex-col items-center gap-0.5 px-4 py-1.5 text-xs font-bold text-muted"
        >
          <LogOut className="h-5 w-5" />
          Log out
        </button>

      </nav>

    </div>
  );
}
