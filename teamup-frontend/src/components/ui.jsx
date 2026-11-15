import { AlertCircle, CheckCircle2, Info, Loader2 } from 'lucide-react';

export function Spinner({ label = 'Loading' }) {
  return (
    <div role="status" className="flex items-center justify-center gap-2 py-12 text-muted">
      <Loader2 className="h-5 w-5 animate-spin" /> <span>{label}…</span>
    </div>
  );
}

const variants = {
  primary: 'bg-violet text-white hover:bg-violet-deep',
  lime: 'bg-lime text-ink hover:bg-lime-deep',
  ghost: 'bg-transparent text-ink border border-line hover:bg-violet-soft',
  danger: 'bg-white text-red-700 border border-red-200 hover:bg-red-50',
};


export function Button({
  variant = 'primary',
  loading = false,
  className = '',
  children,
  disabled,
  block = false,
  ...rest
}) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${block ? 'w-full' : ''} ${className}`}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}


export function Field({ label, id, hint, ...rest }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-bold">{label}</label>
      <input
        id={id}
        {...rest}
        className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm placeholder:text-muted/60 focus:border-violet"
      />
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

const alertStyles = {
  error: ['border-red-200 bg-red-50 text-red-800', AlertCircle],
  success: ['border-lime-deep/40 bg-lime/30 text-ink', CheckCircle2],
  info: ['border-violet/20 bg-violet-soft text-violet-deep', Info],
};

export function Alert({ type = 'error', children, className = '' }) {
  if (!children) return null;
  const [style, Icon] = alertStyles[type];
  return (
    <div role={type === 'error' ? 'alert' : 'status'} className={`flex gap-2.5 rounded-xl border px-3.5 py-3 text-sm ${style} ${className}`}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="min-w-0 break-words">{children}</div>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, children }) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-white/60 px-6 py-12 text-center">
      {Icon && <Icon className="mx-auto mb-3 h-8 w-8 text-violet" />}
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="mx-auto mt-1 max-w-sm text-sm text-muted">{children}</p>
    </div>
  );
}

export function PageHeader({ title, children }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <h1 className="text-3xl font-extrabold">{title}</h1>
      {children}
    </div>
  );
}

// Reports what is missing from the API contract rather than guessing
export function ContractNotice({ children }) {
  return <Alert type="info">{children}</Alert>;
}
