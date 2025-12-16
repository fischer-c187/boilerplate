import { Box, Wind, Database, CreditCard, Mail, Shield, BarChart2, Globe } from 'lucide-react'

export function TechStackMarquee() {
  const techStack = [
    { icon: Box, label: 'React 19', color: 'text-[#61DAFB]' },
    { icon: Wind, label: 'Tailwind', color: 'text-[#06B6D4]' },
    { icon: Database, label: 'PostgreSQL', color: 'text-[#336791]' },
    { icon: CreditCard, label: 'Stripe', color: 'text-[#635BFF]' },
    { icon: Mail, label: 'Resend', color: 'text-[#F59E0B]' },
    { icon: Shield, label: 'NextAuth', color: 'text-white' },
    { icon: BarChart2, label: 'PostHog', color: 'text-[#FF7636]' },
    { icon: Globe, label: 'i18n', color: 'text-white' },
  ]

  return (
    <section id="stack" className="py-12 border-y border-white/5 bg-surface/30">
      <div className="max-w-6xl mx-auto px-6 mb-8 text-center">
        <p className="text-sm font-mono text-muted uppercase tracking-widest">
          Powered by modern technologies
        </p>
      </div>

      <div className="relative flex overflow-x-hidden group">
        <div className="animate-marquee flex gap-16 items-center min-w-full px-8 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
          {techStack.map((tech, index) => (
            <span key={index} className="text-xl font-bold flex items-center gap-2">
              <tech.icon className={`${tech.color}`} />
              {tech.label}
            </span>
          ))}
        </div>

        <div className="absolute top-0 animate-marquee2 flex gap-16 items-center min-w-full px-8 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
          {techStack.map((tech, index) => (
            <span key={index} className="text-xl font-bold flex items-center gap-2">
              <tech.icon className={`${tech.color}`} />
              {tech.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
