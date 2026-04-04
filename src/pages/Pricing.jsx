import { Link } from 'react-router-dom'
import { Check, X, Sparkles, Zap, Crown } from 'lucide-react'
import { useApp } from '../context/AppContext'

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Get started with AI skills',
    cta: 'Get started',
    ctaLink: '/signup',
    highlighted: false,
    features: [
      { text: 'Browse all public skills', included: true },
      { text: 'Copy up to 10 skills/day', included: true },
      { text: 'Save up to 5 skills', included: true },
      { text: 'Submit skills for review', included: true },
      { text: 'Community support', included: true },
      { text: 'Premium skills', included: false },
      { text: 'Unlimited saves', included: false },
      { text: 'Collections & folders', included: false },
      { text: 'Early access to new skills', included: false },
      { text: 'Priority submissions', included: false },
    ]
  },
  {
    name: 'Pro',
    price: '$10',
    period: '/month',
    description: 'For power users and teams',
    cta: 'Upgrade to Pro',
    ctaLink: '/signup',
    highlighted: true,
    features: [
      { text: 'Browse all public skills', included: true },
      { text: 'Unlimited copies', included: true },
      { text: 'Unlimited saves', included: true },
      { text: 'Submit skills for review', included: true },
      { text: 'Priority support', included: true },
      { text: 'Premium skills library', included: true },
      { text: 'Collections & folders', included: true },
      { text: 'Early access to new skills', included: true },
      { text: 'Priority submissions', included: true },
      { text: 'Contributor badge', included: true },
    ]
  }
]

const FAQS = [
  {
    q: 'What are AI skills?',
    a: 'AI skills are reusable instruction sets that tell AI tools like Claude Code, Cursor, or ChatGPT how to perform specific tasks. Think of them as "recipes" for AI — they encode best practices and workflows that you can install and use instantly.'
  },
  {
    q: 'What\'s included in Premium skills?',
    a: 'Premium skills are more comprehensive, thoroughly tested, and regularly updated by verified contributors. They often include advanced features like multi-step workflows, framework-specific variants, and detailed documentation.'
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes! You can cancel your Pro subscription at any time. You\'ll continue to have access until the end of your billing period.'
  },
  {
    q: 'Can I submit skills on the free plan?',
    a: 'Yes! Anyone can submit skills. Pro users get priority review, meaning their submissions are reviewed and published faster.'
  },
  {
    q: 'Do skills work with all AI tools?',
    a: 'Skills are tagged by platform (Claude Code, Cursor, ChatGPT, etc.). Many skills are labeled "Universal" and work across multiple tools. Check the platform tag on each skill for compatibility.'
  },
]

export default function Pricing() {
  const { user, isPro, upgradeToPro } = useApp()

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 text-sm font-medium mb-4">
          <Crown className="w-4 h-4" />
          Simple pricing
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-surface-900 mb-4">
          Free to start,{' '}
          <span className="gradient-text">Pro to unlock</span>
        </h1>
        <p className="text-lg text-surface-500 max-w-xl mx-auto">
          Browse and use skills for free. Upgrade to Pro for unlimited access, premium skills, and collections.
        </p>
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
        {PLANS.map(plan => (
          <div
            key={plan.name}
            className={`rounded-2xl p-8 ${
              plan.highlighted
                ? 'gradient-border bg-white shadow-lg ring-2 ring-primary-500/20'
                : 'bg-white border border-surface-200'
            }`}
          >
            {plan.highlighted && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full gradient-bg text-white text-xs font-semibold mb-4">
                <Sparkles className="w-3 h-3" /> Most Popular
              </div>
            )}

            <h3 className="text-xl font-bold text-surface-900 mb-1">{plan.name}</h3>
            <p className="text-sm text-surface-500 mb-4">{plan.description}</p>

            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-extrabold text-surface-900">{plan.price}</span>
              <span className="text-surface-500">{plan.period}</span>
            </div>

            {user && isPro && plan.highlighted ? (
              <div className="w-full py-3 rounded-xl bg-green-50 text-green-700 font-semibold text-center mb-6">
                Current plan
              </div>
            ) : user && !isPro && plan.highlighted ? (
              <button
                onClick={upgradeToPro}
                className="w-full py-3 rounded-xl gradient-bg text-white font-semibold hover:opacity-90 transition-opacity mb-6"
              >
                {plan.cta}
              </button>
            ) : (
              <Link
                to={user ? '/library' : plan.ctaLink}
                className={`block w-full py-3 rounded-xl font-semibold text-center no-underline mb-6 transition-colors ${
                  plan.highlighted
                    ? 'gradient-bg text-white hover:opacity-90'
                    : 'border border-surface-200 text-surface-700 hover:bg-surface-50'
                }`}
              >
                {user ? 'Current plan' : plan.cta}
              </Link>
            )}

            <div className="space-y-3">
              {plan.features.map((feat, i) => (
                <div key={i} className="flex items-center gap-3">
                  {feat.included ? (
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-surface-100 flex items-center justify-center">
                      <X className="w-3 h-3 text-surface-400" />
                    </div>
                  )}
                  <span className={`text-sm ${feat.included ? 'text-surface-700' : 'text-surface-400'}`}>
                    {feat.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-surface-900 text-center mb-10">Frequently asked questions</h2>
        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <details key={i} className="group bg-white rounded-xl border border-surface-200 overflow-hidden">
              <summary className="flex items-center justify-between px-6 py-4 cursor-pointer text-surface-900 font-semibold text-sm hover:bg-surface-50 transition-colors">
                {faq.q}
                <span className="text-surface-400 group-open:rotate-45 transition-transform text-xl ml-4">+</span>
              </summary>
              <div className="px-6 pb-4">
                <p className="text-sm text-surface-500 leading-relaxed">{faq.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  )
}
