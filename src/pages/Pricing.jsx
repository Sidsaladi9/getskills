import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, X, Sparkles, Crown, ChevronDown } from 'lucide-react'
import { useApp } from '../context/AppContext'

const STRIPE_MONTHLY_LINK = import.meta.env.VITE_STRIPE_MONTHLY_LINK || ''
const STRIPE_YEARLY_LINK = import.meta.env.VITE_STRIPE_YEARLY_LINK || ''

const FREE_FEATURES = [
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

const PRO_FEATURES = [
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

const FAQS = [
  {
    q: 'What are AI skills?',
    a: 'AI skills are reusable instruction sets that tell AI tools like Claude Code, Cursor, or ChatGPT how to perform specific tasks. Think of them as "recipes" for AI -- they encode best practices and workflows that you can install and use instantly.',
  },
  {
    q: "What's included in Premium skills?",
    a: 'Premium skills are more comprehensive, thoroughly tested, and regularly updated by verified contributors. They often include advanced features like multi-step workflows, framework-specific variants, and detailed documentation.',
  },
  {
    q: 'Can I cancel anytime?',
    a: "Yes! You can cancel your Pro subscription at any time. You'll continue to have access until the end of your billing period.",
  },
  {
    q: 'Can I submit skills on the free plan?',
    a: 'Yes! Anyone can submit skills. Pro users get priority review, meaning their submissions are reviewed and published faster.',
  },
  {
    q: 'Do skills work with all AI tools?',
    a: 'Skills are tagged by platform (Claude Code, Cursor, ChatGPT, etc.). Many skills are labeled "Universal" and work across multiple tools. Check the platform tag on each skill for compatibility.',
  },
]

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-white rounded-xl border border-surface-200 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-6 py-4 text-left text-surface-900 font-semibold text-sm hover:bg-surface-50 transition-colors"
      >
        {q}
        <ChevronDown
          className={`w-5 h-5 text-surface-400 transition-transform shrink-0 ml-4 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      {open && (
        <div className="px-6 pb-4">
          <p className="text-sm text-surface-500 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  )
}

export default function Pricing() {
  const { user, isPro } = useApp()
  const [billing, setBilling] = useState('monthly') // 'monthly' | 'yearly'

  const handleUpgrade = () => {
    const link = billing === 'yearly' ? STRIPE_YEARLY_LINK : STRIPE_MONTHLY_LINK
    if (!link) {
      alert('Stripe payment is not configured yet. Please check back soon!')
      return
    }
    // Append user email as prefilled param if available
    const url = user?.email ? `${link}?prefilled_email=${encodeURIComponent(user.email)}` : link
    window.location.href = url
  }

  const proPrice = billing === 'yearly' ? '$12.50' : '$14.99'
  const proPeriod = '/month'
  const yearSavings = billing === 'yearly'

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 text-[#FF6B6B] text-sm font-medium mb-4">
          <Crown className="w-4 h-4" />
          Simple pricing
        </div>
        <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-surface-900 mb-4">
          Simple, transparent pricing
        </h1>
        <p className="text-lg text-surface-500 max-w-xl mx-auto">
          Browse and use skills for free. Upgrade to Pro for unlimited access, premium skills, and collections.
        </p>
      </div>

      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-3 mb-12">
        <span className={`text-sm font-medium ${billing === 'monthly' ? 'text-surface-900' : 'text-surface-400'}`}>Monthly</span>
        <button
          onClick={() => setBilling(billing === 'monthly' ? 'yearly' : 'monthly')}
          className={`relative w-12 h-7 rounded-full transition-colors ${billing === 'yearly' ? 'bg-[#FF6B6B]' : 'bg-surface-300'}`}
        >
          <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${billing === 'yearly' ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
        <span className={`text-sm font-medium ${billing === 'yearly' ? 'text-surface-900' : 'text-surface-400'}`}>
          Yearly
          <span className="ml-1.5 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">Save 17%</span>
        </span>
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
        {/* Free Plan */}
        <div className="rounded-2xl p-8 bg-white border border-surface-200">
          <h3 className="text-xl font-heading font-bold text-surface-900 mb-1">Free</h3>
          <p className="text-sm text-surface-500 mb-4">Get started with AI skills</p>

          <div className="flex items-baseline gap-1 mb-6">
            <span className="text-4xl font-heading font-extrabold text-surface-900">$0</span>
            <span className="text-surface-500">/month</span>
          </div>

          <Link
            to={user ? '/library' : '/signup'}
            className="block w-full py-3 rounded-xl font-semibold text-center no-underline mb-6 transition-colors border border-surface-200 text-surface-700 hover:bg-surface-50"
          >
            {user ? 'Current plan' : 'Get Started'}
          </Link>

          <div className="space-y-3">
            {FREE_FEATURES.map((feat, i) => (
              <div key={i} className="flex items-center gap-3">
                {feat.included ? (
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full bg-surface-100 flex items-center justify-center shrink-0">
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

        {/* Pro Plan */}
        <div className="rounded-2xl p-8 bg-white shadow-lg border-2 border-[#FF6B6B] ring-4 ring-[#FF6B6B]/10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF6B6B] text-white text-xs font-semibold mb-4">
            <Sparkles className="w-3 h-3" /> Most Popular
          </div>

          <h3 className="text-xl font-heading font-bold text-surface-900 mb-1">Pro</h3>
          <p className="text-sm text-surface-500 mb-4">For power users and teams</p>

          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-4xl font-heading font-extrabold text-surface-900">{proPrice}</span>
            <span className="text-surface-500">{proPeriod}</span>
          </div>
          {yearSavings && (
            <p className="text-sm text-green-600 font-medium mb-4">Billed as $150/year (save $30)</p>
          )}
          {!yearSavings && <div className="mb-4" />}

          {user && isPro ? (
            <div className="w-full py-3 rounded-xl bg-green-50 text-green-700 font-semibold text-center mb-6">
              Current plan
            </div>
          ) : user ? (
            <button
              onClick={handleUpgrade}
              className="w-full py-3 rounded-xl bg-[#FF6B6B] text-white font-semibold hover:bg-[#E85555] transition-colors mb-6"
            >
              Upgrade to Pro
            </button>
          ) : (
            <Link
              to="/signup"
              className="block w-full py-3 rounded-xl bg-[#FF6B6B] text-white font-semibold hover:bg-[#E85555] transition-colors mb-6 text-center no-underline"
            >
              Upgrade to Pro
            </Link>
          )}

          <div className="space-y-3">
            {PRO_FEATURES.map((feat, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-green-600" />
                </div>
                <span className="text-sm text-surface-700">{feat.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-heading font-bold text-surface-900 text-center mb-10">
          Frequently asked questions
        </h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <FaqItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </div>
  )
}
