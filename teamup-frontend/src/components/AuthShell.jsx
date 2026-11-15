import { Link } from 'react-router-dom';

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <section className="flex flex-col justify-between bg-violet-deep p-8 text-white lg:p-14">
        <div className="font-display text-2xl font-extrabold">TeamUp</div>
        <div className="my-10 max-w-md">
          <h2 className="text-4xl font-extrabold leading-tight lg:text-5xl">Find your team. Ship the idea.</h2>
          <p className="mt-4 text-white/70">Browse hackathons, join a team or lead your own.</p>
        </div>
        <div className="hidden h-2 w-24 rounded-full bg-lime lg:block" />
      </section>
      <section className="flex items-center justify-center p-6 lg:p-14">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-extrabold">{title}</h1>
          <p className="mb-6 mt-1 text-sm text-muted">{subtitle}</p>
          {children}
          <p className="mt-6 text-center text-sm text-muted">{footer}</p>
        </div>
      </section>
    </div>
  );
}
export const AuthLink = ({ to, children }) => (
  <Link to={to} className="font-bold text-violet underline">{children}</Link>
);
