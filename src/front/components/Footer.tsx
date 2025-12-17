export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/5 py-12 bg-surface/30">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-white text-xs font-bold">
              B
            </div>
            <span className="font-bold tracking-tight">Drsky</span>
          </div>
          <p className="text-muted text-sm">Ship your SaaS in days, not months.</p>
        </div>

        <div className="flex gap-8 text-sm text-muted">
          <a href="#" className="hover:text-foreground transition-colors">
            Twitter
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            GitHub
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            Discord
          </a>
        </div>

        <p className="text-muted text-xs">© 2024 Drsky. All rights reserved.</p>
      </div>
    </footer>
  )
}
