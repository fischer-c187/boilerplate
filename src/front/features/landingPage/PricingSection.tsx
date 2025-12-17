import { Check } from 'lucide-react'

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 border-t border-white/5 bg-[#0D0D0D]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
          <p className="text-muted">Pay once, own it forever. No monthly fees.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Starter */}
          <div className="bg-surface border border-white/5 rounded-xl p-8 flex flex-col hover:border-white/10 transition-colors">
            <h3 className="text-xl font-medium mb-2">Starter</h3>
            <div className="text-3xl font-bold mb-6">$99</div>
            <p className="text-muted text-sm mb-8">Perfect for hobby projects and experiments.</p>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-sm text-muted">
                <Check className="w-4 h-4 text-foreground" /> Single Project
              </li>
              <li className="flex items-center gap-3 text-sm text-muted">
                <Check className="w-4 h-4 text-foreground" /> Authentication
              </li>
              <li className="flex items-center gap-3 text-sm text-muted">
                <Check className="w-4 h-4 text-foreground" /> Database Setup
              </li>
            </ul>
            <button className="w-full bg-surface border border-white/10 py-2 rounded-md font-medium text-sm hover:bg-white/5 transition-colors">
              Buy Starter
            </button>
          </div>

          {/* Pro (Highlighted) */}
          <div className="bg-surface/50 border border-primary/50 rounded-xl p-8 flex flex-col relative shadow-lg shadow-primary/10 scale-105 z-10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Best Value
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">Pro Bundle</h3>
            <div className="text-4xl font-bold mb-6">$149</div>
            <p className="text-muted text-sm mb-8">Everything you need to build a serious SaaS.</p>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-sm">
                <Check className="w-4 h-4 text-primary" /> Unlimited Projects
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Check className="w-4 h-4 text-primary" /> <strong>Lifetime Updates</strong>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Check className="w-4 h-4 text-primary" /> All Integrations Included
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Check className="w-4 h-4 text-primary" /> Premium Support
              </li>
            </ul>
            <button className="w-full bg-primary text-white py-3 rounded-md font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors">
              Get Pro Bundle
            </button>
          </div>

          {/* Agency */}
          <div className="bg-surface border border-white/5 rounded-xl p-8 flex flex-col hover:border-white/10 transition-colors">
            <h3 className="text-xl font-medium mb-2">Agency</h3>
            <div className="text-3xl font-bold mb-6">$299</div>
            <p className="text-muted text-sm mb-8">
              For agencies and teams building multiple products.
            </p>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-sm text-muted">
                <Check className="w-4 h-4 text-foreground" /> Unlimited Developers
              </li>
              <li className="flex items-center gap-3 text-sm text-muted">
                <Check className="w-4 h-4 text-foreground" /> Commercial License
              </li>
              <li className="flex items-center gap-3 text-sm text-muted">
                <Check className="w-4 h-4 text-foreground" /> Priority Support
              </li>
            </ul>
            <button className="w-full bg-surface border border-white/10 py-2 rounded-md font-medium text-sm hover:bg-white/5 transition-colors">
              Buy Agency
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
