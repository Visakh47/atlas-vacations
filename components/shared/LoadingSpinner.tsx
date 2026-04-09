export function LoadingSpinner({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className="w-6 h-6 border-2 rounded-full animate-spin"
        style={{ borderColor: 'var(--a-border)', borderTopColor: 'var(--a-accent)' }}
      />
    </div>
  );
}

export function PageLoader() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: 'var(--a-bg)' }}
    >
      <LoadingSpinner />
    </div>
  );
}
