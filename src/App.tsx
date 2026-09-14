import { useState, useEffect } from "react"
import storyImage from "./images/our-story.jpg"
import { isSupabaseConfigured, supabase } from "./lib/supabase"

type ToastState = {
  title: string
  message: string
  type: "confirm" | "success" | "error"
  confirmLabel?: string
  cancelLabel?: string
  onConfirm?: () => void | Promise<void>
  onCancel?: () => void
}

function ToastHost({
  toast,
  onClose,
}: {
  toast: ToastState | null
  onClose: () => void
}) {
  if (!toast) return null

  return (
    <div className="fixed right-4 top-4 z-[60] w-[min(92vw,360px)]">
      <div className="toast-card rounded-xl border border-[#d4b896] bg-[#faf6f0]/95 p-4 shadow-xl backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-[#f2ebe0] text-[#4a3728]">
            {toast.type === "confirm" ? "!" : toast.type === "success" ? "✓" : "×"}
          </div>

          <div className="flex-1">
            <p className="font-display text-2xl italic text-[#4a3728] leading-none">
              {toast.title}
            </p>
            <p className="mt-2 font-body text-sm text-[#7a5c48] leading-relaxed">
              {toast.message}
            </p>

            {toast.type === "confirm" ? (
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => {
                    toast.onConfirm?.()
                    onClose()
                  }}
                  className="flex-1 bg-[#4a3728] px-3 py-2 font-body text-[10px] uppercase tracking-[0.2em] text-[#faf6f0] transition-colors hover:bg-[#b89a6a]"
                >
                  {toast.confirmLabel ?? "Confirm"}
                </button>
                <button
                  onClick={() => {
                    toast.onCancel?.()
                    onClose()
                  }}
                  className="flex-1 border border-[#d4b896] bg-transparent px-3 py-2 font-body text-[10px] uppercase tracking-[0.2em] text-[#4a3728] transition-colors hover:bg-[#f2ebe0]"
                >
                  {toast.cancelLabel ?? "Cancel"}
                </button>
              </div>
            ) : (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={onClose}
                  className="border border-[#d4b896] bg-transparent px-3 py-2 font-body text-[10px] uppercase tracking-[0.2em] text-[#4a3728] transition-colors hover:bg-[#f2ebe0]"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Nav ─────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", handler)
    return () => window.removeEventListener("scroll", handler)
  }, [])

  const links = [
    { label: "Our Story", href: "#story" },
    { label: "Wedding", href: "#wedding" },
    { label: "RSVP", href: "#rsvp" },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#faf6f0]/95 backdrop-blur shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <a
          href="#hero"
          className="font-display text-xl italic tracking-wide text-[#4a3728] hover:text-[#b89a6a] transition-colors"
        >
          A &amp; CJ
        </a>

        <div className="hidden md:flex gap-8">
          {links.map((l) => (
            <a key={l.label} href={l.href} className="nav-link">
              {l.label}
            </a>
          ))}
        </div>

        <button
          className="md:hidden text-[#4a3728] hover:text-[#b89a6a] transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            {menuOpen ? (
              <path strokeLinecap="round" d="M6 6l12 12M6 18L18 6" />
            ) : (
              <path strokeLinecap="round" d="M4 8h16M4 16h16" />
            )}
          </svg>
        </button>
      </div>

      <div
        className={`md:hidden bg-[#faf6f0]/98 backdrop-blur overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-40 border-t border-[#e8dfd4]" : "max-h-0"
        }`}
      >
        <div className="flex flex-col gap-1 px-6 py-4">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="nav-link py-2"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}

function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1789212883715-0b06581d1791?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Couple walking on a beach in the Philippines"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#2a1a0e]/55 via-[#3b2416]/40 to-[#1a0e06]/70" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#faf6f0] to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6 pt-24 pb-20">
        <p className="font-body text-[#d4b896] tracking-[0.35em] text-xs uppercase mb-6">
          Together Forever
        </p>

        <h1 className="font-display font-light text-white leading-none mb-4">
          <span className="block text-6xl md:text-8xl lg:text-9xl italic">
            Aileen
          </span>
          <span className="block text-[#d4b896] font-body font-light tracking-[0.4em] text-sm md:text-base my-3 uppercase">
            &amp;
          </span>
          <span className="block text-6xl md:text-8xl lg:text-9xl italic">
            Christian Jade
          </span>
        </h1>

        <div className="flex items-center gap-4 my-8 w-56">
          <div className="flex-1 h-px bg-[#d4b896]/60" />
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#d4b896" opacity="0.85">
            <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
          </svg>
          <div className="flex-1 h-px bg-[#d4b896]/60" />
        </div>

        <div className="text-center">
          <p className="font-display text-[#d4b896] text-2xl md:text-3xl italic font-light mb-1">
            March 06, 2027
          </p>
          <p className="font-body text-white/70 tracking-[0.25em] text-xs uppercase">
            Cebu City, Philippines
          </p>
        </div>

        <a
          href="#rsvp"
          className="mt-10 inline-block border border-[#d4b896]/70 text-[#d4b896] font-body tracking-[0.25em] text-xs uppercase px-8 py-3 hover:bg-[#d4b896] hover:text-[#2a1a0e] transition-all duration-300"
        >
          RSVP
        </a>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4b896" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  )
}

function WeddingDetails() {
  const details = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      ),
      title: "The Date",
      line1: "March 06, 2027",
      line2: "Saturday · 4:00 PM",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7z" />
          <circle cx="12" cy="9" r="2.5" />
        </svg>
      ),
      title: "The Venue",
      line1: "Feliz Hotel & Events",
      line2: "Bais City, Philippines",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
        </svg>
      ),
      title: "Reception",
      line1: "Feliz Hotel & Events",
      line2: "Bais City, Philippines",
    },
  ]

  return (
    <section id="wedding" className="bg-[#f2ebe0] py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-body text-[#b89a6a] tracking-[0.3em] text-xs uppercase mb-3">
            Save the Date
          </p>
          <h2 className="font-display font-light text-[#4a3728] text-5xl md:text-6xl italic mb-6">
            Wedding Day
          </h2>
          <div className="divider-floral justify-center w-48 mx-auto">
            <span className="text-[#b89a6a] text-lg">✦</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {details.map((d) => (
            <div
              key={d.title}
              className="bg-[#faf6f0] border border-[#e8dfd4] p-10 flex flex-col items-center text-center gap-4 hover:shadow-md hover:border-[#d4b896] transition-all duration-300"
            >
              <div className="text-[#b89a6a]">{d.icon}</div>
              <h3 className="font-body tracking-[0.2em] text-xs uppercase text-[#7a5c48]">
                {d.title}
              </h3>
              <div>
                <p className="font-display text-[#4a3728] text-xl italic font-light">
                  {d.line1}
                </p>
                <p className="font-body text-[#7a5c48] text-sm mt-1">{d.line2}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function OurStory() {
  const milestones = [
    {
      year: "2019",
      title: "First Meeting",
      body: "It began with a chance encounter at a mutual friend's birthday gathering in Cebu City. Christian Jade noticed Aileen across the room — her laughter, her warmth — and found a reason to say hello. By the end of the night, neither wanted to leave.",
    },
    {
      year: "2021",
      title: "Making It Official",
      body: "Two years of late-night conversations, long drives along the Cebu coastline, and Sunday mornings at the market later, Christian Jade asked Aileen to be his. She said yes before he could even finish the question.",
    },
    {
      year: "2024",
      title: "The Proposal",
      body: "On a quiet evening at Tops Lookout with the lights of Cebu spread below them, Christian Jade got down on one knee. With trembling hands and a full heart, he asked Aileen to spend forever with him. She cried. He cried. The city glittered.",
    },
    {
      year: "2026",
      title: "Forever Begins",
      body: "Now they invite their family and friends to witness the start of their greatest adventure — two souls, one life, rooted in the island they love.",
    },
  ]

  return (
    <section id="story" className="bg-[#faf6f0] py-28 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <p className="font-body text-[#b89a6a] tracking-[0.3em] text-xs uppercase mb-3">
            How It All Began
          </p>
          <h2 className="font-display font-light text-[#4a3728] text-5xl md:text-6xl italic mb-6">
            Our Story
          </h2>
          <div className="divider-floral justify-center w-48 mx-auto">
            <span className="text-[#b89a6a] text-lg">✦</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-full h-full border border-[#d4b896]/40" />
            <img
              src="/our-story.jpg"
              alt="Couple walking through lush greenery"
              className="w-full h-[480px] object-cover relative z-10"
            />
          </div>
          <div>
            <p className="font-display italic text-[#4a3728] text-2xl md:text-3xl font-light leading-relaxed mb-6">
              "Love is not just looking at each other, it's looking in the same direction."
            </p>
            <p className="font-body text-[#7a5c48] leading-relaxed text-sm">
              Aileen and Christian Jade found each other in the heart of Cebu — a city of festivals, faith, and the sea. Theirs is a story of friendship that grew roots, of trust that deepened with every passing season.
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-[#e8dfd4] md:-translate-x-px" />

          <div className="space-y-16">
            {milestones.map((m, i) => (
              <div
                key={m.year}
                className={`relative flex flex-col md:flex-row gap-8 md:gap-12 ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <div className="absolute left-4 md:left-1/2 top-1 w-3 h-3 rounded-full bg-[#b89a6a] border-2 border-[#faf6f0] md:-translate-x-1/2 z-10" />

                <div
                  className={`pl-12 md:pl-0 md:w-1/2 ${
                    i % 2 === 0 ? "md:pr-16 md:text-right" : "md:pl-16"
                  }`}
                >
                  <span className="font-body text-[#b89a6a] tracking-[0.2em] text-xs uppercase">
                    {m.year}
                  </span>
                  <h3 className="font-display text-[#4a3728] text-2xl italic font-light mt-1 mb-3">
                    {m.title}
                  </h3>
                  <p className="font-body text-[#7a5c48] text-sm leading-relaxed">{m.body}</p>
                </div>

                <div className="hidden md:block md:w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function RSVP() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    guests: "1",
    attendance: "attending",
    meal: "no-preference",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    try {
      if (supabase) {
        const { error: insertError } = await supabase.from("rsvps").insert({
          name: form.name,
          email: form.email,
          guests: Number(form.guests),
          attendance: form.attendance,
          meal: form.meal,
          message: form.message || null,
        })

        if (insertError) {
          throw insertError
        }
      }

      setSubmitted(true)
    } catch (submitError) {
      console.error("RSVP submit error:", submitError)
      setError("We could not save your RSVP right now. Please try again in a moment.")
    } finally {
      setSaving(false)
    }
  }

  const inputClass =
    "w-full bg-transparent border-b border-[#d4b896] py-3 text-[#4a3728] font-body text-sm placeholder-[#b89a6a]/60 focus:outline-none focus:border-[#8c6e3f] transition-colors duration-200"
  const labelClass =
    "block font-body tracking-[0.15em] text-[#7a5c48] text-xs uppercase mb-1"

  return (
    <section id="rsvp" className="bg-[#f2ebe0] py-28 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-body text-[#b89a6a] tracking-[0.3em] text-xs uppercase mb-3">
            Join Us
          </p>
          <h2 className="font-display font-light text-[#4a3728] text-5xl md:text-6xl italic mb-6">
            RSVP
          </h2>
          <div className="divider-floral justify-center w-48 mx-auto mb-6">
            <span className="text-[#b89a6a] text-lg">✦</span>
          </div>
          <p className="font-body text-[#7a5c48] text-sm leading-relaxed">
            Please let us know by <strong className="font-medium text-[#4a3728]">January 15, 2026</strong> whether you'll be joining us for our special day.
          </p>
        </div>

        {submitted ? (
          <div className="text-center bg-[#faf6f0] border border-[#d4b896] py-16 px-8">
            <div className="text-[#b89a6a] text-4xl mb-4">♡</div>
            <h3 className="font-display italic text-[#4a3728] text-3xl font-light mb-3">
              Thank you, {form.name}!
            </h3>
            <p className="font-body text-[#7a5c48] text-sm">
              {form.attendance === "attending"
                ? "We can't wait to celebrate with you. See you on February 14!"
                : "We'll miss you, but we're grateful for your love and warm wishes."}
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-[#faf6f0] border border-[#e8dfd4] p-10 md:p-14 space-y-8"
          >
            <div>
              <label className={labelClass}>Full Name</label>
              <input
                type="text"
                required
                placeholder="Your full name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Email Address</label>
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className={labelClass}>Attendance</label>
                <div className="flex flex-col gap-2 mt-2">
                  {[
                    { value: "attending", label: "Joyfully Attending" },
                    { value: "not-attending", label: "Regretfully Decline" },
                  ].map((opt) => (
                    <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
                      <span
                        className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${
                          form.attendance === opt.value
                            ? "border-[#b89a6a] bg-[#b89a6a]"
                            : "border-[#d4b896] group-hover:border-[#b89a6a]"
                        }`}
                      >
                        {form.attendance === opt.value && (
                          <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </span>
                      <span
                        className="font-body text-xs text-[#7a5c48]"
                        onClick={() => update("attendance", opt.value)}
                      >
                        {opt.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelClass}>Number of Guests</label>
                <select
                  value={form.guests}
                  onChange={(e) => update("guests", e.target.value)}
                  className={`${inputClass} cursor-pointer`}
                >
                  {["1", "2", "3", "4"].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === "1" ? "Guest" : "Guests"}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>Meal Preference</label>
              <select
                value={form.meal}
                onChange={(e) => update("meal", e.target.value)}
                className={`${inputClass} cursor-pointer`}
              >
                <option value="no-preference">No Preference</option>
                <option value="meat">Meat</option>
                <option value="seafood">Seafood</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Message to the Couple (Optional)</label>
              <textarea
                rows={3}
                placeholder="Share your wishes..."
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                className={`${inputClass} resize-none`}
              />
            </div>

            {error ? <p className="font-body text-sm text-red-600">{error}</p> : null}

            <div className="pt-4 text-center">
              <button
                type="submit"
                disabled={saving}
                aria-busy={saving}
                className="bg-[#4a3728] text-[#faf6f0] font-body tracking-[0.25em] text-xs uppercase px-12 py-4 hover:bg-[#b89a6a] transition-colors duration-300 w-full md:w-auto disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <span className="inline-flex items-center justify-center gap-3">
                    <span className="loading-spinner" />
                    Sending...
                  </span>
                ) : (
                  "Send RSVP"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-[#4a3728] text-[#d4b896] py-14 px-6 text-center">
      <p className="font-display italic text-3xl mb-2">Aileen &amp; Christian Jade</p>
      <p className="font-body text-xs tracking-[0.25em] uppercase text-[#d4b896]/60 mb-6">
        February 14, 2026 · Cebu City
      </p>
      <div className="flex items-center justify-center gap-4 mb-8">
        <div className="flex-1 max-w-20 h-px bg-[#d4b896]/30" />
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#d4b896" opacity="0.5">
          <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
        </svg>
        <div className="flex-1 max-w-20 h-px bg-[#d4b896]/30" />
      </div>
      <p className="font-body text-xs text-[#d4b896]/40 tracking-widest">#AileenAndCJ2026</p>
    </footer>
  )
}

function AdminPanel() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const [error, setError] = useState("")
  const [toast, setToast] = useState<ToastState | null>(null)
  const [session, setSession] = useState<null | { user?: { email?: string } }>(null)
  const [rsvps, setRsvps] = useState<Array<{
    id: string
    name: string
    email: string
    guests: number
    attendance: string
    meal: string
    message: string | null
    created_at: string
  }>>([])
  const [loadingRsvps, setLoadingRsvps] = useState(false)

  useEffect(() => {
    const client = supabase
    if (!client) return

    const initializeSession = async () => {
      const { data } = await client.auth.getSession()
      setSession(data.session)
    }

    initializeSession()

    const { data: authListener } = client.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    const client = supabase
    if (!client || !session) {
      setRsvps([])
      return
    }

    const fetchRsvps = async () => {
      setLoadingRsvps(true)
      const { data, error: fetchError } = await client
        .from("rsvps")
        .select("*")
        .order("created_at", { ascending: false })

      if (!fetchError) {
        setRsvps(data ?? [])
      }

      setLoadingRsvps(false)
    }

    fetchRsvps()
  }, [session])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const client = supabase
    if (!client) {
      setError("Add your Supabase URL and anon key to enable login.")
      return
    }

    setLoading(true)
    setError("")

    const { error: loginError } = await client.auth.signInWithPassword({
      email,
      password,
    })

    if (loginError) {
      setError(loginError.message)
    }

    setLoading(false)
  }

  const handleSignOut = () => {
    const client = supabase
    if (!client) return

    setToast({
      type: "confirm",
      title: "Log out?",
      message: "Are you sure you want to log out of the admin dashboard?",
      confirmLabel: "Yes, log out",
      cancelLabel: "Stay signed in",
      onConfirm: async () => {
        setSigningOut(true)
        await client.auth.signOut()
        setSession(null)
        setEmail("")
        setPassword("")
        setSigningOut(false)
      },
      onCancel: () => {
        setToast(null)
      },
    })
  }

  if (!isSupabaseConfigured()) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-[#faf6f0] border border-[#d4b896] p-8 text-center">
          <p className="font-body tracking-[0.2em] text-[#b89a6a] text-xs uppercase mb-3">
            Admin Access
          </p>
          <h3 className="font-display text-[#4a3728] text-3xl italic mb-4">
            Supabase not configured yet
          </h3>
          <p className="font-body text-[#7a5c48] text-sm leading-relaxed">
            Add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY values to the environment to enable login and RSVP storage.
          </p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="max-w-md mx-auto px-6 py-12">
        <div className="bg-[#faf6f0] border border-[#e8dfd4] p-8 md:p-10">
          <p className="font-body tracking-[0.2em] text-[#b89a6a] text-xs uppercase mb-3 text-center">
            Admin Login
          </p>
          <h3 className="font-display text-[#4a3728] text-4xl italic text-center mb-8">
            Welcome back
          </h3>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block font-body tracking-[0.15em] text-[#7a5c48] text-xs uppercase mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-[#d4b896] bg-white px-4 py-3 text-[#4a3728] focus:outline-none focus:border-[#8c6e3f]"
              />
            </div>

            <div>
              <label className="block font-body tracking-[0.15em] text-[#7a5c48] text-xs uppercase mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-[#d4b896] bg-white px-4 py-3 text-[#4a3728] focus:outline-none focus:border-[#8c6e3f]"
              />
            </div>

            {error ? <p className="font-body text-sm text-red-600">{error}</p> : null}

            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="w-full bg-[#4a3728] text-[#faf6f0] font-body tracking-[0.2em] text-xs uppercase px-6 py-4 hover:bg-[#b89a6a] transition-colors duration-300 disabled:opacity-60"
            >
              {loading ? (
                <span className="inline-flex items-center justify-center gap-3">
                  <span className="loading-spinner" />
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>
      </div>
    )
  }

  const attendingCount = rsvps.filter((item) => item.attendance === "attending").length
  const guestCount = rsvps.reduce((sum, item) => sum + Number(item.guests || 0), 0)

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <ToastHost toast={toast} onClose={() => setToast(null)} />

      <div className="bg-[#faf6f0] border border-[#e8dfd4] p-6 md:p-8 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <p className="font-body tracking-[0.2em] text-[#b89a6a] text-xs uppercase mb-2">
            Admin Dashboard
          </p>
          <h3 className="font-display text-[#4a3728] text-4xl italic">
            Wedding RSVPs
          </h3>
        </div>

        <div className="flex items-center gap-4">
          <span className="font-body text-sm text-[#7a5c48]">
            {session.user?.email ?? "Signed in"}
          </span>
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            aria-busy={signingOut}
            className="border border-[#d4b896] px-5 py-2 font-body tracking-[0.2em] text-[10px] uppercase text-[#4a3728] hover:bg-[#f2ebe0] transition-colors disabled:opacity-60"
          >
            {signingOut ? (
              <span className="inline-flex items-center gap-2">
                <span className="loading-spinner" />
                Logging out
              </span>
            ) : (
              "Sign out"
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#f2ebe0] border border-[#d4b896] p-5">
          <p className="font-body tracking-[0.2em] text-[#7a5c48] text-[10px] uppercase">Total RSVPs</p>
          <p className="font-display text-[#4a3728] text-4xl italic mt-3">{rsvps.length}</p>
        </div>
        <div className="bg-[#f2ebe0] border border-[#d4b896] p-5">
          <p className="font-body tracking-[0.2em] text-[#7a5c48] text-[10px] uppercase">Attending</p>
          <p className="font-display text-[#4a3728] text-4xl italic mt-3">{attendingCount}</p>
        </div>
        <div className="bg-[#f2ebe0] border border-[#d4b896] p-5">
          <p className="font-body tracking-[0.2em] text-[#7a5c48] text-[10px] uppercase">Guest Seats</p>
          <p className="font-display text-[#4a3728] text-4xl italic mt-3">{guestCount}</p>
        </div>
      </div>

      <div className="bg-[#faf6f0] border border-[#e8dfd4] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-[#f2ebe0] text-[#4a3728]">
              <tr>
                <th className="px-4 py-3 font-body tracking-[0.15em] text-[10px] uppercase">Name</th>
                <th className="px-4 py-3 font-body tracking-[0.15em] text-[10px] uppercase">Email</th>
                <th className="px-4 py-3 font-body tracking-[0.15em] text-[10px] uppercase">Guests</th>
                <th className="px-4 py-3 font-body tracking-[0.15em] text-[10px] uppercase">Attendance</th>
                <th className="px-4 py-3 font-body tracking-[0.15em] text-[10px] uppercase">Meal</th>
                <th className="px-4 py-3 font-body tracking-[0.15em] text-[10px] uppercase">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {loadingRsvps ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center font-body text-[#7a5c48]">
                    Loading RSVPs...
                  </td>
                </tr>
              ) : rsvps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center font-body text-[#7a5c48]">
                    No RSVP submissions yet.
                  </td>
                </tr>
              ) : (
                rsvps.map((item) => (
                  <tr key={item.id} className="border-t border-[#e8dfd4] align-top">
                    <td className="px-4 py-3 font-body text-sm text-[#4a3728]">
                      {item.name}
                      {item.message ? (
                        <div className="mt-2 text-[11px] text-[#7a5c48] italic">“{item.message}”</div>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 font-body text-sm text-[#4a3728]">{item.email}</td>
                    <td className="px-4 py-3 font-body text-sm text-[#4a3728]">{item.guests}</td>
                    <td className="px-4 py-3 font-body text-sm text-[#4a3728]">{item.attendance}</td>
                    <td className="px-4 py-3 font-body text-sm text-[#4a3728]">{item.meal}</td>
                    <td className="px-4 py-3 font-body text-sm text-[#4a3728]">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [isAdminRoute, setIsAdminRoute] = useState(() =>
    typeof window !== "undefined" && window.location.pathname.startsWith("/admin")
  )

  useEffect(() => {
    const syncRoute = () => {
      const isAdmin = window.location.pathname.startsWith("/admin")
      setIsAdminRoute(isAdmin)
    }

    syncRoute()
    window.addEventListener("popstate", syncRoute)

    return () => {
      window.removeEventListener("popstate", syncRoute)
    }
  }, [])

  return (
    <div className="min-h-screen">
      {isAdminRoute ? (
        <div className="pt-20 pb-12">
          <AdminPanel />
        </div>
      ) : (
        <>
          <Nav />
          <Hero />
          <WeddingDetails />
          <OurStory />
          <RSVP />
          <Footer />
        </>
      )}
    </div>
  )
}
