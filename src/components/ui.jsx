export function Card({ children, className = '' }) {
  return (
    <div className={`bg-surface-container-lowest border border-outline-variant rounded-lg p-md ${className}`}>
      {children}
    </div>
  );
}

export function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = 'min-h-[48px] px-md rounded font-semibold flex items-center justify-center gap-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-secondary text-on-secondary hover:opacity-90',
    secondary: 'bg-transparent border-2 border-primary text-primary hover:bg-primary/5',
    ghost: 'bg-transparent text-primary hover:bg-surface-container',
    danger: 'bg-error text-on-error hover:opacity-90',
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Input({ label, className = '', ...props }) {
  return (
    <label className="flex flex-col gap-xs text-sm w-full">
      {label && <span className="font-medium text-primary">{label}</span>}
      <input
        className={`w-full min-h-[48px] rounded border-2 border-surface-dim bg-surface px-md focus:border-secondary focus:outline-none ${className}`}
        {...props}
      />
    </label>
  );
}

export function Select({ label, children, className = '', ...props }) {
  return (
    <label className="flex flex-col gap-xs text-sm w-full">
      {label && <span className="font-medium text-primary">{label}</span>}
      <select
        className={`w-full min-h-[48px] rounded border-2 border-surface-dim bg-surface px-md focus:border-secondary focus:outline-none ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}

export function ErrorBanner({ error }) {
  if (!error) return null;
  return (
    <div className="bg-error-container text-on-error-container rounded p-sm text-sm">
      {error}
    </div>
  );
}
