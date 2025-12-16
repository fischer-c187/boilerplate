export function CtaSection() {
  return (
    <section className="py-24 text-center">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">
          Stop wasting time on{' '}
          <span className="text-muted line-through decoration-danger decoration-4">
            boilerplate
          </span>
          .
        </h2>
        <p className="text-xl text-muted mb-10">Start building your profitable SaaS today.</p>
        <button className="bg-primary text-white px-10 py-4 rounded-full font-bold text-lg shadow-xl shadow-primary/30 hover:scale-105 transition-transform">
          Get Instant Access
        </button>
      </div>
    </section>
  )
}
