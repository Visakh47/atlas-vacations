import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-center px-6">
      <div>
        <div className="text-6xl mb-4">🗺️</div>
        <h1 className="text-3xl font-bold text-white mb-2">Destination Not Found</h1>
        <p className="text-white/50 mb-8">This adventure hasn&apos;t been mapped yet.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors font-medium"
        >
          <span>←</span>
          <span>Back to The Atlas</span>
        </Link>
      </div>
    </div>
  );
}
