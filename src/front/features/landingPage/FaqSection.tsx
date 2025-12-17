import { ChevronDown } from 'lucide-react'

export function FaqSection() {
  const faqs = [
    {
      question: 'What frameworks do you use?',
      answer:
        'We use the latest stable versions of React (Next.js), Tailwind CSS for styling, and Node.js (Hono) for the backend. The database is PostgreSQL managed via Drizzle ORM.',
    },
    {
      question: 'Can I use this for client projects?',
      answer:
        'Yes! The Agency license allows you to build unlimited projects for your clients. The Starter and Pro plans are for your own personal or business projects.',
    },
    {
      question: 'Do you offer refunds?',
      answer:
        "Due to the nature of digital products (you get the full code immediately), we generally do not offer refunds. However, if you have a technical issue we can't solve, we'll happily refund you.",
    },
    {
      question: 'How do I deploy this?',
      answer:
        'The boilerplate is optimized for Vercel, Railway, or any Docker-compatible hosting. We include a comprehensive deployment guide in the documentation.',
    },
  ]

  return (
    <section id="faq" className="py-24">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group bg-surface border border-white/5 rounded-lg open:border-primary/30 transition-all"
            >
              <summary className="flex justify-between items-center cursor-pointer p-6 font-medium">
                {faq.question}
                <ChevronDown className="w-5 h-5 text-muted group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-6 pb-6 text-muted text-sm leading-relaxed">{faq.answer}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
