export default function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'wraith-ops');

  return (
    <footer className="border-t border-ops-green-dim bg-ops-dark mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-mono text-[10px] text-ops-text-dim tracking-widest text-center md:text-left">
            <span className="text-ops-red">⚠ CLASSIFIED</span>
            {' — '}
            W.R.A.I.T.H. OPERATIONS PORTAL © {year}
            {' — '}
            <span className="text-ops-text-dim">TITLE 50 AUTHORITY | ALL OPERATIONS DENIABLE</span>
          </div>
          <div className="font-mono text-[10px] text-ops-text-dim tracking-wider">
            Built with{' '}
            <span className="text-ops-red">♥</span>
            {' '}using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ops-green hover:text-ops-green-bright transition-colors"
            >
              caffeine.ai
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
